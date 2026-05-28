<?php

namespace App\Services;

use App\Repositories\EventRepository;

class EventService
{
    public function __construct(private readonly EventRepository $repository)
    {
    }

    public function listPublished(int $perPage = 15)
    {
        return $this->repository->listPublished($perPage);
    }

    public function details(int $id)
    {
        return $this->repository->findPublished($id);
    }

    public function create(array $payload)
    {
        return $this->repository->create($payload);
    }

    public function update(int $id, array $payload)
    {
        $event = $this->repository->findById($id);

        if (! $event) {
            return null;
        }

        $event->update($payload);

        return $event;
    }
}
