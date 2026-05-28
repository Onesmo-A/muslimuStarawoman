<?php

namespace App\Repositories;

use App\Models\Nomination;
use App\Models\NominationFile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NominationRepository
{
    public function create(array $payload): Nomination
    {
        return Nomination::query()->create($payload);
    }

    public function findOwnedByUser(int $id, int $userId): ?Nomination
    {
        return Nomination::query()->whereKey($id)->where('user_id', $userId)->first();
    }

    public function saveFile(array $payload): NominationFile
    {
        return NominationFile::query()->create($payload);
    }

    public function userApplications(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Nomination::query()
            ->where('user_id', $userId)
            ->latest('id')
            ->paginate($perPage);
    }
}
