<?php

namespace App\Http\Controllers\Api\V1;

use App\Jobs\SendSmsCampaignJob;
use App\Http\Requests\Sms\SendSmsCampaignRequest;
use App\Http\Requests\Sms\StoreSmsCampaignRequest;
use App\Services\SmsCampaignService;

class SmsCampaignController extends BaseApiController
{
    public function __construct(private readonly SmsCampaignService $smsCampaignService)
    {
    }

    public function store(StoreSmsCampaignRequest $request)
    {
        $campaign = $this->smsCampaignService->create($request->user()->id, $request->validated());

        return $this->successResponse($campaign, 'SMS campaign created', status: 201);
    }

    public function send(SendSmsCampaignRequest $request)
    {
        $campaignId = (int) $request->integer('campaign_id');
        $recipients = $request->input('recipients', []);

        SendSmsCampaignJob::dispatch($campaignId, $recipients);

        return $this->successResponse([
            'campaign_id' => $campaignId,
            'queued_recipients' => count($recipients),
        ], 'SMS campaign queued for delivery');
    }
}
