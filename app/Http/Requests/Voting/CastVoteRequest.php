<?php

namespace App\Http\Requests\Voting;

use App\Http\Requests\ApiFormRequest;

class CastVoteRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'award_category_id' => ['required', 'integer', 'exists:award_categories,id'],
            'nominee_id' => ['required', 'integer', 'exists:nominees,id'],
            'captcha_token' => ['nullable', 'string', 'max:500'],
            'device_fingerprint' => ['required', 'string', 'max:255'],
            'device_signals' => ['nullable', 'array'],
            'device_signals.*' => ['nullable'],
            'verification_token' => ['nullable', 'string', 'max:255'],
            'external_token' => ['nullable', 'string', 'max:255'],
            'source' => ['nullable', 'string', 'max:50'],
        ];
    }
}

