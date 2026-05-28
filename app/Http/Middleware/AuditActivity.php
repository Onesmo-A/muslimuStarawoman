<?php

namespace App\Http\Middleware;

use App\Models\AuditLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuditActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->user() || ! in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return $response;
        }

        AuditLog::query()->create([
            'user_id' => $request->user()->id,
            'event' => strtolower($request->method()).'_request',
            'description' => $request->path(),
            'subject_type' => null,
            'subject_id' => null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'properties' => [
                'status' => $response->getStatusCode(),
            ],
        ]);

        return $response;
    }
}
