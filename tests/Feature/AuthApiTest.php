<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_login(): void
    {
        $register = $this->postJson('/api/v1/auth/register', [
            'name' => 'API Tester',
            'email' => 'tester@example.test',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $register->assertStatus(201)->assertJsonPath('success', true);

        $login = $this->postJson('/api/v1/auth/login', [
            'email' => 'tester@example.test',
            'password' => 'password',
        ]);

        $login->assertOk()->assertJsonPath('success', true);
    }
}
