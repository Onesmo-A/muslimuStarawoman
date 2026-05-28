<?php

namespace App\Repositories;

use App\Models\Score;

class ScoreRepository
{
    public function store(array $payload): Score
    {
        return Score::query()->updateOrCreate(
            [
                'judge_assignment_id' => $payload['judge_assignment_id'],
                'nomination_id' => $payload['nomination_id'],
            ],
            $payload,
        );
    }
}
