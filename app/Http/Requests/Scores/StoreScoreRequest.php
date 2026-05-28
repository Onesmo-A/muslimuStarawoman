<?php

namespace App\Http\Requests\Scores;

use App\Http\Requests\ApiFormRequest;

class StoreScoreRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judge_assignment_id' => ['required', 'integer', 'exists:judge_assignments,id'],
            'nomination_id' => ['required', 'integer', 'exists:nominations,id'],
            'criteria' => ['nullable', 'array'],
            'score' => ['required', 'numeric', 'min:0', 'max:100'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
