<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\SitemapController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public CMS Read API — consumed by the Next.js frontend
|--------------------------------------------------------------------------
| All endpoints unauthenticated. Rate limiting and CORS configured at the
| middleware level. Final URLs are mounted under /api/cms/...
*/

Route::prefix('cms')->group(function () {
    // Posts
    Route::get('posts',                [PostController::class, 'index'])->name('cms.posts.index');
    Route::get('posts/params',         [PostController::class, 'params'])->name('cms.posts.params');
    Route::get('posts/{lang}/{slug}',  [PostController::class, 'show'])
        ->where('lang', '[a-z]{2}')
        ->where('slug', '[^/]+')  // allow Unicode slugs (fa/ar/ru RTL languages use non-ASCII)
        ->name('cms.posts.show');

    // Comments
    Route::get('posts/{lang}/{slug}/comments', [CommentController::class, 'index'])
        ->where('lang', '[a-z]{2}')
        ->where('slug', '[^/]+')
        ->name('cms.comments.index');
    Route::post('comments', [CommentController::class, 'store'])->name('cms.comments.store');

    // Taxonomies
    Route::get('categories',           [CategoryController::class, 'index'])->name('cms.categories.index');
    Route::get('tags',                 [TagController::class, 'index'])->name('cms.tags.index');

    // Sitemap data (raw JSON — consumed by Next.js sitemap.ts)
    Route::get('sitemap',              [SitemapController::class, 'index'])->name('cms.sitemap');
});
