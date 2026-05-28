<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Events\StoreEventRequest;
use App\Http\Requests\Events\UpdateEventRequest;
use App\Services\EventService;
use Illuminate\Http\Request;

class EventController extends BaseApiController
{
    public function __construct(private readonly EventService $eventService)
    {
    }

    public function index(Request $request)
    {
        $events = $this->eventService->listPublished((int) $request->integer('per_page', 15));

        return $this->successResponse($events->items(), 'Events fetched', [
            'current_page' => $events->currentPage(),
            'last_page' => $events->lastPage(),
            'per_page' => $events->perPage(),
            'total' => $events->total(),
        ]);
    }

    public function show(int $id)
    {
        $event = $this->eventService->details($id);

        return $event
            ? $this->successResponse($event, 'Event details')
            : $this->errorResponse('Event not found', 404);
    }

    public function store(StoreEventRequest $request)
    {
        $event = $this->eventService->create($request->validated());

        return $this->successResponse($event, 'Event created', status: 201);
    }

    public function update(UpdateEventRequest $request, int $id)
    {
        $event = $this->eventService->update($id, $request->validated());

        return $event
            ? $this->successResponse($event, 'Event updated')
            : $this->errorResponse('Event not found', 404);
    }
}
