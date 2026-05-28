<?php

namespace App\Services;

use App\Models\TicketScan;
use App\Repositories\TicketRepository;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TicketService
{
    public function __construct(private readonly TicketRepository $repository)
    {
    }

    public function listEvents(int $perPage = 15)
    {
        return $this->repository->listEvents($perPage);
    }

    public function purchase(?int $userId, array $payload)
    {
        $ticket = $this->repository->findTicket($payload['ticket_id']);

        if (! $ticket) {
            throw ValidationException::withMessages(['ticket_id' => ['Ticket type not found or inactive.']]);
        }

        if (($ticket->quantity - $ticket->sold) < $payload['quantity']) {
            throw ValidationException::withMessages(['quantity' => ['Requested quantity exceeds availability.']]);
        }

        $ticketCode = 'TKT-'.strtoupper(Str::random(10));

        $order = $this->repository->createOrder([
            'ticket_id' => $ticket->id,
            'user_id' => $userId,
            'ticket_code' => $ticketCode,
            'qr_code' => base64_encode($ticketCode),
            'purchaser_name' => $payload['purchaser_name'],
            'purchaser_email' => $payload['purchaser_email'],
            'purchaser_phone' => $payload['purchaser_phone'] ?? null,
            'quantity' => $payload['quantity'],
            'total_amount' => round(((float) $ticket->price) * ((int) $payload['quantity']), 2),
            'currency' => $ticket->currency,
            'status' => 'paid',
            'issued_at' => now(),
        ]);

        $ticket->increment('sold', $payload['quantity']);

        return $order;
    }

    public function validateTicket(string $ticketCode, ?int $scannerUserId): array
    {
        $order = $this->repository->findOrderByCode($ticketCode);

        if (! $order) {
            return ['valid' => false, 'message' => 'Ticket code not found'];
        }

        $alreadyUsed = TicketScan::query()->where('ticket_order_id', $order->id)->where('status', 'valid')->exists();

        $status = $alreadyUsed ? 'duplicate' : 'valid';

        TicketScan::query()->create([
            'ticket_order_id' => $order->id,
            'scanned_by' => $scannerUserId,
            'scanned_at' => now(),
            'status' => $status,
            'notes' => $alreadyUsed ? 'Ticket already scanned' : null,
        ]);

        return [
            'valid' => ! $alreadyUsed,
            'message' => $alreadyUsed ? 'Duplicate scan detected' : 'Ticket validated successfully',
            'order' => $order,
        ];
    }
}
