<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Sponsors\PurchaseSponsorPackageRequest;
use App\Services\SponsorService;

class SponsorController extends BaseApiController
{
    public function __construct(private readonly SponsorService $sponsorService)
    {
    }

    public function packages()
    {
        return $this->successResponse($this->sponsorService->packages(), 'Sponsor packages');
    }

    public function purchase(PurchaseSponsorPackageRequest $request)
    {
        $order = $this->sponsorService->purchase($request->user()?->id, $request->validated());

        if (! $order) {
            return $this->errorResponse('Sponsor package not found', 404);
        }

        return $this->successResponse($order, 'Sponsor package purchase initiated', status: 201);
    }
}
