<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostRelatedEntity extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'post_id',
        'entity_type',
        'entity_key',
        'relation',
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
