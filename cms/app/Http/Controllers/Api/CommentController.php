<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /** GET /api/cms/posts/{lang}/{slug}/comments — list approved comments */
    public function index(string $lang, string $slug): JsonResponse
    {
        $post = Post::where('lang', $lang)
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (! $post) {
            return response()->json(['error' => 'not_found'], 404);
        }

        $comments = $post->comments()
            ->approved()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn ($c) => [
                'id'          => $c->id,
                'author_name' => $c->author_name,
                'content'     => $c->content,
                'created_at'  => $c->created_at->toIso8601String(),
            ]);

        return response()->json(['data' => $comments])
            ->header('Cache-Control', 'public, max-age=30');
    }

    /** POST /api/cms/comments — submit a new comment (saved as pending) */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lang'         => ['required', 'string', 'size:2'],
            'slug'         => ['required', 'string', 'max:300'],
            'author_name'  => ['required', 'string', 'max:120'],
            'author_email' => ['required', 'email', 'max:191'],
            'content'      => ['required', 'string', 'min:5', 'max:2000'],
        ]);

        $post = Post::where('lang', $validated['lang'])
            ->where('slug', $validated['slug'])
            ->where('status', 'published')
            ->first();

        if (! $post) {
            return response()->json(['error' => 'not_found', 'message' => 'Post not found.'], 404);
        }

        $post->comments()->create([
            'author_name'  => $validated['author_name'],
            'author_email' => $validated['author_email'],
            'content'      => $validated['content'],
            'status'       => 'pending',
            'ip_address'   => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Comment submitted and awaiting moderation.',
        ], 201);
    }
}
