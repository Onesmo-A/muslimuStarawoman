<?php

namespace App\Services;

use App\Repositories\VoteRepository;

class VotingService
{
    private const MAX_USER_VOTES_PER_CATEGORY = 3;

    private const MAX_IP_VOTES_PER_CATEGORY = 10;

    public function __construct(private readonly VoteRepository $repository)
    {
    }

    public function checkEligibility(?int $userId, string $ipAddress, int $categoryId): array
    {
        $userVotes = $this->repository->userVoteCountByCategory($userId, $categoryId);
        $ipVotes = $this->repository->ipVoteCountByCategory($ipAddress, $categoryId);

        $eligible = $userVotes < self::MAX_USER_VOTES_PER_CATEGORY && $ipVotes < self::MAX_IP_VOTES_PER_CATEGORY;

        return [
            'eligible' => $eligible,
            'remaining_user_votes' => max(self::MAX_USER_VOTES_PER_CATEGORY - $userVotes, 0),
            'remaining_ip_votes' => max(self::MAX_IP_VOTES_PER_CATEGORY - $ipVotes, 0),
        ];
    }

    public function cast(?int $userId, array $payload, string $ipAddress, ?string $fingerprint = null)
    {
        $eligibility = $this->checkEligibility($userId, $ipAddress, (int) $payload['award_category_id']);

        if (! $eligibility['eligible']) {
            return [
                'status' => 'blocked',
                'eligibility' => $eligibility,
                'vote' => null,
            ];
        }

        $vote = $this->repository->create([
            'award_category_id' => $payload['award_category_id'],
            'nominee_id' => $payload['nominee_id'],
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'device_fingerprint' => $fingerprint,
            'captcha_token' => $payload['captcha_token'] ?? null,
            'status' => 'valid',
            'voted_at' => now(),
            'weight' => 1,
        ]);

        return [
            'status' => 'valid',
            'eligibility' => $this->checkEligibility($userId, $ipAddress, (int) $payload['award_category_id']),
            'vote' => $vote,
        ];
    }
}
