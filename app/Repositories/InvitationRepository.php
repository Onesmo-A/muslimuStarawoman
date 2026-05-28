<?php

namespace App\Repositories;

use App\Models\Invitation;
use App\Models\InvitationResponse;

class InvitationRepository
{
    public function create(array $payload): Invitation
    {
        return Invitation::query()->create($payload);
    }

    public function findById(int $id): ?Invitation
    {
        return Invitation::query()->find($id);
    }

    public function findByToken(string $token): ?Invitation
    {
        return Invitation::query()->where('token', $token)->first();
    }

    public function response(array $payload): InvitationResponse
    {
        return InvitationResponse::query()->create($payload);
    }
}
