<?php

namespace App\Jobs;

use App\Services\SmsCampaignService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendSmsCampaignJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public int $campaignId,
        public array $recipients
    ) {
    }

    public function handle(SmsCampaignService $smsCampaignService): void
    {
        $smsCampaignService->send($this->campaignId, $this->recipients);
    }
}
