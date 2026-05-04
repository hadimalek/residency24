<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\TagResource;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'lang' => ['required', 'string', 'exists:languages,code'],
        ]);

        $tags = Tag::query()
            ->where('lang', $request->query('lang'))
            ->orderBy('name')
            ->get();

        return TagResource::collection($tags)
            ->response()
            ->header('Cache-Control', 'public, max-age=300, s-maxage=600');
    }
}
