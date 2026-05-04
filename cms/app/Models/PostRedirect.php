<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostRedirect extends Model
{
    protected $fillable = [
        'from_path',
        'to_path',
        'to_post_id',
        'status_code',
        'source',
        'hits',
        'last_hit_at',
    ];

    protected $casts = [
        'status_code'  => 'integer',
        'hits'         => 'integer',
        'last_hit_at'  => 'datetime',
    ];

    public function targetPost(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'to_post_id');
    }

    /** Increment the hit counter and record the timestamp. */
    public function recordHit(): void
    {
        $this->increment('hits');
        $this->update(['last_hit_at' => now()]);
    }
}
