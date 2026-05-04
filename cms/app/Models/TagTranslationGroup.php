<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class TagTranslationGroup extends Model
{
    protected $fillable = ['uuid'];

    protected static function booted(): void
    {
        static::creating(function (TagTranslationGroup $group) {
            if (empty($group->uuid)) {
                $group->uuid = (string) Str::uuid();
            }
        });
    }

    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class, 'translation_group_id');
    }
}
