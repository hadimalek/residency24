<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostImportLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'batch_id',
        'source',
        'source_id',
        'source_url',
        'lang',
        'post_id',
        'status',
        'error',
        'payload_hash',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'started_at'  => 'datetime',
        'finished_at' => 'datetime',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class, 'lang', 'code');
    }
}
