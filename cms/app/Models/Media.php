<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Media extends Model
{
    protected $table = 'media';

    protected $fillable = [
        'disk',
        'path',
        'original_filename',
        'mime_type',
        'size_bytes',
        'width',
        'height',
        'hash_sha256',
        'source_url',
    ];

    protected $casts = [
        'size_bytes' => 'integer',
        'width'      => 'integer',
        'height'     => 'integer',
    ];

    // ── Relationships ─────────────────────────────────────────────────

    public function translations(): HasMany
    {
        return $this->hasMany(MediaTranslation::class);
    }

    // ── Helpers ───────────────────────────────────────────────────────

    public function url(): string
    {
        if ($this->disk === 'local') {
            return config('app.url') . '/storage/' . ltrim($this->path, '/');
        }

        return $this->path; // cdn / s3 absolute URL stored directly
    }

    public function altText(string $lang): ?string
    {
        return $this->translations
            ->firstWhere('lang', $lang)
            ?->alt_text;
    }
}
