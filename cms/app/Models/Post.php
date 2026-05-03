<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Post extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'lang',
        'translation_group_id',
        'type',
        'status',
        'title',
        'slug',
        'excerpt',
        'content_html',
        'content_json',
        'reading_time_minutes',
        'author_id',
        'featured_image_id',
        'category_id',
        'canonical_url',
        'old_url',
        'source',
        'source_id',
        'published_at',
        'scheduled_at',
    ];

    protected $casts = [
        'content_json'          => 'array',
        'published_at'          => 'datetime',
        'scheduled_at'          => 'datetime',
        'reading_time_minutes'  => 'integer',
    ];

    // ── Relationships ─────────────────────────────────────────────────

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'lang', 'code');
    }

    public function translationGroup(): BelongsTo
    {
        return $this->belongsTo(PostTranslationGroup::class, 'translation_group_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    public function featuredImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'featured_image_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'post_tags');
    }

    public function media(): BelongsToMany
    {
        return $this->belongsToMany(Media::class, 'post_media')
                    ->withPivot(['role', 'sort_order'])
                    ->orderByPivot('sort_order');
    }

    public function seo(): HasOne
    {
        return $this->hasOne(PostSeo::class);
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(PostFaq::class)->orderBy('sort_order');
    }

    public function ctas(): HasMany
    {
        return $this->hasMany(PostCta::class)->orderBy('sort_order');
    }

    public function relatedEntities(): HasMany
    {
        return $this->hasMany(PostRelatedEntity::class)->orderBy('sort_order');
    }

    public function redirects(): HasMany
    {
        return $this->hasMany(PostRedirect::class, 'to_post_id');
    }

    public function importLogs(): HasMany
    {
        return $this->hasMany(PostImportLog::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(PostComment::class);
    }

    // ── Scopes ────────────────────────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    public function scopeForLang($query, string $lang)
    {
        return $query->where('lang', $lang);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // ── hreflang & Translation Group Methods ─────────────────────────

    /**
     * Return all published sibling posts in the same translation group,
     * excluding this post. Returns empty collection when no group is set.
     *
     * @return \Illuminate\Database\Eloquent\Collection<Post>
     */
    public function languageVersions(): \Illuminate\Database\Eloquent\Collection
    {
        if (! $this->translation_group_id) {
            return collect();
        }

        return static::where('translation_group_id', $this->translation_group_id)
            ->where('id', '!=', $this->id)
            ->where('status', 'published')
            ->whereNull('deleted_at')
            ->get();
    }

    /**
     * Return language codes that have no published post in this post's group.
     * Returns all active languages (minus this one) when no group is assigned.
     *
     * @return array<string>
     */
    public function missingLanguages(): array
    {
        $all = Language::where('is_active', true)->pluck('code')->all();

        if (! $this->translation_group_id) {
            return array_values(array_diff($all, [$this->lang]));
        }

        $present = static::where('translation_group_id', $this->translation_group_id)
            ->whereNull('deleted_at')
            ->pluck('lang')
            ->all();

        return array_values(array_diff($all, $present));
    }

    /**
     * Build the hreflang alternates array for this post, ready to return
     * from the API and consumed by Next.js generateMetadata().
     *
     * Each entry: { lang: string, url: string }
     * An x-default entry is included automatically.
     *
     * Returns an empty array when this post has no translation group.
     *
     * @return array<array{lang: string, url: string}>
     */
    public function hreflangAlternates(): array
    {
        if (! $this->translation_group_id) {
            return [];
        }

        $siblings = static::where('translation_group_id', $this->translation_group_id)
            ->where('status', 'published')
            ->whereNull('deleted_at')
            ->with('language')
            ->get();

        if ($siblings->isEmpty()) {
            return [];
        }

        // Resolve x-default: group setting → 'en' sibling → first sibling
        $group    = $this->translationGroup;
        $xDefault = null;

        if ($group?->x_default_lang) {
            $xDefault = $siblings->firstWhere('lang', $group->x_default_lang);
        }

        $xDefault ??= $siblings->firstWhere('lang', 'en') ?? $siblings->first();

        $alternates = $siblings->map(fn (Post $p) => [
            'lang' => $p->lang,
            'url'  => $p->canonicalUrl(),
        ])->values()->all();

        $alternates[] = [
            'lang' => 'x-default',
            'url'  => $xDefault->canonicalUrl(),
        ];

        return $alternates;
    }

    /**
     * Assign this post to a translation group.
     * Throws if the group already has a post in this post's language.
     *
     * @throws \RuntimeException
     */
    public function assignToTranslationGroup(PostTranslationGroup $group): void
    {
        $conflict = static::where('translation_group_id', $group->id)
            ->where('lang', $this->lang)
            ->where('id', '!=', $this->id)
            ->whereNull('deleted_at')
            ->exists();

        if ($conflict) {
            throw new \RuntimeException(
                "Translation group #{$group->id} already has a '{$this->lang}' post assigned."
            );
        }

        $this->translation_group_id = $group->id;
        $this->save();
    }

    /**
     * Remove this post from its translation group without deleting the post.
     */
    public function detachFromTranslationGroup(): void
    {
        $this->translation_group_id = null;
        $this->save();
    }

    // ── URL Helpers ───────────────────────────────────────────────────

    /**
     * Derive the canonical URL for this post.
     * Priority: post_seo.canonical_url → posts.canonical_url → derived path.
     */
    public function canonicalUrl(): string
    {
        $override = $this->seo?->canonical_url ?? $this->canonical_url;

        if ($override) {
            return $override;
        }

        return $this->derivedUrl();
    }

    /**
     * Build the derived URL using frontend host + language prefix + blog segment + slug.
     * The frontend URL (Next.js) is configured separately from the Laravel app URL.
     */
    public function derivedUrl(): string
    {
        $base    = config('frontend.url');
        $prefix  = $this->language?->urlPrefix() ?? '';
        $segment = config('frontend.blog_segment', 'blog');

        return $base . $prefix . '/' . trim($segment, '/') . '/' . $this->slug;
    }

    /**
     * Path-only version of the derived URL (no host).
     * Useful for sitemaps and Next.js Link hrefs.
     */
    public function derivedPath(): string
    {
        $prefix  = $this->language?->urlPrefix() ?? '';
        $segment = config('frontend.blog_segment', 'blog');

        return $prefix . '/' . trim($segment, '/') . '/' . $this->slug;
    }
}
