<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    protected $fillable = [
        'lang',
        'translation_group_id',
        'user_id',
        'avatar_media_id',
        'name',
        'slug',
        'title',
        'bio',
        'email',
        'twitter',
        'linkedin',
        'website',
    ];

    // ── Relationships ─────────────────────────────────────────────────

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'lang', 'code');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'avatar_media_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
