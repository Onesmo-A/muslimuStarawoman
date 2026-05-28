<?php

namespace App\Services;

use App\Models\Sponsor;
use App\Repositories\SponsorRepository;

class SponsorService
{
    public function __construct(private readonly SponsorRepository $repository)
    {
    }

    public function packages()
    {
        return $this->repository->listPackages();
    }

    public function purchase(?int $userId, array $payload)
    {
        $package = $this->repository->findPackage($payload['sponsor_package_id']);

        if (! $package) {
            return null;
        }

        $sponsor = Sponsor::query()->firstOrCreate(
            ['email' => $payload['email']],
            [
                'user_id' => $userId,
                'name' => $payload['name'],
                'contact_person' => $payload['contact_person'] ?? null,
                'phone' => $payload['phone'] ?? null,
                'website' => $payload['website'] ?? null,
                'is_active' => true,
            ],
        );

        return $this->repository->createOrder([
            'sponsor_id' => $sponsor->id,
            'sponsor_package_id' => $package->id,
            'amount' => $package->price,
            'currency' => $package->currency,
            'status' => 'pending',
        ]);
    }
}
