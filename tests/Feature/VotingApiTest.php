<?php

namespace Tests\Feature;

use App\Models\AwardCategory;
use App\Models\AwardSeason;
use App\Models\Nominee;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VotingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_vote_can_be_cast_when_eligible(): void
    {
        $season = AwardSeason::query()->create([
            'name' => 'Season',
            'slug' => 'season',
            'year' => 2026,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
        ]);

        $category = AwardCategory::query()->create([
            'award_season_id' => $season->id,
            'name' => 'Category',
            'slug' => 'category',
        ]);

        $nominee = Nominee::query()->create([
            'award_category_id' => $category->id,
            'business_name' => 'Nominee Ltd',
            'contact_person' => 'Nominee Contact',
            'email' => 'nominee@example.test',
        ]);

        $vote = $this->postJson('/api/v1/voting/cast', [
            'award_category_id' => $category->id,
            'nominee_id' => $nominee->id,
            'captcha_token' => 'demo-captcha',
            'device_fingerprint' => 'fp-1',
        ]);

        $vote->assertStatus(201)->assertJsonPath('success', true);
    }
}
