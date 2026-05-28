<?php

namespace App\Repositories;

use App\Models\Event;

class EventRepository
{
    public function listPublished(int $perPage = 15)
    {
        return Event::query()->where('status', 'published')->latest('event_date')->paginate($perPage);
    }

    public function findPublished(int $id): ?Event
    {
        return Event::query()->whereKey($id)->where('status', 'published')->first();
    }

    public function findById(int $id): ?Event
    {
        return Event::query()->find($id);
    }

    public function create(array $payload): Event
    {
        return Event::query()->create($payload);
    }
}
