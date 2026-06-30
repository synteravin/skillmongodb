<?php

use App\Models\Character;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $character = Character::first() ?? Character::create([
        'name' => 'Default Character',
        'avatar' => 'avatars/default.png',
        'backstory' => 'Default backstory.',
    ]);

    $user = User::factory()->create([
        'character_id' => (string) $character->_id,
    ]);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});
