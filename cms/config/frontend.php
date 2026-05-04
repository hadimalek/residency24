<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Frontend URL
    |--------------------------------------------------------------------------
    | The canonical public URL of the Next.js frontend. Used to build canonical
    | URLs and hreflang alternates served by the API. Must NOT be the Laravel
    | application URL — those are different hosts in production.
    */
    'url' => rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/'),

    /*
    |--------------------------------------------------------------------------
    | Blog URL Segment
    |--------------------------------------------------------------------------
    | The path segment under which blog posts are served on the frontend.
    | Final URL: {frontend.url}{language.url_prefix}/{frontend.blog_segment}/{slug}
    */
    'blog_segment' => env('FRONTEND_BLOG_SEGMENT', 'blog'),

    /*
    |--------------------------------------------------------------------------
    | Revalidate Webhook (later phase)
    |--------------------------------------------------------------------------
    */
    'revalidate_url'    => env('FRONTEND_REVALIDATE_URL'),
    'revalidate_secret' => env('FRONTEND_REVALIDATE_SECRET'),

];
