<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'lang' => ['required', 'string', 'exists:languages,code'],
        ]);

        $categories = Category::query()
            ->where('lang', $request->query('lang'))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return CategoryResource::collection($categories)
            ->response()
            ->header('Cache-Control', 'public, max-age=300, s-maxage=600');
    }
}
