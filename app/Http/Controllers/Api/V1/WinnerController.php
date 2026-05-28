<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Winners\PublishWinnerRequest;
use App\Services\WinnerService;
use Illuminate\Http\Request;

class WinnerController extends BaseApiController
{
    public function __construct(private readonly WinnerService $winnerService)
    {
    }

    public function publish(PublishWinnerRequest $request)
    {
        $winner = $this->winnerService->publish($request->validated());

        return $this->successResponse($winner, 'Winner published');
    }

    public function bySeason(Request $request)
    {
        $seasonId = (int) $request->integer('award_season_id');

        if ($seasonId <= 0) {
            return $this->errorResponse('award_season_id query parameter is required', 422);
        }

        return $this->successResponse($this->winnerService->bySeason($seasonId), 'Season winners');
    }
}
