<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Nomination;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NominationController extends BaseApiController
{
    public function index()
    {
        $nominations = Nomination::query()
            ->with(['category:id,name', 'user:id,name,email,phone'])
            ->orderByDesc('created_at')
            ->get();

        return $this->successResponse($nominations, 'Admin nomination applications list');
    }

    public function show(Nomination $nomination)
    {
        return $this->successResponse($nomination->load(['category:id,name', 'user:id,name,email,phone', 'files']), 'Nomination details');
    }

    public function review(Request $request, Nomination $nomination)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['under_review', 'shortlisted', 'approved', 'rejected'])],
            'review_notes' => ['nullable', 'string'],
        ]);

        $nomination->status = $data['status'];
        $nomination->review_notes = $data['review_notes'] ?? null;
        $nomination->reviewed_at = now();
        $nomination->save();

        return $this->successResponse($nomination->fresh(['category:id,name', 'user:id,name,email,phone', 'files']), 'Nomination reviewed successfully');
    }

    public function destroy(Nomination $nomination)
    {
        $nomination->delete();

        return $this->successResponse(message: 'Nomination deleted');
    }
}
