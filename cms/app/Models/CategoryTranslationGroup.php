<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class CategoryTranslationGroup extends Model
{
    protected $fillable = ['uuid'];

    protected static function booted(): void
    {
        static::creating(function (CategoryTranslationGroup $group) {
            if (empty($group->uuid)) {
                $group->uuid = (string) Str::uuid();
            }
        });
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class, 'translation_group_id');
    }
}
