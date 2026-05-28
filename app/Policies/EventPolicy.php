<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('manage_content');
    }

    public function create(User $user): bool
    {
        return $user->can('manage_content');
    }

    public function update(User $user, Event $event): bool
    {
        return $user->can('manage_content');
    }
}
