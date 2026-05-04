<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            [
                'code'        => 'en',
                'name'        => 'English',
                'native_name' => 'English',
                'direction'   => 'ltr',
                'is_default'  => true,
                'is_active'   => true,
                'url_prefix'  => null,   // served from root: /blog/...
                'sort_order'  => 1,
            ],
            [
                'code'        => 'fa',
                'name'        => 'Persian',
                'native_name' => 'فارسی',
                'direction'   => 'rtl',
                'is_default'  => false,
                'is_active'   => true,
                'url_prefix'  => '/fa',  // /fa/blog/...
                'sort_order'  => 2,
            ],
            [
                'code'        => 'ar',
                'name'        => 'Arabic',
                'native_name' => 'العربية',
                'direction'   => 'rtl',
                'is_default'  => false,
                'is_active'   => true,
                'url_prefix'  => '/ar',  // /ar/blog/...
                'sort_order'  => 3,
            ],
            [
                'code'        => 'ru',
                'name'        => 'Russian',
                'native_name' => 'Русский',
                'direction'   => 'ltr',
                'is_default'  => false,
                'is_active'   => true,
                'url_prefix'  => '/ru',  // /ru/blog/...
                'sort_order'  => 4,
            ],
        ];

        foreach ($languages as $lang) {
            DB::table('languages')->updateOrInsert(
                ['code' => $lang['code']],
                array_merge($lang, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
