<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\ReportService;
use Illuminate\Http\Request;

class ReportController extends BaseApiController
{
    public function __construct(private readonly ReportService $reportService)
    {
    }

    public function export(Request $request)
    {
        $type = (string) $request->query('type', 'nominations');
        $format = (string) $request->query('format', 'csv');

        $rows = $this->reportService->data($type);

        if ($format === 'csv') {
            $csv = $this->reportService->toCsv($rows);

            return response($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=report-{$type}.csv",
            ]);
        }

        if (in_array($format, ['excel', 'pdf'], true)) {
            return $this->successResponse([
                'format' => $format,
                'rows' => $rows,
            ], strtoupper($format).' export payload generated');
        }

        return $this->errorResponse('Unsupported report format', 422);
    }
}
