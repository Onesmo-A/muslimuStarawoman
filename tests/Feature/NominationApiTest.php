<?php

namespace Tests\Feature;

use App\Models\AwardCategory;
use App\Models\AwardSeason;
use App\Models\CategoryPricing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NominationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_and_submit_free_nomination(): void
    {
        $user = User::factory()->create();

        $season = AwardSeason::query()->create([
            'name' => 'Season',
            'slug' => 'season',
            'year' => 2026,
            'start_date' => '2026-01-01',
            'end_date' => '2026-12-31',
        ]);

        $category = AwardCategory::query()->create([
            'award_season_id' => $season->id,
            'name' => 'Best SME',
            'slug' => 'best-sme',
        ]);

        CategoryPricing::query()->create([
            'award_category_id' => $category->id,
            'form_type' => 'free',
            'application_fee' => 0,
            'currency' => 'USD',
        ]);

        Sanctum::actingAs($user);

        $create = $this->postJson('/api/v1/nominations', [
            'award_category_id' => $category->id,
            'form_payload' => ['demo' => 'value'],
        ]);

        $create->assertStatus(201)->assertJsonPath('success', true);

        $nominationId = $create->json('data.id');

        $submit = $this->postJson("/api/v1/nominations/{$nominationId}/submit", []);

        $submit->assertOk()->assertJsonPath('data.status', 'submitted');
    }
}
