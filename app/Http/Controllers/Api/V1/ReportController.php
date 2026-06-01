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

        if ($format === 'pdf') {
            $pdf = $this->makePdf($type, $rows);

            return response($pdf, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => "attachment; filename=report-{$type}.pdf",
            ]);
        }

        if ($format === 'excel') {
            return $this->successResponse([
                'format' => $format,
                'rows' => $rows,
            ], 'EXCEL export payload generated');
        }

        return $this->errorResponse('Unsupported report format', 422);
    }

    private function makePdf(string $type, array $rows): string
    {
        $title = strtoupper(str_replace(['_', '-'], ' ', $type)).' REPORT';
        $isGrouped = in_array($type, ['nominations', 'results', 'winners'], true);
        $columns = $isGrouped ? $this->groupedReportColumns($type) : $this->reportColumns($type, $rows);
        $tableRows = $isGrouped
            ? $this->groupedPdfRows($type, $rows)
            : array_map(fn ($row) => $this->normalizePdfRow($row, $columns), $rows);
        $pages = array_chunk($tableRows, $isGrouped ? 24 : 20);

        if ($pages === []) {
            $pages = [[]];
        }

        $objects = [
            1 => '<< /Type /Catalog /Pages 2 0 R >>',
        ];
        $pageObjectIds = [];
        $nextObjectId = 3;
        $fontObjectId = 0;

        foreach ($pages as $pageIndex => $pageRows) {
            $contentText = $this->pdfTablePage($title, $columns, $pageRows, $pageIndex + 1, count($pages));

            $contentObjectId = $nextObjectId++;
            $pageObjectId = $nextObjectId++;
            $pageObjectIds[] = $pageObjectId;
            $length = strlen($contentText);
            $objects[$contentObjectId] = "<< /Length {$length} >>\nstream\n{$contentText}endstream";
            $objects[$pageObjectId] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 792 612] /Contents {$contentObjectId} 0 R /Resources << /Font << /F1 {FONT_OBJECT_ID} 0 R >> >> >>";
        }

        $fontObjectId = $nextObjectId++;
        $kids = implode(' ', array_map(fn ($id) => "{$id} 0 R", $pageObjectIds));
        $objects[2] = "<< /Type /Pages /Kids [{$kids}] /Count ".count($pageObjectIds).' >>';
        $objects[$fontObjectId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
        ksort($objects);

        foreach ($objects as $number => $object) {
            $objects[$number] = str_replace('{FONT_OBJECT_ID}', (string) $fontObjectId, $object);
        }

        $pdf = "%PDF-1.4\n";
        $xref = [];
        $offset = strlen($pdf);

        foreach ($objects as $number => $object) {
            $xref[$number] = $offset;
            $pdf .= "{$number} 0 obj\n{$object}\nendobj\n";
            $offset = strlen($pdf);
        }

        $xrefStart = $offset;
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n0000000000 65535 f \n";
        foreach ($xref as $entry) {
            $pdf .= str_pad((string) $entry, 10, '0', STR_PAD_LEFT) . " 00000 n \n";
        }

        $pdf .= "trailer\n<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n{$xrefStart}\n%%EOF";

        return $pdf;
    }

    private function reportColumns(string $type, array $rows): array
    {
        return match ($type) {
            'nominations' => [
                'category' => ['Category', 145],
                'category_total' => ['Apps', 38],
                'reference' => ['Reference', 84],
                'applicant_name' => ['Applicant', 96],
                'nominee_name' => ['Nominee', 95],
                'phone' => ['Phone', 76],
                'status' => ['Status', 76],
                'submitted_at' => ['Submitted', 94],
            ],
            'nominees' => [
                'nominee_name' => ['Nominee', 100],
                'business_name' => ['Brand', 110],
                'category' => ['Category', 140],
                'email' => ['Email', 125],
                'phone' => ['Phone', 82],
                'valid_votes' => ['Votes', 45],
                'status' => ['Status', 62],
            ],
            'results', 'winners' => [
                'category' => ['Category', 205],
                'category_nominees' => ['Nominees', 58],
                'nominee_name' => ['Nominee', 150],
                'business_name' => ['Brand', 190],
                'valid_votes' => ['Valid Votes', 80],
            ],
            default => array_map(fn ($key) => [$this->headline($key), 100], array_slice(array_keys($rows[0] ?? ['data' => null]), 0, 7)),
        };
    }

    private function groupedReportColumns(string $type): array
    {
        return match ($type) {
            'nominations' => [
                'reference' => ['Reference', 98],
                'applicant_name' => ['Applicant', 128],
                'nominee_name' => ['Nominee', 132],
                'phone' => ['Phone', 96],
                'status' => ['Status', 92],
                'submitted_at' => ['Submitted', 126],
            ],
            'results', 'winners' => [
                'rank' => ['#', 34],
                'nominee_name' => ['Nominee', 188],
                'business_name' => ['Brand', 240],
                'valid_votes' => ['Votes', 86],
            ],
            default => [],
        };
    }

    private function groupedPdfRows(string $type, array $rows): array
    {
        $grouped = collect($rows)->groupBy('category');
        $output = [];

        foreach ($grouped as $category => $categoryRows) {
            $output[] = [
                '_row_type' => 'category',
                '_label' => (string) $category,
                '_count' => $type === 'nominations'
                    ? (int) ($categoryRows->first()['category_total'] ?? $categoryRows->count())
                    : (int) ($categoryRows->first()['category_nominees'] ?? $categoryRows->count()),
            ];

            if ($type === 'nominations') {
                if ((int) ($categoryRows->first()['category_total'] ?? 0) === 0) {
                    $output[] = ['_row_type' => 'empty', '_label' => 'No Application'];
                    continue;
                }

                foreach ($categoryRows as $row) {
                    $output[] = $this->normalizePdfRow($row, $this->groupedReportColumns($type));
                }

                continue;
            }

            $nomineeRows = $categoryRows
                ->filter(fn ($row) => ($row['nominee_name'] ?? '') !== 'NO NOMINEES')
                ->sortByDesc(fn ($row) => (int) ($row['valid_votes'] ?? 0))
                ->values();

            if ($nomineeRows->isEmpty()) {
                $output[] = ['_row_type' => 'empty', '_label' => 'No Nominees'];
                continue;
            }

            foreach ($nomineeRows as $index => $row) {
                $row['rank'] = $index + 1;
                $output[] = $this->normalizePdfRow($row, $this->groupedReportColumns($type));
            }
        }

        return $output;
    }

    private function normalizePdfRow(mixed $row, array $columns): array
    {
        if (! is_array($row)) {
            return ['data' => (string) $row];
        }

        return collect($columns)
            ->mapWithKeys(fn ($meta, $key) => [$key => $row[$key] ?? ''])
            ->toArray();
    }

    private function pdfTablePage(string $title, array $columns, array $rows, int $page, int $totalPages): string
    {
        $content = "0.04 0.05 0.07 rg 0 0 792 612 re f\n";
        $content .= "0.83 0.69 0.22 rg 34 552 724 34 re f\n";
        $content .= $this->pdfText($title, 42, 565, 15, '1 1 1');
        $content .= $this->pdfText('Generated '.now()->format('Y-m-d H:i').'  |  Page '.$page.' of '.$totalPages, 575, 565, 8, '0.04 0.05 0.07');

        $x = 34;
        $y = 516;
        $rowHeight = 22;

        $content .= "0.12 0.14 0.18 rg {$x} {$y} 724 {$rowHeight} re f\n";
        $cursor = $x + 6;
        foreach ($columns as $meta) {
            [$label, $width] = $meta;
            $content .= $this->pdfText($this->truncate($label, $width), $cursor, $y + 7, 8, '0.95 0.90 0.72');
            $cursor += $width;
        }

        $y -= $rowHeight;
        foreach ($rows as $rowIndex => $row) {
            if (($row['_row_type'] ?? null) === 'category') {
                $content .= "0.83 0.69 0.22 rg {$x} {$y} 724 {$rowHeight} re f\n";
                $countLabel = $row['_count'] === 1 ? '1 record' : $row['_count'].' records';
                $content .= $this->pdfText($this->truncate($row['_label'], 560), $x + 8, $y + 7, 8.6, '0.04 0.05 0.07');
                $content .= $this->pdfText($countLabel, 676, $y + 7, 7.3, '0.04 0.05 0.07');
                $y -= $rowHeight;
                continue;
            }

            if (($row['_row_type'] ?? null) === 'empty') {
                $content .= "0.08 0.10 0.14 rg {$x} {$y} 724 {$rowHeight} re f\n";
                $content .= $this->pdfText($row['_label'], $x + 8, $y + 7, 8, '0.92 0.93 0.95');
                $y -= $rowHeight;
                continue;
            }

            $fill = $rowIndex % 2 === 0 ? '0.08 0.10 0.14' : '0.10 0.12 0.16';
            $content .= "{$fill} rg {$x} {$y} 724 {$rowHeight} re f\n";
            $content .= "0.22 0.20 0.14 RG {$x} {$y} 724 {$rowHeight} re S\n";
            $cursor = $x + 6;

            foreach ($columns as $key => $meta) {
                [, $width] = $meta;
                $content .= $this->pdfText($this->truncate((string) ($row[$key] ?? ''), $width), $cursor, $y + 7, 7.3, '0.92 0.93 0.95');
                $cursor += $width;
            }

            $y -= $rowHeight;
        }

        if ($rows === []) {
            $content .= $this->pdfText('No records available for this report.', 42, 472, 10, '0.92 0.93 0.95');
        }

        return $content;
    }

    private function pdfText(string $text, int|float $x, int|float $y, int|float $size, string $color): string
    {
        return "{$color} rg BT /F1 {$size} Tf {$x} {$y} Td (".$this->pdfSafeString($text).") Tj ET\n";
    }

    private function truncate(string $value, int $width): string
    {
        $limit = max(8, (int) floor($width / 5.2));
        $value = preg_replace('/\s+/', ' ', trim($value));

        return strlen($value) > $limit ? substr($value, 0, $limit - 3).'...' : $value;
    }

    private function headline(string $value): string
    {
        return ucwords(str_replace(['_', '-'], ' ', $value));
    }

    private function pdfSafeString(mixed $value): string
    {
        $string = is_scalar($value) ? (string) $value : json_encode($value, JSON_UNESCAPED_UNICODE);

        return str_replace(["\r", "\n", '\\', '(', ')'], [' ', ' ', '\\\\', '\\(', '\\)'], $string);
    }
}
