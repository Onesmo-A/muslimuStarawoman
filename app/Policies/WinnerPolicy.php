<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Winner;

class WinnerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage_reports');
    }

    public function create(User $user): bool
    {
        return $user->can('manage_reports');
    }

    public function update(User $user, Winner $winner): bool
    {
        return $user->can('manage_reports');
    }
}
