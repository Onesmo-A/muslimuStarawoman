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
            requestContext: $this->requestContext($request),
        );

        if ($result['status'] === 'blocked') {
            $reason = $result['eligibility']['reason'] ?? null;

            $message = match ($reason) {
                'already_voted' => 'Already voted',
                'voting_disabled', 'category_closed' => 'Voting Not Started',
                default => 'Vote eligibility failed',
            };

            return $this->errorResponse($message, 422, ['eligibility' => $result['eligibility']]);
        }

        return $this->successResponse($result, 'Vote cast successfully', status: 201);
    }

    public function eligibility(Request $request)
    {
        $categoryId = (int) $request->integer('award_category_id');

        if ($categoryId <= 0) {
            return $this->errorResponse('award_category_id query parameter is required', 422);
        }

        $fingerprint = $request->string('device_fingerprint')->toString() ?: null;
        $result = $this->votingService->checkEligibility(
            $request->user()?->id,
            (string) $request->ip(),
            $categoryId,
            $this->votingService->fingerprintHash($fingerprint)
        );

        return $this->successResponse($result, 'Eligibility computed');
    }

    private function requestContext(Request $request): array
    {
        return [
            'ip' => (string) $request->ip(),
            'user_agent' => $request->userAgent(),
            'accept_language' => $request->header('Accept-Language'),
            'referer' => $request->header('Referer'),
            'origin' => $request->header('Origin'),
            'x_forwarded_for' => $request->header('X-Forwarded-For'),
            'x_real_ip' => $request->header('X-Real-IP'),
        ];
    }
}
