<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends BaseApiController
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());

        return $this->successResponse($result, 'Registration successful', status: 201);
    }

    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());

        return $this->successResponse($result, 'Login successful');
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return $this->successResponse(message: 'Logout successful');
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return $this->successResponse(
            $this->authService->userPayload($user),
            'Authenticated user'
        );
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $message = $this->authService->forgotPassword($request->string('email')->toString());

        return $this->successResponse(message: $message);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $message = $this->authService->resetPassword($request->validated());

        return $this->successResponse(message: $message);
    }
}
