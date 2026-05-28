<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Scores\StoreScoreRequest;
use App\Services\JudgeScoringService;
use App\Services\ScoreService;
use Illuminate\Http\Request;

class ScoreController extends BaseApiController
{
    public function __construct(
        private readonly JudgeScoringService $judgeScoringService,
        private readonly ScoreService $scoreService,
    ) {}

    public function store(StoreScoreRequest $request)
    {
        $score = $this->scoreService->store($request->validated());

        return $this->successResponse($score, 'Score saved');
    }

    public function aggregate(Request $request)
    {
        $nominationId = (int) $request->integer('nomination_id');

        if ($nominationId <= 0) {
            return $this->errorResponse('nomination_id query parameter is required', 422);
        }

        return $this->successResponse(
            $this->judgeScoringService->aggregateForNomination($nominationId),
            'Score aggregated'
        );
    }
}
