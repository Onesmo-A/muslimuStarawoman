<?php

namespace Tests\Feature;

use App\Models\AwardCategory;
use App\Models\AwardSeason;
use App\Models\Judge;
use App\Models\JudgeAssignment;
use App\Models\Nomination;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class JudgeScoringApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_judge_score_can_be_saved_and_aggregated(): void
    {
        Permission::findOrCreate('manage_scores', 'web');

        $judgeUser = User::factory()->create();
        $judgeUser->givePermissionTo('manage_scores');

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

        $judge = Judge::query()->create([
            'user_id' => $judgeUser->id,
            'full_name' => 'Judge Name',
            'email' => 'judge@example.test',
            'is_active' => true,
        ]);

        $assignment = JudgeAssignment::query()->create([
            'judge_id' => $judge->id,
            'award_category_id' => $category->id,
            'weight' => 1,
        ]);

        $nominee = User::factory()->create();

        $nomination = Nomination::query()->create([
            'user_id' => $nominee->id,
            'award_category_id' => $category->id,
            'reference' => 'NOM-SCORE-1',
            'status' => 'submitted',
        ]);

        Sanctum::actingAs($judgeUser);

        $store = $this->postJson('/api/v1/admin/scores', [
            'judge_assignment_id' => $assignment->id,
            'nomination_id' => $nomination->id,
            'score' => 88,
            'weight' => 1.5,
        ]);

        $store->assertOk()->assertJsonPath('success', true);

        $aggregate = $this->getJson('/api/v1/admin/scores/aggregate?nomination_id='.$nomination->id);

        $aggregate->assertOk()->assertJsonPath('data.entries', 1);
    }
}
