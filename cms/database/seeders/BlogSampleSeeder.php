<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Category;
use App\Models\CategoryTranslationGroup;
use App\Models\Media;
use App\Models\Post;
use App\Models\PostCta;
use App\Models\PostFaq;
use App\Models\PostRelatedEntity;
use App\Models\PostSeo;
use App\Models\PostTranslationGroup;
use App\Models\Tag;
use App\Models\TagTranslationGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Idempotent seed: skips records that already exist (checked by slug+lang).
 * Safe to run multiple times.
 */
class BlogSampleSeeder extends Seeder
{
    public function run(): void
    {
        // ── Media ─────────────────────────────────────────────────────
        $img = $this->firstOrCreateMedia('sample-cover.jpg', [
            'disk'              => 'cdn',
            'path'              => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=630&fit=crop',
            'original_filename' => 'dubai-skyline.jpg',
            'mime_type'         => 'image/jpeg',
            'size_bytes'        => 204800,
            'width'             => 1200,
            'height'            => 630,
            'source_url'        => null,
        ]);

        $avatarImg = $this->firstOrCreateMedia('author-avatar.jpg', [
            'disk'              => 'cdn',
            'path'              => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
            'original_filename' => 'author.jpg',
            'mime_type'         => 'image/jpeg',
            'size_bytes'        => 51200,
            'width'             => 200,
            'height'            => 200,
        ]);

        // ── Authors ───────────────────────────────────────────────────
        $authorEn = Author::firstOrCreate(
            ['lang' => 'en', 'slug' => 'hadi-malek'],
            [
                'name'            => 'Hadi Malek',
                'title'           => 'Senior Immigration Advisor',
                'bio'             => 'Hadi has helped over 500 clients obtain UAE residency since 2015.',
                'email'           => 'hadi@residency24.com',
                'avatar_media_id' => $avatarImg->id,
            ]
        );

        $authorFa = Author::firstOrCreate(
            ['lang' => 'fa', 'slug' => 'hadi-malek-fa'],
            [
                'name'            => 'هادی ملک',
                'title'           => 'مشاور ارشد مهاجرت',
                'bio'             => 'هادی از سال ۲۰۱۵ به بیش از ۵۰۰ مشتری در اخذ اقامت امارات کمک کرده است.',
                'avatar_media_id' => $avatarImg->id,
            ]
        );

        // ── Category translation group ────────────────────────────────
        $catGroup = CategoryTranslationGroup::firstOrCreate(['uuid' => '01J0000000000000000CATGROUP1']);

        $catEn = Category::firstOrCreate(
            ['lang' => 'en', 'slug' => 'golden-visa'],
            ['name' => 'Golden Visa', 'translation_group_id' => $catGroup->id, 'sort_order' => 1,
             'description' => 'Everything about the UAE 10-year Golden Visa programme.',
             'seo_title' => 'UAE Golden Visa Guide',
             'seo_description' => 'Complete guide to UAE Golden Visa eligibility, costs, and process.']
        );

        $catFa = Category::firstOrCreate(
            ['lang' => 'fa', 'slug' => 'ویزای-طلایی'],
            ['name' => 'ویزای طلایی', 'translation_group_id' => $catGroup->id, 'sort_order' => 1,
             'description' => 'همه چیز درباره برنامه ویزای طلایی ۱۰ساله امارات.']
        );

        // ── Tag translation group ─────────────────────────────────────
        $tagGroupDubai  = TagTranslationGroup::firstOrCreate(['uuid' => '01J0000000000000000TAGGROUP1']);
        $tagGroupProperty = TagTranslationGroup::firstOrCreate(['uuid' => '01J0000000000000000TAGGROUP2']);

        $tagDubaiEn = Tag::firstOrCreate(
            ['lang' => 'en', 'slug' => 'dubai'],
            ['name' => 'Dubai', 'translation_group_id' => $tagGroupDubai->id]
        );
        $tagPropertyEn = Tag::firstOrCreate(
            ['lang' => 'en', 'slug' => 'property'],
            ['name' => 'Property', 'translation_group_id' => $tagGroupProperty->id]
        );
        $tagDubaiFa = Tag::firstOrCreate(
            ['lang' => 'fa', 'slug' => 'دبی'],
            ['name' => 'دبی', 'translation_group_id' => $tagGroupDubai->id]
        );

        // ── Translation groups for posts ──────────────────────────────
        $group1 = PostTranslationGroup::firstOrCreate(['uuid' => '01J0000000000000000POSTGRP01']);
        $group2 = PostTranslationGroup::firstOrCreate(['uuid' => '01J0000000000000000POSTGRP02']);
        $group3 = PostTranslationGroup::firstOrCreate(['uuid' => '01J0000000000000000POSTGRP03']);

        // ── English Posts ─────────────────────────────────────────────
        $post1En = $this->firstOrCreatePost([
            'lang'                  => 'en',
            'slug'                  => 'uae-golden-visa-complete-guide-2025',
            'translation_group_id'  => $group1->id,
            'type'                  => 'post',
            'status'                => 'published',
            'title'                 => 'UAE Golden Visa: Complete Guide for 2025',
            'excerpt'               => 'Everything you need to know about the UAE 10-year Golden Visa — eligibility, cost, documents, and how long it takes in 2025.',
            'content_html'          => $this->sampleContentEn(),
            'reading_time_minutes'  => 8,
            'author_id'             => $authorEn->id,
            'featured_image_id'     => $img->id,
            'category_id'           => $catEn->id,
            'published_at'          => now()->subDays(10),
        ]);

        $post2En = $this->firstOrCreatePost([
            'lang'                  => 'en',
            'slug'                  => 'buy-property-dubai-foreigners-guide',
            'translation_group_id'  => $group2->id,
            'type'                  => 'post',
            'status'                => 'published',
            'title'                 => 'How to Buy Property in Dubai as a Foreigner (2025)',
            'excerpt'               => 'A step-by-step guide to purchasing freehold property in Dubai as a non-resident, including fees, DLD registration, and financing options.',
            'content_html'          => "<h2>Why Dubai?</h2><p>Dubai's property market remains one of the most attractive globally for foreign investors...</p>",
            'reading_time_minutes'  => 6,
            'author_id'             => $authorEn->id,
            'featured_image_id'     => $img->id,
            'category_id'           => $catEn->id,
            'published_at'          => now()->subDays(5),
        ]);

        $post3En = $this->firstOrCreatePost([
            'lang'                  => 'en',
            'slug'                  => 'uae-company-setup-free-zone-vs-mainland',
            'translation_group_id'  => $group3->id,
            'type'                  => 'post',
            'status'                => 'published',
            'title'                 => 'UAE Company Setup: Free Zone vs Mainland — Which Is Right for You?',
            'excerpt'               => 'Comparing UAE Free Zone and Mainland company structures: ownership rules, costs, visas, and which suits your business goals.',
            'content_html'          => '<h2>Free Zone vs Mainland</h2><p>The fundamental difference is market access and ownership...</p>',
            'reading_time_minutes'  => 5,
            'author_id'             => $authorEn->id,
            'featured_image_id'     => $img->id,
            'category_id'           => $catEn->id,
            'published_at'          => now()->subDays(2),
        ]);

        // ── Farsi Posts (linked to same groups) ───────────────────────
        $post1Fa = $this->firstOrCreatePost([
            'lang'                  => 'fa',
            'slug'                  => 'راهنمای-کامل-ویزای-طلایی-امارات-۲۰۲۵',
            'translation_group_id'  => $group1->id,
            'type'                  => 'post',
            'status'                => 'published',
            'title'                 => 'ویزای طلایی امارات: راهنمای کامل ۲۰۲۵',
            'excerpt'               => 'همه چیزی که باید درباره ویزای طلایی ۱۰ ساله امارات بدانید — شرایط، هزینه، مدارک و زمان اخذ در سال ۲۰۲۵.',
            'content_html'          => '<h2>ویزای طلایی چیست؟</h2><p>ویزای طلایی امارات یک اقامت بلندمدت ۱۰ ساله است که به سرمایه‌گذاران، متخصصان و کارآفرینان ارائه می‌شود.</p>',
            'reading_time_minutes'  => 8,
            'author_id'             => $authorFa->id,
            'featured_image_id'     => $img->id,
            'category_id'           => $catFa->id,
            'published_at'          => now()->subDays(10),
        ]);

        // A standalone post (no translation group) — edge case
        $this->firstOrCreatePost([
            'lang'         => 'en',
            'slug'         => 'why-dubai-is-best-for-digital-nomads',
            'type'         => 'post',
            'status'       => 'published',
            'title'        => 'Why Dubai Is the Best City for Digital Nomads in 2025',
            'excerpt'      => 'From remote work visas to co-working hubs and tax-free income, Dubai has become the world\'s top digital nomad destination.',
            'content_html' => '<p>Dubai offers a unique combination of infrastructure and lifestyle...</p>',
            'reading_time_minutes' => 4,
            'author_id'    => $authorEn->id,
            'featured_image_id' => $img->id,
            'published_at' => now()->subDay(),
        ]);

        // ── Attach Tags ───────────────────────────────────────────────
        foreach ([$post1En, $post2En, $post3En] as $p) {
            DB::table('post_tags')->insertOrIgnore([
                ['post_id' => $p->id, 'tag_id' => $tagDubaiEn->id],
            ]);
        }
        DB::table('post_tags')->insertOrIgnore([
            ['post_id' => $post2En->id, 'tag_id' => $tagPropertyEn->id],
        ]);
        DB::table('post_tags')->insertOrIgnore([
            ['post_id' => $post1Fa->id, 'tag_id' => $tagDubaiFa->id],
        ]);

        // ── SEO ───────────────────────────────────────────────────────
        PostSeo::updateOrCreate(['post_id' => $post1En->id], [
            'meta_title'          => 'UAE Golden Visa 2025: Complete Guide — Residency24',
            'meta_description'    => 'Get the UAE 10-year Golden Visa in 2025. Full guide: eligibility, required documents, cost breakdown, and processing time.',
            'robots'              => 'index,follow',
            'og_title'            => 'UAE Golden Visa: Complete Guide for 2025',
            'og_description'      => 'Everything you need to know about the UAE 10-year Golden Visa.',
            'og_image_id'         => $img->id,
            'og_type'             => 'article',
            'twitter_card'        => 'summary_large_image',
            'twitter_title'       => 'UAE Golden Visa 2025 — Full Guide',
            'twitter_description' => 'Eligibility, cost, documents, and processing time for the UAE Golden Visa.',
        ]);

        PostSeo::updateOrCreate(['post_id' => $post1Fa->id], [
            'meta_title'       => 'ویزای طلایی امارات ۲۰۲۵: راهنمای کامل — رزیدنسی۲۴',
            'meta_description' => 'اخذ ویزای طلایی ۱۰ ساله امارات در ۲۰۲۵. راهنمای کامل: شرایط، مدارک، هزینه و زمان.',
            'robots'           => 'index,follow',
            'og_type'          => 'article',
            'twitter_card'     => 'summary_large_image',
        ]);

        // ── FAQs ──────────────────────────────────────────────────────
        $faqs = [
            ['question' => 'Who is eligible for the UAE Golden Visa?',
             'answer'   => 'Investors with AED 2M+ real estate, skilled professionals in priority fields, outstanding graduates, and humanitarian workers qualify.',
             'sort_order' => 0],
            ['question' => 'How long does the Golden Visa process take?',
             'answer'   => 'Typically 4–8 weeks from document submission to visa stamp, depending on the category and ICA queue.',
             'sort_order' => 1],
            ['question' => 'Can my family members be sponsored on the Golden Visa?',
             'answer'   => 'Yes. The primary holder can sponsor their spouse, children of all ages, and parents.',
             'sort_order' => 2],
        ];
        foreach ($faqs as $faq) {
            PostFaq::firstOrCreate(
                ['post_id' => $post1En->id, 'question' => $faq['question']],
                ['answer' => $faq['answer'], 'sort_order' => $faq['sort_order']]
            );
        }

        // ── CTAs ──────────────────────────────────────────────────────
        PostCta::firstOrCreate(
            ['post_id' => $post1En->id, 'type' => 'lead_form', 'placement' => 'mid'],
            [
                'title'           => 'Check Your Golden Visa Eligibility',
                'body'            => 'Our advisors review your profile and confirm your pathway within 24 hours — free of charge.',
                'button_label'    => 'Get Free Assessment',
                'service_context' => 'golden_visa',
            ]
        );
        PostCta::firstOrCreate(
            ['post_id' => $post1En->id, 'type' => 'whatsapp', 'placement' => 'bottom'],
            [
                'title'        => 'Have a quick question?',
                'button_label' => 'Chat on WhatsApp',
                'target_url'   => 'https://wa.me/971XXXXXXXXX',
            ]
        );

        // ── Related entities ──────────────────────────────────────────
        PostRelatedEntity::firstOrCreate(
            ['post_id' => $post1En->id, 'entity_type' => 'service', 'entity_key' => 'golden-visa', 'relation' => 'pillar'],
            ['sort_order' => 0]
        );
        PostRelatedEntity::firstOrCreate(
            ['post_id' => $post1En->id, 'entity_type' => 'post', 'entity_key' => 'buy-property-dubai-foreigners-guide', 'relation' => 'related'],
            ['sort_order' => 1]
        );
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private function firstOrCreatePost(array $attrs): Post
    {
        return Post::firstOrCreate(
            ['lang' => $attrs['lang'], 'slug' => $attrs['slug']],
            $attrs
        );
    }

    private function firstOrCreateMedia(string $filename, array $attrs): Media
    {
        return Media::firstOrCreate(['original_filename' => $filename], $attrs);
    }

    private function sampleContentEn(): string
    {
        return <<<HTML
<h2>What Is the UAE Golden Visa?</h2>
<p>The UAE Golden Visa is a long-term renewable residency scheme that gives investors, entrepreneurs, skilled professionals, and outstanding graduates the right to live, work, and study in the UAE without needing a local sponsor.</p>

<h2>Eligibility Categories in 2025</h2>
<ul>
  <li><strong>Real estate investors</strong> — AED 2 million minimum in completed or mortgaged property</li>
  <li><strong>Entrepreneurs</strong> — active project valued at AED 500,000+, or government-backed incubator</li>
  <li><strong>Skilled professionals</strong> — specialised talent, physicians, engineers, scientists</li>
  <li><strong>Outstanding graduates</strong> — top UAE university graduates or global top-100 universities</li>
  <li><strong>Humanitarian workers</strong> — approved fields designated by authorities</li>
</ul>

<h2>Document Checklist</h2>
<ol>
  <li>Valid passport (minimum 6 months validity)</li>
  <li>Entry permit or current UAE visa</li>
  <li>Emirates ID (existing residents)</li>
  <li>Title deed or NOC from developer (property route)</li>
  <li>Trade licence and MOA (entrepreneur route)</li>
  <li>Degree certificates attested (graduate route)</li>
  <li>Medical fitness certificate</li>
  <li>Health insurance valid in UAE</li>
</ol>

<h2>Cost Breakdown</h2>
<p>Total government fees typically range from <strong>AED 3,800 to AED 6,200</strong> depending on the category, not including medical and typing charges.</p>
HTML;
    }
}
