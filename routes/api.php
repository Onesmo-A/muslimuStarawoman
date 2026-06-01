<?php

use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\NomineeController;
use App\Http\Controllers\Api\V1\Admin\NominationController as AdminNominationController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\InvitationController;
use App\Http\Controllers\Api\V1\NominationController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\Public\ContentController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\ScoreController;
use App\Http\Controllers\Api\V1\SmsCampaignController;
use App\Http\Controllers\Api\V1\SponsorController;
use App\Http\Controllers\Api\V1\TicketController;
use App\Http\Controllers\Api\V1\VotingController;
use App\Http\Controllers\Api\V1\WinnerController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('change-password', [AuthController::class, 'changePassword']);
            Route::post('logout', [AuthController::class, 'logout']);
        });
    });

    Route::prefix('public')->group(function () {
        Route::get('home', [ContentController::class, 'home']);
        Route::get('categories', [ContentController::class, 'categories']);
        Route::get('nominees', [ContentController::class, 'nominees']);
        Route::get('sponsors', [ContentController::class, 'sponsors']);
        Route::get('posts', [ContentController::class, 'posts']);
        Route::get('pages', [ContentController::class, 'pages']);
    });

    Route::get('events', [EventController::class, 'index']);
    Route::get('events/{id}', [EventController::class, 'show']);

    Route::get('sponsors/packages', [SponsorController::class, 'packages']);
    Route::post('invitations/rsvp', [InvitationController::class, 'rsvp']);

    Route::post('voting/cast', [VotingController::class, 'cast'])->middleware('throttle:vote-cast');
    Route::get('voting/eligibility', [VotingController::class, 'eligibility']);

    Route::get('winners', [WinnerController::class, 'bySeason']);

    Route::post('payments/webhook', [PaymentController::class, 'webhook']);

    Route::middleware(['auth:sanctum', 'audit'])->group(function () {
        Route::prefix('nominations')->group(function () {
            Route::get('/', [NominationController::class, 'index']);
            Route::post('/', [NominationController::class, 'store']);
            Route::post('{nominationId}/files', [NominationController::class, 'uploadFiles']);
            Route::post('{nominationId}/submit', [NominationController::class, 'submit']);
            Route::get('{nominationId}/status', [NominationController::class, 'status']);
        });

        Route::post('payments/initiate', [PaymentController::class, 'initiate']);
        Route::post('payments/verify', [PaymentController::class, 'verify']);

        Route::get('tickets/events', [TicketController::class, 'listEvents']);
        Route::post('tickets/purchase', [TicketController::class, 'purchase']);
        Route::post('tickets/validate', [TicketController::class, 'validateTicket']);

        Route::post('sponsors/purchase', [SponsorController::class, 'purchase']);

        Route::middleware('permission:manage_dashboard')->group(function () {
            Route::get('admin/dashboard', [DashboardController::class, 'index']);
        });

        Route::middleware('permission:manage_content')->group(function () {
            Route::post('admin/events', [EventController::class, 'store']);
            Route::put('admin/events/{id}', [EventController::class, 'update']);
        });

        Route::middleware('permission:manage_categories')->group(function () {
            Route::apiResource('admin/categories', CategoryController::class);
        });

        Route::middleware('permission:manage_nominees')->group(function () {
            Route::get('admin/nominees/export', [ReportController::class, 'export']);
            Route::apiResource('admin/nominees', NomineeController::class);
        });

        Route::middleware('permission:manage_nominations')->group(function () {
            Route::post('admin/invitations', [InvitationController::class, 'create']);
            Route::post('admin/invitations/send', [InvitationController::class, 'send']);
            Route::get('admin/nominations', [AdminNominationController::class, 'index']);
            Route::get('admin/nominations/{nomination}', [AdminNominationController::class, 'show']);
            Route::post('admin/nominations/{nomination}/review', [AdminNominationController::class, 'review']);
            Route::delete('admin/nominations/{nomination}', [AdminNominationController::class, 'destroy']);
        });

        Route::middleware('permission:manage_reports')->group(function () {
            Route::post('admin/winners/publish', [WinnerController::class, 'publish']);
            Route::get('admin/reports/export', [ReportController::class, 'export']);
        });

        Route::middleware('permission:manage_scores')->group(function () {
            Route::post('admin/scores', [ScoreController::class, 'store']);
            Route::get('admin/scores/aggregate', [ScoreController::class, 'aggregate']);
        });

        Route::middleware('permission:manage_sms')->group(function () {
            Route::post('admin/sms-campaigns', [SmsCampaignController::class, 'store']);
            Route::post('admin/sms-campaigns/send', [SmsCampaignController::class, 'send']);
        });
    });
});
