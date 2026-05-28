<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Tickets\PurchaseTicketRequest;
use App\Http\Requests\Tickets\ValidateTicketRequest;
use App\Services\TicketService;
use Illuminate\Http\Request;

class TicketController extends BaseApiController
{
    public function __construct(private readonly TicketService $ticketService)
    {
    }

    public function listEvents(Request $request)
    {
        $events = $this->ticketService->listEvents((int) $request->integer('per_page', 15));

        return $this->successResponse(
            $events->items(),
            'Events fetched',
            [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
            ]
        );
    }

    public function purchase(PurchaseTicketRequest $request)
    {
        $order = $this->ticketService->purchase($request->user()?->id, $request->validated());

        return $this->successResponse($order, 'Ticket purchased', status: 201);
    }

    public function validateTicket(ValidateTicketRequest $request)
    {
        $result = $this->ticketService->validateTicket($request->string('ticket_code')->toString(), $request->user()?->id);

        return $result['valid']
            ? $this->successResponse($result, $result['message'])
            : $this->errorResponse($result['message'], 422, data: $result);
    }
}
