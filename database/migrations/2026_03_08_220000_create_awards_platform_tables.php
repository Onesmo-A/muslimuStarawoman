<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('award_seasons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->year('year')->index();
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(false)->index();
            $table->enum('status', ['draft', 'open', 'closed', 'archived'])->default('draft')->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('award_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('award_season_id')->nullable()->constrained('award_seasons')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->json('eligibility_rules')->nullable();
            $table->boolean('voting_enabled')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(1);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['award_season_id', 'is_active']);
        });

        Schema::create('category_pricings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('award_category_id')->constrained('award_categories')->cascadeOnDelete();
            $table->enum('form_type', ['free', 'paid'])->default('free')->index();
            $table->decimal('application_fee', 12, 2)->default(0);
            $table->string('currency', 5)->default('USD');
            $table->decimal('early_bird_fee', 12, 2)->nullable();
            $table->dateTime('deadline')->nullable()->index();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['award_category_id']);
        });

        Schema::create('nominees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('award_category_id')->nullable()->constrained('award_categories')->nullOnDelete();
            $table->string('business_name');
            $table->string('contact_person');
            $table->string('email')->index();
            $table->string('phone', 50)->nullable()->index();
            $table->string('website')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->text('company_profile')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('video_url')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active')->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('nominations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('award_category_id')->constrained('award_categories')->cascadeOnDelete();
            $table->foreignId('nominee_id')->nullable()->constrained('nominees')->nullOnDelete();
            $table->string('reference')->unique();
            $table->json('form_payload')->nullable();
            $table->enum('status', ['draft', 'submitted', 'under_review', 'shortlisted', 'approved', 'rejected'])->default('draft')->index();
            $table->dateTime('submitted_at')->nullable()->index();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'status']);
        });

        Schema::create('nomination_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nomination_id')->constrained('nominations')->cascadeOnDelete();
            $table->string('file_type');
            $table->string('original_name');
            $table->string('file_path');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size_bytes');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('judges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('full_name');
            $table->string('email')->index();
            $table->string('phone', 50)->nullable();
            $table->string('title')->nullable();
            $table->string('organization')->nullable();
            $table->text('bio')->nullable();
            $table->string('photo_path')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('judge_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('judge_id')->constrained('judges')->cascadeOnDelete();
            $table->foreignId('award_category_id')->constrained('award_categories')->cascadeOnDelete();
            $table->decimal('weight', 8, 2)->default(1);
            $table->foreignId('assigned_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['judge_id', 'award_category_id']);
        });

        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('judge_assignment_id')->constrained('judge_assignments')->cascadeOnDelete();
            $table->foreignId('nomination_id')->constrained('nominations')->cascadeOnDelete();
            $table->json('criteria')->nullable();
            $table->decimal('score', 8, 2);
            $table->decimal('weight', 8, 2)->default(1);
            $table->text('notes')->nullable();
            $table->dateTime('scored_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['judge_assignment_id', 'nomination_id']);
        });

        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('award_category_id')->constrained('award_categories')->cascadeOnDelete();
            $table->foreignId('nominee_id')->constrained('nominees')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->ipAddress('ip_address')->nullable()->index();
            $table->string('device_fingerprint')->nullable()->index();
            $table->string('captcha_token')->nullable();
            $table->decimal('weight', 8, 2)->default(1);
            $table->enum('status', ['valid', 'blocked'])->default('valid')->index();
            $table->dateTime('voted_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['award_category_id', 'nominee_id']);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('payable_type');
            $table->unsignedBigInteger('payable_id');
            $table->enum('provider', ['flutterwave', 'paystack', 'stripe', 'mpesa', 'airtelmoney', 'tigopesa'])->index();
            $table->string('reference')->unique();
            $table->decimal('amount', 14, 2);
            $table->string('currency', 5)->default('USD');
            $table->enum('status', ['pending', 'paid', 'failed', 'refunded'])->default('pending')->index();
            $table->dateTime('paid_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['payable_type', 'payable_id']);
        });

        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->cascadeOnDelete();
            $table->string('provider_transaction_id')->nullable()->index();
            $table->enum('status', ['pending', 'paid', 'failed', 'refunded'])->default('pending')->index();
            $table->string('response_code')->nullable();
            $table->text('message')->nullable();
            $table->json('payload')->nullable();
            $table->dateTime('processed_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('award_season_id')->nullable()->constrained('award_seasons')->nullOnDelete();
            $table->string('event_name');
            $table->text('event_description')->nullable();
            $table->date('event_date')->index();
            $table->time('event_time')->nullable();
            $table->string('venue_name');
            $table->string('venue_address');
            $table->string('city');
            $table->string('country');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->unsignedInteger('event_capacity')->default(0);
            $table->unsignedInteger('tickets_sold')->default(0);
            $table->enum('status', ['draft', 'published', 'cancelled', 'completed'])->default('draft')->index();
            $table->string('banner_path')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('event_agendas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->enum('ticket_type', ['VIP', 'Standard', 'Corporate Table'])->index();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 14, 2);
            $table->string('currency', 5)->default('USD');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('sold')->default(0);
            $table->dateTime('sales_start_at')->nullable();
            $table->dateTime('sales_end_at')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ticket_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('payment_id')->nullable()->constrained('payments')->nullOnDelete();
            $table->string('ticket_code')->unique();
            $table->string('qr_code')->nullable();
            $table->string('purchaser_name');
            $table->string('purchaser_email')->index();
            $table->string('purchaser_phone', 50)->nullable();
            $table->unsignedInteger('quantity');
            $table->decimal('total_amount', 14, 2);
            $table->string('currency', 5)->default('USD');
            $table->enum('status', ['pending', 'paid', 'cancelled', 'refunded'])->default('pending')->index();
            $table->dateTime('issued_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ticket_scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_order_id')->constrained('ticket_orders')->cascadeOnDelete();
            $table->foreignId('scanned_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('scanned_at')->nullable()->index();
            $table->enum('status', ['valid', 'invalid', 'duplicate'])->default('valid')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->cascadeOnDelete();
            $table->enum('invitation_type', ['nominees', 'judges', 'sponsors', 'vip_guests', 'media'])->index();
            $table->enum('channel', ['email', 'sms', 'both'])->default('email');
            $table->string('recipient_name');
            $table->string('recipient_email')->nullable()->index();
            $table->string('recipient_phone', 50)->nullable()->index();
            $table->string('token')->unique();
            $table->string('qr_code')->nullable();
            $table->text('message')->nullable();
            $table->enum('status', ['draft', 'sent', 'accepted', 'declined'])->default('draft')->index();
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('invitation_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained('invitations')->cascadeOnDelete();
            $table->enum('response', ['accept', 'decline'])->index();
            $table->dateTime('responded_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sponsor_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price', 14, 2);
            $table->string('currency', 5)->default('USD');
            $table->json('benefits')->nullable();
            $table->string('logo_placement')->nullable();
            $table->boolean('stage_mentions')->default(false);
            $table->boolean('website_listing')->default(true);
            $table->string('booth_space')->nullable();
            $table->unsignedSmallInteger('complimentary_tickets')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sponsors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable()->index();
            $table->string('phone', 50)->nullable()->index();
            $table->string('website')->nullable();
            $table->string('logo_path')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sponsor_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sponsor_id')->constrained('sponsors')->cascadeOnDelete();
            $table->foreignId('sponsor_package_id')->constrained('sponsor_packages')->cascadeOnDelete();
            $table->foreignId('payment_id')->nullable()->constrained('payments')->nullOnDelete();
            $table->decimal('amount', 14, 2);
            $table->string('currency', 5)->default('USD');
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending')->index();
            $table->dateTime('signed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('winners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('award_season_id')->constrained('award_seasons')->cascadeOnDelete();
            $table->foreignId('award_category_id')->constrained('award_categories')->cascadeOnDelete();
            $table->foreignId('nomination_id')->nullable()->constrained('nominations')->nullOnDelete();
            $table->foreignId('nominee_id')->nullable()->constrained('nominees')->nullOnDelete();
            $table->enum('position', ['winner', 'runner_up'])->default('winner')->index();
            $table->boolean('hall_of_fame')->default(false)->index();
            $table->boolean('is_published')->default(false)->index();
            $table->dateTime('announced_at')->nullable();
            $table->string('certificate_path')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['award_season_id', 'award_category_id', 'position']);
        });

        Schema::create('sms_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('body');
            $table->string('provider')->nullable();
            $table->string('audience_type')->nullable();
            $table->enum('status', ['draft', 'queued', 'sent', 'failed'])->default('draft')->index();
            $table->dateTime('scheduled_at')->nullable();
            $table->dateTime('sent_at')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sms_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sms_campaign_id')->nullable()->constrained('sms_campaigns')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('recipient')->index();
            $table->string('provider')->nullable();
            $table->text('message');
            $table->enum('status', ['queued', 'sent', 'failed'])->default('queued')->index();
            $table->string('delivery_status')->nullable();
            $table->string('provider_message_id')->nullable()->index();
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('mailable')->nullable();
            $table->string('subject')->nullable();
            $table->string('recipient')->index();
            $table->enum('status', ['queued', 'sent', 'failed'])->default('queued')->index();
            $table->json('payload')->nullable();
            $table->dateTime('sent_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft')->index();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->dateTime('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('body');
            $table->string('featured_image')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft')->index();
            $table->dateTime('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
            $table->string('title')->nullable();
            $table->enum('type', ['image', 'video'])->default('image');
            $table->string('url');
            $table->string('thumbnail')->nullable();
            $table->text('caption')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(1);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->string('disk')->default('public');
            $table->string('collection')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('group')->default('general')->index();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->boolean('is_public')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event')->index();
            $table->string('description')->nullable();
            $table->string('subject_type')->nullable()->index();
            $table->unsignedBigInteger('subject_id')->nullable()->index();
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->json('properties')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('media_assets');
        Schema::dropIfExists('gallery_items');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('email_logs');
        Schema::dropIfExists('sms_logs');
        Schema::dropIfExists('sms_campaigns');
        Schema::dropIfExists('winners');
        Schema::dropIfExists('sponsor_orders');
        Schema::dropIfExists('sponsors');
        Schema::dropIfExists('sponsor_packages');
        Schema::dropIfExists('invitation_responses');
        Schema::dropIfExists('invitations');
        Schema::dropIfExists('ticket_scans');
        Schema::dropIfExists('ticket_orders');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('event_agendas');
        Schema::dropIfExists('events');
        Schema::dropIfExists('payment_transactions');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('votes');
        Schema::dropIfExists('scores');
        Schema::dropIfExists('judge_assignments');
        Schema::dropIfExists('judges');
        Schema::dropIfExists('nomination_files');
        Schema::dropIfExists('nominations');
        Schema::dropIfExists('nominees');
        Schema::dropIfExists('category_pricings');
        Schema::dropIfExists('award_categories');
        Schema::dropIfExists('award_seasons');
    }
};
