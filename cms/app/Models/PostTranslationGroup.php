<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class PostTranslationGroup extends Model
{
    protected $fillable = [
        'uuid',
        'x_default_lang',
        'notes',
    ];

    protected static function booted(): void
    {
        static::creating(function (PostTranslationGroup $group) {
            if (empty($group->uuid)) {
                $group->uuid = (string) Str::uuid();
            }
        });
    }

    // ── Relationships ─────────────────────────────────────────────────

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'translation_group_id');
    }

    /** The language record designated as x-default. */
    public function xDefaultLanguage(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'x_default_lang', 'code');
    }

    // ── Model Methods ─────────────────────────────────────────────────

    /**
     * Return all published posts in this group, keyed by language code.
     *
     * @return \Illuminate\Database\Eloquent\Collection<string, Post>
     */
    public function postsByLanguage(): \Illuminate\Support\Collection
    {
        return $this->posts()
            ->where('status', 'published')
            ->whereNull('deleted_at')
            ->get()
            ->keyBy('lang');
    }

    /**
     * Resolve the x-default post for hreflang.
     * Priority: explicit x_default_lang → 'en' post → first published post.
     */
    public function xDefaultPost(): ?Post
    {
        $published = $this->postsByLanguage();

        if ($this->x_default_lang && $published->has($this->x_default_lang)) {
            return $published->get($this->x_default_lang);
        }

        if ($published->has('en')) {
            return $published->get('en');
        }

        return $published->first();
    }

    /**
     * Return the languages already represented in this group.
     *
     * @return array<string>
     */
    public function presentLanguages(): array
    {
        return $this->posts()
            ->whereNull('deleted_at')
            ->pluck('lang')
            ->all();
    }

    /**
     * Return language codes not yet represented in this group.
     *
     * @return array<string>
     */
    public function missingLanguages(): array
    {
        $all     = Language::where('is_active', true)->pluck('code')->all();
        $present = $this->presentLanguages();

        return array_values(array_diff($all, $present));
    }
}
