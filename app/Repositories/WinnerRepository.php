<?php

namespace App\Repositories;

use App\Models\Winner;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

class WinnerRepository
{
    public function publish(array $payload): Winner
    {
        return Winner::query()->updateOrCreate(
            [
                'award_season_id' => $payload['award_season_id'],
                'award_category_id' => $payload['award_category_id'],
                'position' => $payload['position'],
            ],
            $payload,
        );
    }

    public function bySeason(int $seasonId)
    {
        if (! Schema::hasTable('winners')) {
            return new Collection();
        }

        return Winner::query()
            ->where('award_season_id', $seasonId)
            ->where('is_published', true)
            ->with(['awardCategory', 'nominee'])
            ->get();
    }
}
