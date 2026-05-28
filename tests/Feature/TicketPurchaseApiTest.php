<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketPurchaseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_purchase_ticket(): void
    {
        $user = User::factory()->create();

        $event = Event::query()->create([
            'event_name' => 'Gala Event',
            'event_date' => '2026-11-30',
            'venue_name' => 'Hall A',
            'venue_address' => 'Street 1',
            'city' => 'Dar es Salaam',
            'country' => 'Tanzania',
            'status' => 'published',
        ]);

        $ticket = Ticket::query()->create([
            'event_id' => $event->id,
            'ticket_type' => 'VIP',
            'name' => 'VIP Pass',
            'price' => 100,
            'currency' => 'USD',
            'quantity' => 100,
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $purchase = $this->postJson('/api/v1/tickets/purchase', [
            'ticket_id' => $ticket->id,
            'quantity' => 2,
            'purchaser_name' => 'Buyer',
            'purchaser_email' => 'buyer@example.test',
        ]);

        $purchase->assertStatus(201)->assertJsonPath('success', true);
    }
}
