<?php

namespace App\Http\Requests\Sms;

use App\Http\Requests\ApiFormRequest;

class StoreSmsCampaignRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'provider' => ['nullable', 'string', 'max:100'],
            'audience_type' => ['nullable', 'string', 'max:100'],
            'scheduled_at' => ['nullable', 'date'],
            'meta' => ['nullable', 'array'],
        ];
    }
}

