<?php

namespace App\Repositories;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketOrder;

class TicketRepository
{
    public function listEvents(int $perPage = 15)
    {
        return Event::query()->where('status', 'published')->latest('event_date')->paginate($perPage);
    }

    public function findTicket(int $id): ?Ticket
    {
        return Ticket::query()->whereKey($id)->where('is_active', true)->first();
    }

    public function createOrder(array $payload): TicketOrder
    {
        return TicketOrder::query()->create($payload);
    }

    public function findOrderByCode(string $ticketCode): ?TicketOrder
    {
        return TicketOrder::query()->where('ticket_code', $ticketCode)->first();
    }
}
