<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostCta extends Model
{
    protected $fillable = [
        'post_id',
        'type',
        'title',
        'body',
        'button_label',
        'target_url',
        'service_context',
        'placement',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
