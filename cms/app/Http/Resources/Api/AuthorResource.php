<?php

namespace App\Http\Resources\Api;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Author */
class AuthorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name'   => $this->name,
            'slug'   => $this->slug,
            'title'  => $this->title,
            'bio'    => $this->bio,
            'avatar' => $this->whenLoaded('avatar', fn () => $this->avatar
                ? (new MediaResource($this->avatar))->forLang($this->lang)
                : null),
        ];
    }
}
