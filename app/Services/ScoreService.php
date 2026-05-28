<?php

namespace App\Services;

use App\Repositories\ScoreRepository;

class ScoreService
{
    public function __construct(private readonly ScoreRepository $repository)
    {
    }

    public function store(array $payload)
    {
        return $this->repository->store([
            ...$payload,
            'scored_at' => now(),
            'weight' => $payload['weight'] ?? 1,
        ]);
    }
}
