<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Nominations\StoreNominationRequest;
use App\Http\Requests\Nominations\SubmitNominationRequest;
use App\Http\Requests\Nominations\UploadNominationFileRequest;
use App\Services\NominationService;
use Illuminate\Http\Request;

class NominationController extends BaseApiController
{
    public function __construct(private readonly NominationService $nominationService)
    {
    }

    public function index(Request $request)
    {
        $items = $this->nominationService->applications($request->user()->id);

        return $this->successResponse(
            $items->items(),
            'Applications fetched',
            [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ]
        );
    }

    public function store(StoreNominationRequest $request)
    {
        $nomination = $this->nominationService->createDraft($request->user()->id, $request->validated());

        return $this->successResponse($nomination, 'Draft nomination created', status: 201);
    }

    public function uploadFiles(UploadNominationFileRequest $request, int $nominationId)
    {
        $nomination = $request->user()->nominations()->whereKey($nominationId)->first();

        if (! $nomination) {
            return $this->errorResponse('Nomination not found', 404);
        }

        $file = $this->nominationService->uploadFile($nomination, $request->file('file'), $request->string('file_type')->toString());

        return $this->successResponse($file, 'File uploaded', status: 201);
    }

    public function submit(SubmitNominationRequest $request, int $nominationId)
    {
        $nomination = $request->user()->nominations()->whereKey($nominationId)->first();

        if (! $nomination) {
            return $this->errorResponse('Nomination not found', 404);
        }

        $updated = $this->nominationService->submit($nomination);

        return $this->successResponse($updated, 'Nomination submitted successfully');
    }

    public function status(Request $request, int $nominationId)
    {
        $nomination = $request->user()->nominations()->whereKey($nominationId)->first();

        if (! $nomination) {
            return $this->errorResponse('Nomination not found', 404);
        }

        return $this->successResponse([
            'reference' => $nomination->reference,
            'status' => $nomination->status,
            'submitted_at' => $nomination->submitted_at,
            'reviewed_at' => $nomination->reviewed_at,
            'review_notes' => $nomination->review_notes,
        ], 'Nomination status');
    }
}
