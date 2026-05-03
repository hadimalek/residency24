<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\PostIndexRequest;
use App\Http\Resources\Api\PostDetailResource;
use App\Http\Resources\Api\PostListResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PostController extends Controller
{
    /**
     * GET /api/cms/posts
     *
     * Required: lang
     * Optional: type, category, tag, author, q, page, per_page
     * Returns paginated PostListResource collection.
     */
    public function index(PostIndexRequest $request): JsonResponse
    {
        $params = $request->validated();
        $perPage = $params['per_page'] ?? 12;

        $query = Post::query()
            ->published()
            ->forLang($params['lang'])
            ->with([
                'author',
                'category',
                'featuredImage',
                'translationGroup:id',
                'translationGroup.posts:id,translation_group_id,lang',
            ])
            ->orderByDesc('published_at');

        if (! empty($params['type'])) {
            $query->where('type', $params['type']);
        }

        if (! empty($params['category'])) {
            $query->whereHas('category', fn ($q) => $q
                ->where('lang', $params['lang'])
                ->where('slug', $params['category']));
        }

        if (! empty($params['tag'])) {
            $query->whereHas('tags', fn ($q) => $q
                ->where('lang', $params['lang'])
                ->where('slug', $params['tag']));
        }

        if (! empty($params['author'])) {
            $query->whereHas('author', fn ($q) => $q
                ->where('lang', $params['lang'])
                ->where('slug', $params['author']));
        }

        if (! empty($params['q'])) {
            $term = '%' . $params['q'] . '%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                  ->orWhere('excerpt', 'like', $term);
            });
        }

        $paginator = $query->paginate($perPage)->withQueryString();

        return PostListResource::collection($paginator)
            ->response()
            ->setStatusCode(200)
            ->header('Cache-Control', 'public, max-age=60, s-maxage=300');
    }

    /**
     * GET /api/cms/posts/{lang}/{slug}
     * Returns full post detail or 404.
     */
    public function show(string $lang, string $slug): JsonResponse
    {
        $this->validateLang($lang);

        $post = Post::query()
            ->forLang($lang)
            ->where('slug', $slug)
            ->published()
            ->with([
                'author.avatar',
                'category',
                'tags',
                'featuredImage',
                'seo.ogImage',
                'seo.twitterImage',
                'faqs',
                'ctas',
                'relatedEntities',
                'language',
                'translationGroup',
                'translationGroup.posts' => fn ($q) => $q
                    ->where('status', 'published')
                    ->whereNull('deleted_at')
                    ->with('language'),
            ])
            ->first();

        if (! $post) {
            return response()->json([
                'error'   => 'not_found',
                'message' => "No published post found for lang='{$lang}' slug='{$slug}'.",
            ], 404);
        }

        return (new PostDetailResource($post))
            ->response()
            ->setStatusCode(200)
            ->header('Cache-Control', 'public, max-age=60, s-maxage=300');
    }

    /**
     * GET /api/cms/posts/params?lang=&type=
     * Returns minimal {lang, slug} list for Next.js generateStaticParams().
     */
    public function params(Request $request): JsonResponse
    {
        $lang = $request->query('lang');
        $type = $request->query('type', 'post');

        if ($lang) {
            $this->validateLang($lang);
        }

        $rows = Post::query()
            ->published()
            ->when($lang, fn ($q) => $q->forLang($lang))
            ->when($type, fn ($q) => $q->ofType($type))
            ->select(['lang', 'slug'])
            ->get();

        return response()->json([
            'data' => $rows->map(fn ($r) => ['lang' => $r->lang, 'slug' => $r->slug])->all(),
        ])->header('Cache-Control', 'public, max-age=300, s-maxage=600');
    }

    private function validateLang(string $lang): void
    {
        $exists = \DB::table('languages')->where('code', $lang)->where('is_active', true)->exists();

        if (! $exists) {
            throw ValidationException::withMessages([
                'lang' => "Unknown or inactive language: '{$lang}'.",
            ]);
        }
    }
}
