<?php

namespace App\Http\Requests\Events;

use App\Http\Requests\ApiFormRequest;

class StoreEventRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'award_season_id' => ['nullable', 'integer', 'exists:award_seasons,id'],
            'event_name' => ['required', 'string', 'max:255'],
            'event_description' => ['nullable', 'string'],
            'event_date' => ['required', 'date'],
            'event_time' => ['nullable', 'date_format:H:i'],
            'venue_name' => ['required', 'string', 'max:255'],
            'venue_address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'event_capacity' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', 'in:draft,published,cancelled,completed'],
        ];
    }
}

