<?php

namespace App\Http\Resources\Api;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Post
 *
 * Full shape for blog detail page. Includes:
 *   - post body + relations
 *   - SEO block ready for Next.js generateMetadata()
 *   - hreflang alternates (with x-default) computed from translation group
 *   - faqs, ctas, related entities, breadcrumbs
 */
class PostDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'post'        => $this->postPayload(),
            'seo'         => $this->seoPayload(),
            'hreflang'    => $this->hreflangAlternates(),
            'faqs'        => $this->faqs->map(fn ($f) => [
                'question'   => $f->question,
                'answer'     => $f->answer,
                'sort_order' => $f->sort_order,
            ])->all(),
            'ctas'        => $this->ctas->map(fn ($c) => [
                'type'            => $c->type,
                'title'           => $c->title,
                'body'            => $c->body,
                'button_label'    => $c->button_label,
                'target_url'      => $c->target_url,
                'service_context' => $c->service_context,
                'placement'       => $c->placement,
            ])->all(),
            'related'     => $this->relatedEntities->map(fn ($r) => [
                'entity_type' => $r->entity_type,
                'entity_key'  => $r->entity_key,
                'relation'    => $r->relation,
            ])->all(),
            'breadcrumbs' => $this->breadcrumbs(),
        ];
    }

    private function postPayload(): array
    {
        return [
            'id'                   => $this->id,
            'lang'                 => $this->lang,
            'type'                 => $this->type,
            'title'                => $this->title,
            'slug'                 => $this->slug,
            'url'                  => $this->derivedPath(),
            'canonical_url'        => $this->canonicalUrl(),
            'excerpt'              => $this->excerpt,
            'content_html'         => $this->content_html,
            'content_json'         => $this->content_json,
            'reading_time_minutes' => $this->reading_time_minutes,
            'published_at'         => optional($this->published_at)->toIso8601String(),
            'updated_at'           => optional($this->updated_at)->toIso8601String(),
            'author'               => $this->author
                ? new AuthorResource($this->author)
                : null,
            'category'             => $this->category
                ? new CategoryResource($this->category)
                : null,
            'tags'                 => TagResource::collection($this->tags),
            'featured_image'       => $this->featuredImage
                ? (new MediaResource($this->featuredImage))->forLang($this->lang)
                : null,
        ];
    }

    private function seoPayload(): array
    {
        $seo = $this->seo;

        return [
            'meta_title'          => $seo?->meta_title       ?? $this->title,
            'meta_description'    => $seo?->meta_description ?? $this->excerpt,
            'robots'              => $seo?->robots           ?? 'index,follow',
            'canonical_url'       => $this->canonicalUrl(),
            'og_title'            => $seo?->og_title         ?? $this->title,
            'og_description'      => $seo?->og_description   ?? $this->excerpt,
            'og_image_url'        => $seo?->ogImage?->url() ?? $this->featuredImage?->url(),
            'og_type'             => $seo?->og_type          ?? 'article',
            'twitter_card'        => $seo?->twitter_card     ?? 'summary_large_image',
            'twitter_title'       => $seo?->twitter_title    ?? $this->title,
            'twitter_description' => $seo?->twitter_description ?? $this->excerpt,
            'twitter_image_url'   => $seo?->twitterImage?->url() ?? $this->featuredImage?->url(),
            'schema_json'         => $seo?->schema_json,
        ];
    }

    private function breadcrumbs(): array
    {
        $crumbs = [['label' => 'Home', 'href' => $this->language?->urlPrefix() . '/']];

        $crumbs[] = [
            'label' => 'Blog',
            'href'  => $this->language?->urlPrefix() . '/' . trim(config('frontend.blog_segment'), '/'),
        ];

        if ($this->category) {
            $crumbs[] = [
                'label' => $this->category->name,
                'href'  => $this->language?->urlPrefix() . '/'
                    . trim(config('frontend.blog_segment'), '/')
                    . '/category/' . $this->category->slug,
            ];
        }

        $crumbs[] = ['label' => $this->title, 'href' => $this->derivedPath()];

        return $crumbs;
    }
}
