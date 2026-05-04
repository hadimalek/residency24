<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    protected $fillable = [
        'lang',
        'translation_group_id',
        'name',
        'slug',
        'description',
    ];

    // ── Relationships ─────────────────────────────────────────────────

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'lang', 'code');
    }

    public function translationGroup(): BelongsTo
    {
        return $this->belongsTo(TagTranslationGroup::class, 'translation_group_id');
    }

    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'post_tags');
    }
}
