<?php

namespace App\Policies;

use App\Models\Nomination;
use App\Models\User;

class NominationPolicy
{
    public function view(User $user, Nomination $nomination): bool
    {
        return $user->id === $nomination->user_id || $user->can('manage_nominations');
    }

    public function create(User $user): bool
    {
        return $user->can('manage_nominations') || $user->hasAnyRole(['public_user', 'nominee']);
    }

    public function update(User $user, Nomination $nomination): bool
    {
        return $user->id === $nomination->user_id || $user->can('manage_nominations');
    }
}
