<?php

namespace App\Services;

use App\Repositories\SmsCampaignRepository;

class SmsCampaignService
{
    public function __construct(private readonly SmsCampaignRepository $repository)
    {
    }

    public function create(int $creatorId, array $payload)
    {
        return $this->repository->create([
            'created_by' => $creatorId,
            'title' => $payload['title'],
            'body' => $payload['body'],
            'provider' => $payload['provider'] ?? 'twilio',
            'audience_type' => $payload['audience_type'] ?? 'custom',
            'status' => 'draft',
            'scheduled_at' => $payload['scheduled_at'] ?? null,
            'meta' => $payload['meta'] ?? null,
        ]);
    }

    public function send(int $campaignId, array $recipients): ?array
    {
        $campaign = $this->repository->findById($campaignId);

        if (! $campaign) {
            return null;
        }

        $logs = [];

        foreach ($recipients as $recipient) {
            $logs[] = $this->repository->log([
                'sms_campaign_id' => $campaign->id,
                'recipient' => $recipient,
                'provider' => $campaign->provider,
                'message' => $campaign->body,
                'status' => 'sent',
                'delivery_status' => 'accepted',
                'sent_at' => now(),
            ]);
        }

        $campaign->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        return ['campaign' => $campaign, 'logs' => $logs];
    }
}
