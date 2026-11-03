<?php

use Illuminate\Support\Facades\Hash;

test('password update page is displayed', function () {
    $user = createUser();

    $response = $this
        ->actingAs($user)
        ->get(route('user-password.edit'));

    $response->assertOk();
});

test('password can be updated', function () {
    $user = createUser();

    $response = $this
        ->actingAs($user)
        ->from(route('user-password.edit'))
        ->put(route('user-password.update'), [
            'current_password' => 'password',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('user-password.edit'));

    expect(Hash::check('NewPassword123!', $user->refresh()->password))->toBeTrue();
});

test('correct password must be provided to update password', function () {
    $user = createUser();

    $response = $this
        ->actingAs($user)
        ->from(route('user-password.edit'))
        ->put(route('user-password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

    $response
        ->assertSessionHasErrors('current_password')
        ->assertRedirect(route('user-password.edit'));
});

test('admin or mentor users are redirected to profile edit page', function () {
    $admin = createUser(['role' => 'admin']);
    $mentor = createUser(['role' => 'mentor']);

    $this->actingAs($admin)
        ->get(route('user-password.edit'))
        ->assertRedirect(route('profile.edit'));

    $this->actingAs($mentor)
        ->get(route('user-password.edit'))
        ->assertRedirect(route('profile.edit'));
});
