<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_initiate_and_verify_payment(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $init = $this->postJson('/api/v1/payments/initiate', [
            'payable_type' => 'App\\Models\\Nomination',
            'payable_id' => 1,
            'provider' => 'stripe',
            'amount' => 99.99,
            'currency' => 'USD',
        ]);

        $init->assertStatus(201)->assertJsonPath('success', true);

        $reference = $init->json('data.reference');

        $verify = $this->postJson('/api/v1/payments/verify', [
            'reference' => $reference,
            'status' => 'paid',
        ]);

        $verify->assertOk()->assertJsonPath('data.status', 'paid');
    }
}
