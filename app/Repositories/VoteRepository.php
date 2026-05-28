<?php

namespace App\Repositories;

use App\Models\Vote;

class VoteRepository
{
    public function userVoteCountByCategory(?int $userId, int $categoryId): int
    {
        if ($userId === null) {
            return 0;
        }

        return Vote::query()->where('user_id', $userId)->where('award_category_id', $categoryId)->count();
    }

    public function ipVoteCountByCategory(string $ipAddress, int $categoryId): int
    {
        return Vote::query()->where('ip_address', $ipAddress)->where('award_category_id', $categoryId)->count();
    }

    public function create(array $payload): Vote
    {
        return Vote::query()->create($payload);
    }
}
