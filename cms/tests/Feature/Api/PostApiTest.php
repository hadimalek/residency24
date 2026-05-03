<?php

namespace Tests\Feature\Api;

use App\Models\Author;
use App\Models\Category;
use App\Models\Media;
use App\Models\Post;
use App\Models\PostFaq;
use App\Models\PostSeo;
use App\Models\PostTranslationGroup;
use App\Models\Tag;
use Database\Seeders\LanguageSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(LanguageSeeder::class);
        config(['frontend.url' => 'https://residency24.test']);
        config(['frontend.blog_segment' => 'blog']);
    }

    private function makePost(array $overrides = []): Post
    {
        return Post::create(array_merge([
            'lang'         => 'en',
            'type'         => 'post',
            'status'       => 'published',
            'title'        => 'Sample Post',
            'slug'         => 'sample-post',
            'excerpt'      => 'A sample post excerpt.',
            'content_html' => '<p>Hello world.</p>',
            'published_at' => now()->subDay(),
        ], $overrides));
    }

    // ── Listing ───────────────────────────────────────────────────────

    public function test_listing_requires_lang(): void
    {
        $this->getJson('/api/cms/posts')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['lang']);
    }

    public function test_listing_rejects_unknown_lang(): void
    {
        $this->getJson('/api/cms/posts?lang=zz')
            ->assertStatus(422)
            ->assertJsonValidationErrors(['lang']);
    }

    public function test_listing_returns_only_published_posts_for_lang(): void
    {
        $this->makePost(['slug' => 'en-1', 'title' => 'EN1']);
        $this->makePost(['slug' => 'en-draft', 'status' => 'draft']);
        $this->makePost(['lang' => 'fa', 'slug' => 'fa-1', 'title' => 'FA1']);

        $res = $this->getJson('/api/cms/posts?lang=en')->assertOk();
        $titles = collect($res->json('data'))->pluck('title')->all();

        $this->assertContains('EN1', $titles);
        $this->assertNotContains('FA1', $titles);
        $this->assertCount(1, $titles); // draft excluded

        // Listing must include tags array (may be empty)
        $this->assertArrayHasKey('tags', $res->json('data.0'));
    }

    public function test_listing_paginates(): void
    {
        for ($i = 0; $i < 15; $i++) {
            $this->makePost(['slug' => "post-{$i}", 'title' => "Post {$i}"]);
        }

        $page1 = $this->getJson('/api/cms/posts?lang=en&per_page=10')->assertOk();
        $this->assertCount(10, $page1->json('data'));
        $this->assertSame(15, $page1->json('meta.total'));
        $this->assertSame(2, $page1->json('meta.last_page'));

        $page2 = $this->getJson('/api/cms/posts?lang=en&per_page=10&page=2')->assertOk();
        $this->assertCount(5, $page2->json('data'));
    }

    public function test_listing_filters_by_category_and_tag(): void
    {
        $cat = Category::create([
            'lang' => 'en', 'name' => 'Visa', 'slug' => 'visa', 'sort_order' => 0,
        ]);
        $tag = Tag::create([
            'lang' => 'en', 'name' => 'Dubai', 'slug' => 'dubai',
        ]);

        $matching = $this->makePost(['slug' => 'in-cat', 'category_id' => $cat->id]);
        $matching->tags()->attach($tag->id);

        $this->makePost(['slug' => 'no-cat']);

        $res = $this->getJson('/api/cms/posts?lang=en&category=visa')->assertOk();
        $this->assertCount(1, $res->json('data'));
        $this->assertSame('in-cat', $res->json('data.0.slug'));

        $res = $this->getJson('/api/cms/posts?lang=en&tag=dubai')->assertOk();
        $this->assertCount(1, $res->json('data'));
        $this->assertSame('in-cat', $res->json('data.0.slug'));
    }

    public function test_listing_search_q_matches_title_or_excerpt(): void
    {
        $this->makePost(['slug' => 'a', 'title' => 'Golden visa guide', 'excerpt' => 'x']);
        $this->makePost(['slug' => 'b', 'title' => 'Property tips', 'excerpt' => 'mention golden in body']);
        $this->makePost(['slug' => 'c', 'title' => 'Unrelated', 'excerpt' => 'x']);

        $res = $this->getJson('/api/cms/posts?lang=en&q=golden')->assertOk();
        $slugs = collect($res->json('data'))->pluck('slug')->sort()->values()->all();
        $this->assertEquals(['a', 'b'], $slugs);
    }

    // ── Detail ────────────────────────────────────────────────────────

    public function test_detail_returns_404_for_missing_post(): void
    {
        $this->getJson('/api/cms/posts/en/nope')->assertStatus(404)
            ->assertJsonStructure(['error', 'message']);
    }

    public function test_detail_returns_404_for_unpublished(): void
    {
        $this->makePost(['slug' => 'draft-1', 'status' => 'draft']);
        $this->getJson('/api/cms/posts/en/draft-1')->assertStatus(404);
    }

    public function test_detail_returns_full_payload(): void
    {
        $author = Author::create(['lang' => 'en', 'name' => 'Hadi', 'slug' => 'hadi', 'bio' => 'b']);
        $img    = Media::create([
            'disk' => 'cdn', 'path' => 'https://cdn.example/cover.jpg',
            'original_filename' => 'cover.jpg', 'mime_type' => 'image/jpeg',
            'size_bytes' => 1, 'width' => 1200, 'height' => 630,
        ]);
        $cat = Category::create(['lang' => 'en', 'name' => 'Visa', 'slug' => 'visa']);
        $tag = Tag::create(['lang' => 'en', 'name' => 'Dubai', 'slug' => 'dubai']);

        $post = $this->makePost([
            'slug' => 'hello',
            'author_id' => $author->id,
            'featured_image_id' => $img->id,
            'category_id' => $cat->id,
            'content_html' => '<p>Body.</p>',
        ]);
        $post->tags()->attach($tag->id);

        PostSeo::create([
            'post_id' => $post->id,
            'meta_title' => 'Custom Meta',
            'meta_description' => 'Custom desc',
            'robots' => 'index,follow',
            'og_type' => 'article',
            'twitter_card' => 'summary_large_image',
        ]);

        PostFaq::create(['post_id' => $post->id, 'question' => 'Q', 'answer' => 'A', 'sort_order' => 0]);

        $res = $this->getJson('/api/cms/posts/en/hello')->assertOk();

        $res->assertJsonStructure([
            'data' => [
                'post' => [
                    'id', 'lang', 'title', 'slug', 'url', 'canonical_url',
                    'content_html', 'author', 'category', 'tags', 'featured_image',
                ],
                'seo' => [
                    'meta_title', 'meta_description', 'robots', 'canonical_url',
                    'og_title', 'og_description', 'twitter_card', 'twitter_title',
                ],
                'hreflang',
                'faqs',
                'ctas',
                'related',
                'breadcrumbs',
            ],
        ]);

        $this->assertSame('Custom Meta', $res->json('data.seo.meta_title'));
        $this->assertSame('https://residency24.test/blog/hello', $res->json('data.post.canonical_url'));
        $this->assertSame('Hadi', $res->json('data.post.author.name'));
        $this->assertSame(1200, $res->json('data.post.featured_image.width'));
        $this->assertCount(1, $res->json('data.faqs'));
    }

    public function test_detail_seo_falls_back_to_post_fields(): void
    {
        $this->makePost(['slug' => 'no-seo', 'title' => 'My Title', 'excerpt' => 'My excerpt']);
        $res = $this->getJson('/api/cms/posts/en/no-seo')->assertOk();

        $this->assertSame('My Title', $res->json('data.seo.meta_title'));
        $this->assertSame('My excerpt', $res->json('data.seo.meta_description'));
        $this->assertSame('index,follow', $res->json('data.seo.robots'));
    }

    // ── URL generation ────────────────────────────────────────────────

    public function test_english_url_has_no_lang_prefix(): void
    {
        $this->makePost(['lang' => 'en', 'slug' => 'en-post']);
        $res = $this->getJson('/api/cms/posts/en/en-post')->assertOk();
        $this->assertSame('/blog/en-post', $res->json('data.post.url'));
        $this->assertSame('https://residency24.test/blog/en-post', $res->json('data.post.canonical_url'));
    }

    public function test_persian_url_is_prefixed(): void
    {
        $this->makePost(['lang' => 'fa', 'slug' => 'fa-post']);
        $res = $this->getJson('/api/cms/posts/fa/fa-post')->assertOk();
        $this->assertSame('/fa/blog/fa-post', $res->json('data.post.url'));
        $this->assertSame('https://residency24.test/fa/blog/fa-post', $res->json('data.post.canonical_url'));
    }

    public function test_arabic_and_russian_urls_are_prefixed(): void
    {
        $this->makePost(['lang' => 'ar', 'slug' => 'ar-post']);
        $this->makePost(['lang' => 'ru', 'slug' => 'ru-post']);

        $this->assertSame(
            'https://residency24.test/ar/blog/ar-post',
            $this->getJson('/api/cms/posts/ar/ar-post')->json('data.post.canonical_url')
        );
        $this->assertSame(
            'https://residency24.test/ru/blog/ru-post',
            $this->getJson('/api/cms/posts/ru/ru-post')->json('data.post.canonical_url')
        );
    }

    // ── Hreflang ──────────────────────────────────────────────────────

    public function test_hreflang_is_empty_when_post_has_no_translation_group(): void
    {
        $this->makePost(['slug' => 'lonely']);
        $res = $this->getJson('/api/cms/posts/en/lonely')->assertOk();
        $this->assertSame([], $res->json('data.hreflang'));
    }

    public function test_hreflang_includes_siblings_and_x_default(): void
    {
        $group = PostTranslationGroup::create([]);
        $this->makePost(['lang' => 'en', 'slug' => 'g-en', 'translation_group_id' => $group->id]);
        $this->makePost(['lang' => 'fa', 'slug' => 'g-fa', 'translation_group_id' => $group->id]);
        $this->makePost(['lang' => 'ru', 'slug' => 'g-ru', 'translation_group_id' => $group->id]);

        $res = $this->getJson('/api/cms/posts/fa/g-fa')->assertOk();
        $alts = collect($res->json('data.hreflang'));

        $byLang = $alts->keyBy('lang');
        $this->assertTrue($byLang->has('en'));
        $this->assertTrue($byLang->has('fa'));
        $this->assertTrue($byLang->has('ru'));
        $this->assertTrue($byLang->has('x-default'));

        // x-default falls back to en when group.x_default_lang is null
        $this->assertSame(
            'https://residency24.test/blog/g-en',
            $byLang['x-default']['url']
        );
        $this->assertSame('https://residency24.test/blog/g-en',  $byLang['en']['url']);
        $this->assertSame('https://residency24.test/fa/blog/g-fa', $byLang['fa']['url']);
        $this->assertSame('https://residency24.test/ru/blog/g-ru', $byLang['ru']['url']);
    }

    public function test_hreflang_supports_partial_translation_group(): void
    {
        $group = PostTranslationGroup::create([]);
        $this->makePost(['lang' => 'en', 'slug' => 'p-en', 'translation_group_id' => $group->id]);
        $this->makePost(['lang' => 'fa', 'slug' => 'p-fa', 'translation_group_id' => $group->id]);

        $res = $this->getJson('/api/cms/posts/en/p-en')->assertOk();
        $alts = collect($res->json('data.hreflang'))->keyBy('lang');

        $this->assertTrue($alts->has('en'));
        $this->assertTrue($alts->has('fa'));
        $this->assertFalse($alts->has('ar'));
        $this->assertFalse($alts->has('ru'));
        $this->assertTrue($alts->has('x-default'));
    }

    public function test_hreflang_excludes_unpublished_siblings(): void
    {
        $group = PostTranslationGroup::create([]);
        $this->makePost(['lang' => 'en', 'slug' => 'pub-en', 'translation_group_id' => $group->id]);
        $this->makePost(['lang' => 'fa', 'slug' => 'draft-fa', 'translation_group_id' => $group->id, 'status' => 'draft']);

        $res = $this->getJson('/api/cms/posts/en/pub-en')->assertOk();
        $langs = collect($res->json('data.hreflang'))->pluck('lang')->all();

        $this->assertContains('en', $langs);
        $this->assertNotContains('fa', $langs);
    }

    public function test_hreflang_x_default_uses_explicit_group_setting(): void
    {
        $group = PostTranslationGroup::create(['x_default_lang' => 'fa']);
        $this->makePost(['lang' => 'en', 'slug' => 'x-en', 'translation_group_id' => $group->id]);
        $this->makePost(['lang' => 'fa', 'slug' => 'x-fa', 'translation_group_id' => $group->id]);

        $res = $this->getJson('/api/cms/posts/en/x-en')->assertOk();
        $alts = collect($res->json('data.hreflang'))->keyBy('lang');

        $this->assertSame('https://residency24.test/fa/blog/x-fa', $alts['x-default']['url']);
    }

    // ── Translation group constraints (DB-level) ──────────────────────

    public function test_db_unique_prevents_two_posts_same_lang_in_group(): void
    {
        $group = PostTranslationGroup::create([]);
        $this->makePost(['lang' => 'en', 'slug' => 'first', 'translation_group_id' => $group->id]);

        $this->expectException(\Illuminate\Database\QueryException::class);
        $this->makePost(['lang' => 'en', 'slug' => 'second', 'translation_group_id' => $group->id]);
    }

    public function test_assignToTranslationGroup_throws_when_lang_already_present(): void
    {
        $group = PostTranslationGroup::create([]);
        $this->makePost(['lang' => 'en', 'slug' => 'a', 'translation_group_id' => $group->id]);
        $standalone = $this->makePost(['lang' => 'en', 'slug' => 'b']);

        $this->expectException(\RuntimeException::class);
        $standalone->assignToTranslationGroup($group);
    }

    public function test_detachFromTranslationGroup_keeps_post(): void
    {
        $group = PostTranslationGroup::create([]);
        $post  = $this->makePost(['translation_group_id' => $group->id]);

        $post->detachFromTranslationGroup();

        $this->assertNull($post->fresh()->translation_group_id);
        $this->assertNotNull($post->fresh()->id);
    }

    // ── generateStaticParams endpoint ────────────────────────────────

    public function test_params_endpoint_returns_lang_slug_pairs(): void
    {
        $this->makePost(['lang' => 'en', 'slug' => 'a']);
        $this->makePost(['lang' => 'en', 'slug' => 'b']);
        $this->makePost(['lang' => 'fa', 'slug' => 'c']);
        $this->makePost(['lang' => 'en', 'slug' => 'd', 'status' => 'draft']); // should be excluded

        $res = $this->getJson('/api/cms/posts/params?lang=en')->assertOk();
        $rows = collect($res->json('data'));
        $this->assertCount(2, $rows);
        $this->assertEqualsCanonicalizing(['a', 'b'], $rows->pluck('slug')->all());
    }

    // ── Caching headers ───────────────────────────────────────────────

    public function test_responses_include_cache_control_header(): void
    {
        $this->makePost(['slug' => 'cached']);

        $list   = $this->getJson('/api/cms/posts?lang=en')->assertOk();
        $detail = $this->getJson('/api/cms/posts/en/cached')->assertOk();

        foreach ([$list, $detail] as $res) {
            $cc = $res->headers->get('Cache-Control');
            $this->assertStringContainsString('public', $cc);
            $this->assertStringContainsString('max-age=60', $cc);
            $this->assertStringContainsString('s-maxage=300', $cc);
        }
    }
}
