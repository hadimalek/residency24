<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SitemapController extends Controller
{
    /**
     * GET /api/cms/sitemap?lang=
     *
     * Returns a flat list of post URLs + lastmod timestamps for Next.js's
     * sitemap.ts to consume. Optional lang filter; without it returns all
     * languages so the frontend can build a single combined sitemap.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'lang' => ['nullable', 'string', 'exists:languages,code'],
            'type' => ['nullable', 'string', 'max:32'],
        ]);

        $rows = Post::query()
            ->published()
            ->when($request->query('lang'), fn ($q, $lang) => $q->where('lang', $lang))
            ->when($request->query('type'), fn ($q, $type) => $q->where('type', $type))
            ->with('language', 'translationGroup.posts.language')
            ->orderByDesc('published_at')
            ->get();

        $data = $rows->map(function (Post $p) {
            return [
                'lang'    => $p->lang,
                'url'     => $p->canonicalUrl(),
                'path'    => $p->derivedPath(),
                'lastmod' => optional($p->updated_at)->toIso8601String(),
                'alternates' => $p->hreflangAlternates(),
            ];
        })->all();

        return response()->json(['data' => $data])
            ->header('Cache-Control', 'public, max-age=300, s-maxage=600');
    }
}
