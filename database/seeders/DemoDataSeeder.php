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
    private const DEMO_PASSWORD = 'Password@123';

    public function run(): void
    {
        $users = $this->seedUsers();

        $season = AwardSeason::query()->updateOrCreate(
            ['slug' => 'muslim-stara-women-awards-2026'],
            [
                'name' => 'Muslim Stara Women Awards 2026',
                'year' => 2026,
                'start_date' => '2026-01-10',
                'end_date' => '2026-11-30',
                'is_active' => true,
                'status' => 'open',
            ]
        );

        $categories = $this->seedCategories($season);
        $nominees = $this->seedNominees($categories, $users);
        $this->seedNominations($categories, $nominees, $users);
        $this->seedJudges($users);
        $event = $this->seedEvent($season);
        $this->seedTickets($event);
        $this->seedSponsors();
        $this->seedContent($users['admin'], $event);
        $this->seedWinner($season, $categories[0] ?? null, $nominees[0] ?? null);
        $this->seedSettings();
        $this->printCredentials();
    }

    private function seedUsers(): array
    {
        $records = [
            'super_admin' => [
                'name' => 'MSWA Super Admin',
                'email' => 'superadmin@mswa.test',
                'phone' => '+255700100001',
                'user_type' => 'super_admin',
                'role' => 'super_admin',
            ],
            'admin' => [
                'name' => 'MSWA Platform Admin',
                'email' => 'admin@mswa.test',
                'phone' => '+255700100002',
                'user_type' => 'admin',
                'role' => 'admin',
            ],
            'judge' => [
                'name' => 'Sheikhah Aisha Mwinyi',
                'email' => 'judge@mswa.test',
                'phone' => '+255700100003',
                'user_type' => 'judge',
                'role' => 'judge',
            ],
            'sponsor' => [
                'name' => 'Sponsor Partner User',
                'email' => 'sponsor@mswa.test',
                'phone' => '+255700100004',
                'user_type' => 'sponsor',
                'role' => 'sponsor',
            ],
            'nominee' => [
                'name' => 'Amina Hassan',
                'email' => 'nominee@mswa.test',
                'phone' => '+255700100005',
                'user_type' => 'nominee',
                'role' => 'nominee',
            ],
            'public_user' => [
                'name' => 'Public Voter',
                'email' => 'user@mswa.test',
                'phone' => '+255700100006',
                'user_type' => 'public_user',
                'role' => 'public_user',
            ],
        ];

        $users = [];

        foreach ($records as $key => $record) {
            $user = User::query()->updateOrCreate(
                ['email' => $record['email']],
                [
                    'name' => $record['name'],
                    'phone' => $record['phone'],
                    'password' => Hash::make(self::DEMO_PASSWORD),
                    'user_type' => $record['user_type'],
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles([$record['role']]);
            $users[$key] = $user;
        }

        return $users;
    }

    private function seedCategories(AwardSeason $season): array
    {
        $records = [
            ['name' => 'Learning & Networking Impact', 'slug' => 'learning-networking-impact', 'fee' => 0],
            ['name' => 'Islamic Education & Sisterhood', 'slug' => 'islamic-education-sisterhood', 'fee' => 0],
            ['name' => 'Business Awards & Recognition', 'slug' => 'business-awards-recognition', 'fee' => 35000],
            ['name' => 'Charity & Social Support', 'slug' => 'charity-social-support', 'fee' => 0],
            ['name' => 'Modest Fashion, Arts & Media', 'slug' => 'modest-fashion-arts-media', 'fee' => 25000],
            ['name' => 'Islamic Woman Leader of the Year', 'slug' => 'islamic-woman-leader-year', 'fee' => 0],
        ];

        $categories = [];

        foreach ($records as $index => $record) {
            $category = AwardCategory::query()->updateOrCreate(
                ['slug' => $record['slug']],
                [
                    'award_season_id' => $season->id,
                    'name' => $record['name'],
                    'description' => 'Muslim Stara Women Awards recognition category.',
                    'eligibility_rules' => [
                        'faith_aligned' => true,
                        'community_impact' => true,
                    ],
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]
            );

            CategoryPricing::query()->updateOrCreate(
                ['award_category_id' => $category->id],
                [
                    'form_type' => $record['fee'] > 0 ? 'paid' : 'free',
                    'application_fee' => $record['fee'],
                    'currency' => 'TZS',
                    'early_bird_fee' => $record['fee'] > 0 ? max($record['fee'] - 10000, 0) : null,
                    'deadline' => '2026-08-31 23:59:59',
                    'is_active' => true,
                ]
            );

            $categories[] = $category;
        }

        return $categories;
    }

    private function seedNominees(array $categories, array $users): array
    {
        $records = [
            ['category' => 0, 'person' => 'Amina Hassan', 'brand' => 'Amina Learning Circle', 'email' => 'amina@mswa.test', 'city' => 'Dar es Salaam', 'profile' => 'Learning circles, mentorship, and networking for modest women.'],
            ['category' => 0, 'person' => 'Khadija Rashid', 'brand' => 'Sisterhood Growth Hub', 'email' => 'khadija@mswa.test', 'city' => 'Mwanza', 'profile' => 'Mentorship programs and professional networking for young Muslim women.'],
            ['category' => 1, 'person' => 'Maryam Said', 'brand' => 'Quran & Sisterhood Circle', 'email' => 'maryam@mswa.test', 'city' => 'Zanzibar', 'profile' => 'Islamic education, Quran learning, and sisterhood programs.'],
            ['category' => 2, 'person' => 'Zahra Ally', 'brand' => 'Halal Enterprise Hub', 'email' => 'zahra@mswa.test', 'city' => 'Arusha', 'profile' => 'Ethical entrepreneurship, jobs, and business mentorship.'],
            ['category' => 3, 'person' => 'Safiya Omar', 'brand' => 'Hope & Charity Initiative', 'email' => 'safiya@mswa.test', 'city' => 'Dodoma', 'profile' => 'Charity drives, family support, and community care.'],
            ['category' => 4, 'person' => 'Hafsa Salim', 'brand' => 'Modest Creative Studio', 'email' => 'hafsa@mswa.test', 'city' => 'Dar es Salaam', 'profile' => 'Modest fashion, media storytelling, and creative excellence.'],
            ['category' => 5, 'person' => 'Dr. Asma Hussein', 'brand' => 'Women Leadership Forum', 'email' => 'asma@mswa.test', 'city' => 'Morogoro', 'profile' => 'Faith-led leadership and public service impact.'],
        ];

        $nominees = [];

        foreach ($records as $index => $record) {
            $category = $categories[$record['category']] ?? $categories[0] ?? null;

            if (! $category) {
                continue;
            }

            $nominees[] = Nominee::query()->updateOrCreate(
                ['email' => $record['email']],
                [
                    'user_id' => $index === 0 ? $users['nominee']->id : null,
                    'award_category_id' => $category->id,
                    'business_name' => $record['brand'],
                    'contact_person' => $record['person'],
                    'phone' => '+25570020010'.$index,
                    'website' => 'https://muslimstarawomenawards.test',
                    'city' => $record['city'],
                    'country' => 'Tanzania',
                    'company_profile' => $record['profile'],
                    'photo_path' => null,
                    'video_url' => null,
                    'status' => 'active',
                ]
            );
        }

        return $nominees;
    }

    private function seedNominations(array $categories, array $nominees, array $users): void
    {
        foreach ($nominees as $index => $nominee) {
            Nomination::query()->updateOrCreate(
                ['reference' => 'MSWA-NOM-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT)],
                [
                    'user_id' => $index === 0 ? $users['nominee']->id : $users['public_user']->id,
                    'award_category_id' => $nominee->award_category_id,
                    'nominee_id' => $nominee->id,
                    'form_payload' => [
                        'summary' => $nominee->company_profile,
                        'city' => $nominee->city,
                    ],
                    'status' => $index < 4 ? 'submitted' : 'draft',
                    'submitted_at' => $index < 4 ? now()->subDays(7 - $index) : null,
                ]
            );
        }
    }

    private function seedJudges(array $users): void
    {
        Judge::query()->updateOrCreate(
            ['email' => $users['judge']->email],
            [
                'user_id' => $users['judge']->id,
                'full_name' => $users['judge']->name,
                'title' => 'Islamic Education & Community Impact Judge',
                'organization' => 'Muslim Stara Women Awards Council',
                'bio' => 'Experienced evaluator in Islamic education, women leadership, and community impact.',
                'is_active' => true,
            ]
        );
    }

    private function seedEvent(AwardSeason $season): Event
    {
        return Event::query()->updateOrCreate(
            ['event_name' => 'Muslim Stara Women Awards Gala 2026'],
            [
                'award_season_id' => $season->id,
                'event_description' => 'Premium gala honoring modest women, Islamic education, business recognition, and charity impact.',
                'event_date' => '2026-11-15',
                'event_time' => '19:00:00',
                'venue_name' => 'Julius Nyerere International Convention Centre',
                'venue_address' => 'Shaaban Robert Street',
                'city' => 'Dar es Salaam',
                'country' => 'Tanzania',
                'latitude' => -6.8134,
                'longitude' => 39.2894,
                'event_capacity' => 1200,
                'status' => 'published',
            ]
        );
    }

    private function seedTickets(Event $event): void
    {
        $tickets = [
            ['ticket_type' => 'VIP', 'name' => 'VIP Sisterhood Access', 'price' => 150000, 'quantity' => 200],
            ['ticket_type' => 'Standard', 'name' => 'Standard Gala Pass', 'price' => 50000, 'quantity' => 1000],
        ];

        foreach ($tickets as $ticket) {
            Ticket::query()->updateOrCreate(
                ['event_id' => $event->id, 'ticket_type' => $ticket['ticket_type']],
                [
                    'name' => $ticket['name'],
                    'description' => 'Access to the Muslim Stara Women Awards gala experience.',
                    'price' => $ticket['price'],
                    'currency' => 'TZS',
                    'quantity' => $ticket['quantity'],
                    'is_active' => true,
                ]
            );
        }
    }

    private function seedSponsors(): void
    {
        SponsorPackage::query()->updateOrCreate(
            ['slug' => 'platinum-sisterhood-partner'],
            [
                'name' => 'Platinum Sisterhood Partner',
                'price' => 25000000,
                'currency' => 'TZS',
                'benefits' => ['prime_logo_placement', 'stage_mentions', 'media_coverage', 'charity_support_badge'],
                'logo_placement' => 'Main stage LED + website hero',
                'stage_mentions' => true,
                'website_listing' => true,
                'booth_space' => 'Large',
                'complimentary_tickets' => 20,
                'is_active' => true,
            ]
        );

        Sponsor::query()->updateOrCreate(
            ['email' => 'partners@mswa.test'],
            [
                'name' => 'MSWA Strategic Partners',
                'contact_person' => 'Partnership Desk',
                'phone' => '+255700300001',
                'website' => 'https://muslimstarawomenawards.test',
                'description' => 'Partners supporting Islamic education, sisterhood, charity, and women entrepreneurship.',
                'is_active' => true,
            ]
        );
    }

    private function seedContent(User $admin, Event $event): void
    {
        Post::query()->updateOrCreate(
            ['slug' => 'mswa-season-2026-open'],
            [
                'user_id' => $admin->id,
                'title' => 'Muslim Stara Women Awards 2026 Is Open',
                'excerpt' => 'Applications and public voting are opening for MSWA 2026.',
                'body' => 'Submit nominations for women leading learning, Islamic education, business recognition, charity, and social support.',
                'status' => 'published',
                'published_at' => now()->subDays(3),
            ]
        );

        GalleryItem::query()->updateOrCreate(
            ['url' => 'https://picsum.photos/seed/mswa/1200/800'],
            [
                'event_id' => $event->id,
                'title' => 'MSWA Sisterhood Highlights',
                'type' => 'image',
                'caption' => 'Learning, networking, charity, and recognition moments.',
                'is_featured' => true,
            ]
        );
    }

    private function seedWinner(AwardSeason $season, ?AwardCategory $category, ?Nominee $nominee): void
    {
        if (! $category || ! $nominee) {
            return;
        }

        Winner::query()->updateOrCreate(
            [
                'award_season_id' => $season->id,
                'award_category_id' => $category->id,
                'position' => 'winner',
            ],
            [
                'nominee_id' => $nominee->id,
                'hall_of_fame' => true,
                'is_published' => true,
                'announced_at' => now()->subDay(),
            ]
        );
    }

    private function seedSettings(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['key' => 'platform.theme'],
            [
                'group' => 'appearance',
                'value' => json_encode(['palette' => 'deep-dark-gold-emerald']),
                'is_public' => true,
            ]
        );
    }

    private function printCredentials(): void
    {
        if (! $this->command) {
            return;
        }

        $this->command->info('');
        $this->command->info('MSWA demo login credentials');
        $this->command->info('Password for all accounts: '.self::DEMO_PASSWORD);
        $this->command->line('superadmin@mswa.test  | super_admin');
        $this->command->line('admin@mswa.test       | admin');
        $this->command->line('judge@mswa.test       | judge');
        $this->command->line('sponsor@mswa.test     | sponsor');
        $this->command->line('nominee@mswa.test     | nominee');
        $this->command->line('user@mswa.test        | public_user');
        $this->command->info('');
    }
}
