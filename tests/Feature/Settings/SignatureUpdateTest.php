<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('signature page is displayed for mentors', function () {
    $user = createUser(['role' => 'mentor']);

    $response = $this
        ->actingAs($user)
        ->get(route('profile.signature.edit'));

    $response->assertOk();
});

test('signature can be updated with base64 string', function () {
    Storage::fake('s3');
    $user = createUser(['role' => 'mentor']);

    $base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    $response = $this
        ->actingAs($user)
        ->post(route('profile.signature.update'), [
            'signature' => $base64Image,
        ]);

    $response->assertSessionHasNoErrors();
    $user->refresh();

    expect($user->signature_path)->not->toBeNull();
    Storage::disk('s3')->assertExists($user->signature_path);
});

test('signature can be updated with file upload', function () {
    Storage::fake('s3');
    $user = createUser(['role' => 'mentor']);

    $file = UploadedFile::fake()->image('signature.png', 200, 100);

    $response = $this
        ->actingAs($user)
        ->post(route('profile.signature.update'), [
            'signature_file' => $file,
        ]);

    $response->assertSessionHasNoErrors();
    $user->refresh();

    expect($user->signature_path)->not->toBeNull();
    Storage::disk('s3')->assertExists($user->signature_path);
});

test('signature can be removed', function () {
    Storage::fake('s3');
    $user = createUser([
        'role' => 'mentor',
        'signature_path' => 'signatures/fake.png',
    ]);
    Storage::disk('s3')->put('signatures/fake.png', 'fake content');

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.signature.destroy'));

    $response->assertSessionHasNoErrors();
    $user->refresh();

    expect($user->signature_path)->toBeNull();
    Storage::disk('s3')->assertMissing('signatures/fake.png');
});
