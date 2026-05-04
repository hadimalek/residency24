<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'lang',
        'translation_group_id',
        'parent_id',
        'name',
        'slug',
        'description',
        'seo_title',
        'seo_description',
        'sort_order',
    ];

    // ── Relationships ─────────────────────────────────────────────────

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'lang', 'code');
    }

    public function translationGroup(): BelongsTo
    {
        return $this->belongsTo(CategoryTranslationGroup::class, 'translation_group_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
