<?php

namespace App\Repositories;

use App\Models\SmsCampaign;
use App\Models\SmsLog;

class SmsCampaignRepository
{
    public function create(array $payload): SmsCampaign
    {
        return SmsCampaign::query()->create($payload);
    }

    public function findById(int $id): ?SmsCampaign
    {
        return SmsCampaign::query()->find($id);
    }

    public function log(array $payload): SmsLog
    {
        return SmsLog::query()->create($payload);
    }
}
