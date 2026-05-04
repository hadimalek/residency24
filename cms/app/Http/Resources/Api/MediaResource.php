<?php

namespace App\Http\Resources\Api;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Media
 *
 * Shape:
 *   { url, alt, width, height, mime_type }
 *
 * Pass the request's lang via $resource->setLangContext('en') OR fall back to
 * the request lang query so alt text resolves to the right language.
 */
class MediaResource extends JsonResource
{
    protected ?string $altLang = null;

    public function forLang(string $lang): self
    {
        $this->altLang = $lang;
        return $this;
    }

    public function toArray(Request $request): array
    {
        $lang = $this->altLang ?? $request->query('lang') ?? 'en';

        return [
            'url'       => $this->url(),
            'alt'       => $this->altText($lang),
            'width'     => $this->width,
            'height'    => $this->height,
            'mime_type' => $this->mime_type,
        ];
    }
}
