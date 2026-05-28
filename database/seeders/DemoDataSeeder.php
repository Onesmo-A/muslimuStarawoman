<?php

namespace Database\Seeders;

use App\Models\AwardCategory;
use App\Models\AwardSeason;
use App\Models\CategoryPricing;
use App\Models\Event;
use App\Models\GalleryItem;
use App\Models\Judge;
use App\Models\Nomination;
use App\Models\Nominee;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\Sponsor;
use App\Models\SponsorPackage;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Winner;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::query()->firstOrCreate(
            ['email' => 'superadmin@bizawards.test'],
            [
                'name' => 'Super Admin',
                'phone' => '+255700000001',
                'password' => Hash::make('password'),
                'user_type' => 'super_admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->assignRole('super_admin');

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@bizawards.test'],
            [
                'name' => 'Platform Admin',
                'phone' => '+255700000002',
                'password' => Hash::make('password'),
                'user_type' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        $season = AwardSeason::query()->firstOrCreate(
            ['slug' => 'business-awards-2026'],
            [
                'name' => 'Business Awards 2026',
                'year' => 2026,
                'start_date' => '2026-01-10',
                'end_date' => '2026-11-30',
                'is_active' => true,
                'status' => 'open',
            ]
        );

        $categoryData = [
            ['name' => 'Best SME of the Year', 'slug' => 'best-sme-year', 'form_type' => 'free', 'fee' => 0],
            ['name' => 'Innovative Enterprise Award', 'slug' => 'innovative-enterprise-award', 'form_type' => 'paid', 'fee' => 50],
            ['name' => 'Excellence in Customer Service', 'slug' => 'customer-service-excellence', 'form_type' => 'paid', 'fee' => 40],
        ];

        foreach ($categoryData as $index => $row) {
            $category = AwardCategory::query()->firstOrCreate(
                ['slug' => $row['slug']],
                [
                    'award_season_id' => $season->id,
                    'name' => $row['name'],
                    'description' => 'Curated category for premium business recognition.',
                    'eligibility_rules' => [
                        'must_be_registered' => true,
                        'minimum_years' => 2,
                    ],
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]
            );

            CategoryPricing::query()->updateOrCreate(
                ['award_category_id' => $category->id],
                [
                    'form_type' => $row['form_type'],
                    'application_fee' => $row['fee'],
                    'currency' => 'USD',
                    'early_bird_fee' => $row['fee'] > 0 ? $row['fee'] - 10 : null,
                    'deadline' => '2026-08-31 23:59:59',
                    'is_active' => true,
                ]
            );

            $nominee = Nominee::query()->firstOrCreate(
                ['email' => "nominee{$index}@example.test"],
                [
                    'award_category_id' => $category->id,
                    'business_name' => "Demo Business {$index}",
                    'contact_person' => "Contact {$index}",
                    'phone' => '+25570000010'.$index,
                    'website' => 'https://example.com',
                    'city' => 'Dar es Salaam',
                    'country' => 'Tanzania',
                    'company_profile' => 'Growing business with strong social impact.',
                    'status' => 'active',
                ]
            );

            Nomination::query()->firstOrCreate(
                ['reference' => 'NOM-DEMO-00'.$index],
                [
                    'user_id' => $admin->id,
                    'award_category_id' => $category->id,
                    'nominee_id' => $nominee->id,
                    'form_payload' => ['summary' => 'Demo nomination'],
                    'status' => 'submitted',
                    'submitted_at' => now()->subDays(7),
                ]
            );
        }

        $judgeUser = User::query()->firstOrCreate(
            ['email' => 'judge@bizawards.test'],
            [
                'name' => 'Lead Judge',
                'phone' => '+255700000003',
                'password' => Hash::make('password'),
                'user_type' => 'judge',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        $judgeUser->assignRole('judge');

        Judge::query()->firstOrCreate(
            ['email' => $judgeUser->email],
            [
                'user_id' => $judgeUser->id,
                'full_name' => $judgeUser->name,
                'title' => 'Senior Evaluator',
                'organization' => 'Business Council',
                'bio' => 'Industry expert with 15+ years in enterprise growth.',
                'is_active' => true,
            ]
        );

        $event = Event::query()->firstOrCreate(
            ['event_name' => 'Business Awards Gala 2026'],
            [
                'award_season_id' => $season->id,
                'event_description' => 'Main ceremony honoring finalists and winners.',
                'event_date' => '2026-11-15',
                'event_time' => '19:00:00',
                'venue_name' => 'Grand Convention Center',
                'venue_address' => '1 Ocean Road',
                'city' => 'Dar es Salaam',
                'country' => 'Tanzania',
                'latitude' => -6.7924,
                'longitude' => 39.2083,
                'event_capacity' => 1200,
                'status' => 'published',
            ]
        );

        Ticket::query()->updateOrCreate(
            ['event_id' => $event->id, 'ticket_type' => 'VIP'],
            [
                'name' => 'VIP Access',
                'description' => 'Front-row seating and premium lounge.',
                'price' => 150,
                'currency' => 'USD',
                'quantity' => 200,
                'is_active' => true,
            ]
        );

        Ticket::query()->updateOrCreate(
            ['event_id' => $event->id, 'ticket_type' => 'Standard'],
            [
                'name' => 'Standard Pass',
                'description' => 'Main hall access.',
                'price' => 50,
                'currency' => 'USD',
                'quantity' => 1000,
                'is_active' => true,
            ]
        );

        SponsorPackage::query()->updateOrCreate(
            ['slug' => 'platinum-sponsor'],
            [
                'name' => 'Platinum Sponsor',
                'price' => 10000,
                'currency' => 'USD',
                'benefits' => ['prime_logo_placement', 'stage_mentions', 'media_coverage'],
                'logo_placement' => 'Main stage LED + website hero',
                'stage_mentions' => true,
                'website_listing' => true,
                'booth_space' => 'Large',
                'complimentary_tickets' => 20,
                'is_active' => true,
            ]
        );

        Sponsor::query()->firstOrCreate(
            ['email' => 'sponsor@example.test'],
            [
                'name' => 'Demo Holdings',
                'contact_person' => 'Head of Marketing',
                'phone' => '+255700000100',
                'website' => 'https://example-sponsor.test',
                'description' => 'Proud supporter of business innovation.',
                'is_active' => true,
            ]
        );

        Post::query()->firstOrCreate(
            ['slug' => 'awards-season-now-open'],
            [
                'user_id' => $admin->id,
                'title' => 'Awards Season 2026 Is Officially Open',
                'excerpt' => 'Nominations are now open across all categories.',
                'body' => 'Submit your nominations before the early bird deadline to enjoy discounted fees.',
                'status' => 'published',
                'published_at' => now()->subDays(3),
            ]
        );

        GalleryItem::query()->firstOrCreate(
            ['url' => 'https://picsum.photos/seed/awards/1200/800'],
            [
                'event_id' => $event->id,
                'title' => 'Gala Night Highlights',
                'type' => 'image',
                'caption' => 'Highlights from the previous awards night.',
                'is_featured' => true,
            ]
        );

        $firstCategory = AwardCategory::query()->first();
        $firstNominee = Nominee::query()->first();

        if ($firstCategory && $firstNominee) {
            Winner::query()->updateOrCreate(
                [
                    'award_season_id' => $season->id,
                    'award_category_id' => $firstCategory->id,
                    'position' => 'winner',
                ],
                [
                    'nominee_id' => $firstNominee->id,
                    'hall_of_fame' => true,
                    'is_published' => true,
                    'announced_at' => now()->subDay(),
                ]
            );
        }

        SiteSetting::query()->updateOrCreate(
            ['key' => 'platform.theme'],
            [
                'group' => 'appearance',
                'value' => json_encode(['palette' => 'black-gold-ivory']),
                'is_public' => true,
            ]
        );
    }
}
