<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Services\DashboardService;

class DashboardController extends BaseApiController
{
    public function __construct(private readonly DashboardService $dashboardService)
    {
    }

    public function index()
    {
        return $this->successResponse($this->dashboardService->kpis(), 'Dashboard KPIs');
    }
}
