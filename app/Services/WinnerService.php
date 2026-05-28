<?php

namespace App\Services;

use App\Repositories\WinnerRepository;

class WinnerService
{
    public function __construct(private readonly WinnerRepository $repository)
    {
    }

    public function publish(array $payload)
    {
        return $this->repository->publish([
            ...$payload,
            'is_published' => true,
            'announced_at' => now(),
        ]);
    }

    public function bySeason(int $seasonId)
    {
        return $this->repository->bySeason($seasonId);
    }
}
