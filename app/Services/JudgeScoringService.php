<?php

namespace App\Services;

use App\Models\Score;

class JudgeScoringService
{
    public function aggregateForNomination(int $nominationId): array
    {
        $scores = Score::query()->where('nomination_id', $nominationId)->get();

        if ($scores->isEmpty()) {
            return [
                'average_score' => 0.0,
                'weighted_score' => 0.0,
                'entries' => 0,
            ];
        }

        $average = round((float) $scores->avg('score'), 2);

        $weightedSum = 0.0;
        $weightTotal = 0.0;

        foreach ($scores as $score) {
            $weight = (float) ($score->weight ?? 1);
            $weightedSum += ((float) $score->score) * $weight;
            $weightTotal += $weight;
        }

        $weighted = $weightTotal > 0 ? round($weightedSum / $weightTotal, 2) : 0.0;

        return [
            'average_score' => $average,
            'weighted_score' => $weighted,
            'entries' => $scores->count(),
        ];
    }
}
