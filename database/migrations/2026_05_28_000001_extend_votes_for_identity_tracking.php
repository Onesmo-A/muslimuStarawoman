<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            $table->string('fingerprint_hash')->nullable()->after('device_fingerprint')->index();
            $table->string('identity_strategy')->default('fingerprint')->after('captcha_token')->index();
            $table->string('verification_token')->nullable()->after('identity_strategy')->index();
            $table->string('external_token')->nullable()->after('verification_token')->index();
            $table->string('source')->default('web')->after('external_token')->index();
            $table->string('block_reason')->nullable()->after('status')->index();
            $table->json('identity_signals')->nullable()->after('block_reason');
            $table->json('request_context')->nullable()->after('identity_signals');
        });
    }

    public function down(): void
    {
        Schema::table('votes', function (Blueprint $table) {
            $table->dropIndex(['fingerprint_hash']);
            $table->dropIndex(['identity_strategy']);
            $table->dropIndex(['verification_token']);
            $table->dropIndex(['external_token']);
            $table->dropIndex(['source']);
            $table->dropIndex(['block_reason']);
            $table->dropColumn([
                'fingerprint_hash',
                'identity_strategy',
                'verification_token',
                'external_token',
                'source',
                'block_reason',
                'identity_signals',
                'request_context',
            ]);
        });
    }
};
