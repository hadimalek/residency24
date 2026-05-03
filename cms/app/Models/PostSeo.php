<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostSeo extends Model
{
    protected $table = 'post_seo';

    protected $primaryKey = 'post_id';
    public    $incrementing = false;

    protected $fillable = [
        'post_id',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'robots',
        'canonical_url',
        'og_title',
        'og_description',
        'og_image_id',
        'og_type',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_image_id',
        'schema_json',
        'breadcrumbs_json',
        'imported_from',
        'imported_payload',
    ];

    protected $casts = [
        'schema_json'       => 'array',
        'breadcrumbs_json'  => 'array',
        'imported_payload'  => 'array',
    ];

    // ── Relationships ─────────────────────────────────────────────────

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function ogImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'og_image_id');
    }

    public function twitterImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'twitter_image_id');
    }
}
