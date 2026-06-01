<?php

namespace App\Services;

use App\Models\Nominee;
use App\Repositories\VoteRepository;
use Illuminate\Support\Arr;

class VotingService
{
    private const MAX_USER_VOTES_PER_CATEGORY = 3;

    private const MAX_IP_VOTES_PER_CATEGORY = 10;

    private const MAX_FINGERPRINT_VOTES_PER_CATEGORY = 1;

    public function __construct(private readonly VoteRepository $repository)
    {
    }

    public function checkEligibility(?int $userId, string $ipAddress, int $categoryId, ?string $fingerprintHash = null): array
    {
        $userVotes = $this->repository->userVoteCountByCategory($userId, $categoryId);
        $ipVotes = $this->repository->ipVoteCountByCategory($ipAddress, $categoryId);
        $fingerprintVotes = $this->repository->fingerprintVoteCountByCategory($fingerprintHash, $categoryId);

        $eligible = $userVotes < self::MAX_USER_VOTES_PER_CATEGORY
            && $ipVotes < self::MAX_IP_VOTES_PER_CATEGORY
            && $fingerprintVotes < self::MAX_FINGERPRINT_VOTES_PER_CATEGORY;

        return [
            'eligible' => $eligible,
            'block_reason' => $this->blockReason($userVotes, $ipVotes, $fingerprintVotes),
            'remaining_user_votes' => max(self::MAX_USER_VOTES_PER_CATEGORY - $userVotes, 0),
            'remaining_ip_votes' => max(self::MAX_IP_VOTES_PER_CATEGORY - $ipVotes, 0),
            'remaining_fingerprint_votes' => max(self::MAX_FINGERPRINT_VOTES_PER_CATEGORY - $fingerprintVotes, 0),
        ];
    }

    public function cast(?int $userId, array $payload, string $ipAddress, ?string $fingerprint = null, array $requestContext = [])
    {
        $categoryId = (int) $payload['award_category_id'];
        $nomineeId = (int) $payload['nominee_id'];
        $fingerprintHash = $this->hashFingerprint($fingerprint);
        $signals = Arr::only($payload['device_signals'] ?? [], [
            'timezone',
            'language',
            'languages',
            'platform',
            'screen',
            'colorDepth',
            'hardwareConcurrency',
            'deviceMemory',
            'touchPoints',
            'userAgent',
            'localSeed',
            'fingerprintVersion',
        ]);
        $baseVotePayload = [
            'award_category_id' => $categoryId,
            'nominee_id' => $nomineeId,
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'device_fingerprint' => $fingerprint,
            'fingerprint_hash' => $fingerprintHash,
            'captcha_token' => $payload['captcha_token'] ?? null,
            'identity_strategy' => 'fingerprint',
            'verification_token' => $payload['verification_token'] ?? null,
            'external_token' => $payload['external_token'] ?? null,
            'source' => $payload['source'] ?? 'web',
            'identity_signals' => $signals,
            'request_context' => $requestContext,
            'voted_at' => now(),
            'weight' => 1,
        ];

        if (! $this->nomineeBelongsToCategory($nomineeId, $categoryId)) {
            $vote = $this->repository->create([
                ...$baseVotePayload,
                'status' => 'blocked',
                'block_reason' => 'nominee_category_mismatch',
                'weight' => 0,
            ]);

            return [
                'status' => 'blocked',
                'eligibility' => ['eligible' => false, 'block_reason' => 'nominee_category_mismatch'],
                'vote' => $vote,
            ];
        }

        $eligibility = $this->checkEligibility($userId, $ipAddress, $categoryId, $fingerprintHash);

        if (! $eligibility['eligible']) {
            $vote = $this->repository->create([
                ...$baseVotePayload,
                'status' => 'blocked',
                'block_reason' => $eligibility['block_reason'],
                'weight' => 0,
            ]);

            return [
                'status' => 'blocked',
                'eligibility' => $eligibility,
                'vote' => $vote,
            ];
        }

        $vote = $this->repository->create([
            ...$baseVotePayload,
            'status' => 'valid',
        ]);

        return [
            'status' => 'valid',
            'eligibility' => $this->checkEligibility($userId, $ipAddress, $categoryId, $fingerprintHash),
            'vote' => $vote,
        ];
    }

    public function fingerprintHash(?string $fingerprint): ?string
    {
        return $this->hashFingerprint($fingerprint);
    }

    private function hashFingerprint(?string $fingerprint): ?string
    {
        if (! $fingerprint) {
            return null;
        }

        return hash_hmac('sha256', $fingerprint, (string) config('app.key'));
    }

    private function nomineeBelongsToCategory(int $nomineeId, int $categoryId): bool
    {
        return Nominee::query()
            ->whereKey($nomineeId)
            ->where('award_category_id', $categoryId)
            ->exists();
    }

    private function blockReason(int $userVotes, int $ipVotes, int $fingerprintVotes): ?string
    {
        if ($fingerprintVotes >= self::MAX_FINGERPRINT_VOTES_PER_CATEGORY) {
            return 'fingerprint_limit';
        }

        if ($userVotes >= self::MAX_USER_VOTES_PER_CATEGORY) {
            return 'user_limit';
        }

        if ($ipVotes >= self::MAX_IP_VOTES_PER_CATEGORY) {
            return 'ip_limit';
        }

        return null;
    }
}
