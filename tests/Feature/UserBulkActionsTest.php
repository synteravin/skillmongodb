<?php

use App\Models\User;

test('admin can bulk delete users', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user1 = User::factory()->create(['role' => 'student']);
    $user2 = User::factory()->create(['role' => 'student']);

    $response = $this
        ->actingAs($admin)
        ->post(route('admin.users.bulk-destroy'), [
            'ids' => [(string) $user1->_id, (string) $user2->_id],
        ]);

    $response->assertSessionHasNoErrors();
    expect(User::whereIn('_id', [$user1->_id, $user2->_id])->count())->toBe(0);
});

test('admin can bulk change user roles', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user1 = User::factory()->create(['role' => 'student']);
    $user2 = User::factory()->create(['role' => 'student']);

    $response = $this
        ->actingAs($admin)
        ->post(route('admin.users.bulk-role'), [
            'ids' => [(string) $user1->_id, (string) $user2->_id],
            'role' => 'mentor',
        ]);

    $response->assertSessionHasNoErrors();
    expect($user1->refresh()->role)->toBe('mentor');
    expect($user2->refresh()->role)->toBe('mentor');
});
