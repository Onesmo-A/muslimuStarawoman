<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Voting\CastVoteRequest;
use App\Services\VotingService;
use Illuminate\Http\Request;

class VotingController extends BaseApiController
{
    public function __construct(private readonly VotingService $votingService)
    {
    }

    public function cast(CastVoteRequest $request)
    {
        $result = $this->votingService->cast(
            userId: $request->user()?->id,
            payload: $request->validated(),
            ipAddress: (string) $request->ip(),
            fingerprint: $request->string('device_fingerprint')->toString() ?: null,
        );

        if ($result['status'] === 'blocked') {
            return $this->errorResponse('Vote eligibility failed', 429, ['eligibility' => $result['eligibility']]);
        }

        return $this->successResponse($result, 'Vote cast successfully', status: 201);
    }

    public function eligibility(Request $request)
    {
        $categoryId = (int) $request->integer('award_category_id');

        if ($categoryId <= 0) {
            return $this->errorResponse('award_category_id query parameter is required', 422);
        }

        $result = $this->votingService->checkEligibility($request->user()?->id, (string) $request->ip(), $categoryId);

        return $this->successResponse($result, 'Eligibility computed');
    }
}
