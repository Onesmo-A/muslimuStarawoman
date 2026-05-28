<?php

namespace App\Http\Requests\Nominations;

use App\Http\Requests\ApiFormRequest;

class StoreNominationRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'award_category_id' => ['required', 'integer', 'exists:award_categories,id'],
            'nominee_id' => ['nullable', 'integer', 'exists:nominees,id'],
            'form_payload' => ['nullable', 'array'],
        ];
    }
}

