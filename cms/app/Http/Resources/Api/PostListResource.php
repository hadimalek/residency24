<?php

namespace App\Http\Resources\Api;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Post
 *
 * Lean shape for blog listing. Excludes content_html and content_json.
 */
class PostListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'lang'                 => $this->lang,
            'type'                 => $this->type,
            'title'                => $this->title,
            'slug'                 => $this->slug,
            'url'                  => $this->derivedPath(),
            'excerpt'              => $this->excerpt,
            'reading_time_minutes' => $this->reading_time_minutes,
            'published_at'         => optional($this->published_at)->toIso8601String(),
            'updated_at'           => optional($this->updated_at)->toIso8601String(),
            'author'               => $this->whenLoaded('author', fn () => $this->author
                ? new AuthorResource($this->author)
                : null),
            'category'             => $this->whenLoaded('category', fn () => $this->category
                ? new CategoryResource($this->category)
                : null),
            'featured_image'       => $this->whenLoaded('featuredImage', fn () => $this->featuredImage
                ? (new MediaResource($this->featuredImage))->forLang($this->lang)
                : null),
            'has_translations'     => (bool) $this->translation_group_id,
            'translation_count'    => $this->when(
                $this->relationLoaded('translationGroup') && $this->translationGroup,
                fn () => $this->translationGroup->posts->count()
            ),
        ];
    }
}
