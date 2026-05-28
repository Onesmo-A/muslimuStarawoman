<?php

namespace App\Http\Requests\Winners;

use App\Http\Requests\ApiFormRequest;

class PublishWinnerRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'award_season_id' => ['required', 'integer', 'exists:award_seasons,id'],
            'award_category_id' => ['required', 'integer', 'exists:award_categories,id'],
            'nomination_id' => ['nullable', 'integer', 'exists:nominations,id'],
            'nominee_id' => ['nullable', 'integer', 'exists:nominees,id'],
            'position' => ['required', 'in:winner,runner_up'],
            'hall_of_fame' => ['nullable', 'boolean'],
            'certificate_path' => ['nullable', 'string', 'max:500'],
        ];
    }
}

