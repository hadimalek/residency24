<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Language extends Model
{
    protected $primaryKey = 'code';
    protected $keyType    = 'string';
    public    $incrementing = false;

    protected $fillable = [
        'code',
        'name',
        'native_name',
        'direction',
        'is_default',
        'is_active',
        'url_prefix',
        'sort_order',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active'  => 'boolean',
    ];

    // ── Relationships ─────────────────────────────────────────────────

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'lang', 'code');
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class, 'lang', 'code');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class, 'lang', 'code');
    }

    public function authors(): HasMany
    {
        return $this->hasMany(Author::class, 'lang', 'code');
    }

    // ── Helpers ───────────────────────────────────────────────────────

    /** Build the full URL prefix for this language (e.g. '' for en, '/fa' for fa). */
    public function urlPrefix(): string
    {
        return $this->url_prefix ?? '';
    }
}
