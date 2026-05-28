<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Payments\InitiatePaymentRequest;
use App\Http\Requests\Payments\VerifyPaymentRequest;
use App\Http\Requests\Payments\WebhookPaymentRequest;
use App\Services\PaymentService;

class PaymentController extends BaseApiController
{
    public function __construct(private readonly PaymentService $paymentService)
    {
    }

    public function initiate(InitiatePaymentRequest $request)
    {
        $payment = $this->paymentService->initiate($request->user()->id, $request->validated());

        return $this->successResponse($payment, 'Payment initiated', status: 201);
    }

    public function verify(VerifyPaymentRequest $request)
    {
        $payment = $this->paymentService->verify(
            $request->string('reference')->toString(),
            (string) $request->input('status', 'paid')
        );

        if (! $payment) {
            return $this->errorResponse('Payment not found', 404);
        }

        return $this->successResponse($payment, 'Payment verified');
    }

    public function webhook(WebhookPaymentRequest $request)
    {
        $payment = $this->paymentService->webhook($request->validated());

        if (! $payment) {
            return $this->errorResponse('Payment not found', 404);
        }

        return $this->successResponse($payment, 'Webhook processed');
    }
}
