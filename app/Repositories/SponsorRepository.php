<?php

namespace App\Repositories;

use App\Models\SponsorOrder;
use App\Models\SponsorPackage;

class SponsorRepository
{
    public function listPackages()
    {
        return SponsorPackage::query()->where('is_active', true)->orderBy('price')->get();
    }

    public function findPackage(int $id): ?SponsorPackage
    {
        return SponsorPackage::query()->whereKey($id)->where('is_active', true)->first();
    }

    public function createOrder(array $payload): SponsorOrder
    {
        return SponsorOrder::query()->create($payload);
    }
}
