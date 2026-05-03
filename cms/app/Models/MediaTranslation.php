<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaTranslation extends Model
{
    protected $primaryKey = null;
    public    $incrementing = false;

    protected $fillable = [
        'media_id',
        'lang',
        'alt_text',
        'caption',
    ];

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'lang', 'code');
    }
}
