<?php

namespace App\Policies;

use App\Models\Score;
use App\Models\User;

class ScorePolicy
{
    public function create(User $user): bool
    {
        return $user->can('manage_scores') || $user->hasRole('judge');
    }

    public function view(User $user, Score $score): bool
    {
        return $user->can('manage_scores') || $user->hasRole('judge');
    }
}
