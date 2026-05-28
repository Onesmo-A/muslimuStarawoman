<?php

namespace App\Policies;

use App\Models\TicketOrder;
use App\Models\User;

class TicketOrderPolicy
{
    public function view(User $user, TicketOrder $ticketOrder): bool
    {
        return $user->id === $ticketOrder->user_id || $user->can('manage_tickets');
    }

    public function update(User $user, TicketOrder $ticketOrder): bool
    {
        return $user->can('manage_tickets');
    }
}
