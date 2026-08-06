<?php

use App\Models\Course;
use App\Models\Path;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('published course allows storing new path via course builder controller in granular publishing pattern', function () {
    $admin = createUser([
        'role' => 'admin',
        'email' => 'admin-'.Str::random(5).'@test.com',
    ]);

    $course = Course::create([
        'title' => 'Published Course',
        'slug' => 'published-course-'.Str::random(5),
        'status' => 'published',
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)
        ->post(route('admin.paths.store'), [
            'course_id' => (string) $course->_id,
            'name' => 'New Path',
            'phase' => 'basic_fundamental',
        ]);

    $response->assertSessionHasNoErrors();
    expect(Path::where('course_id', (string) $course->_id)->where('name', 'New Path')->exists())->toBeTrue();
});

test('draft course allows storing new path via course builder controller', function () {
    $admin = createUser([
        'role' => 'admin',
        'email' => 'admin-'.Str::random(5).'@test.com',
    ]);

    $course = Course::create([
        'title' => 'Draft Course',
        'slug' => 'draft-course-'.Str::random(5),
        'status' => 'draft',
        'is_active' => true,
    ]);

    $response = $this->actingAs($admin)
        ->post(route('admin.paths.store'), [
            'course_id' => (string) $course->_id,
            'name' => 'New Path',
            'phase' => 'basic_fundamental',
        ]);

    $response->assertSessionHasNoErrors();
    expect(Path::where('course_id', (string) $course->_id)->where('name', 'New Path')->exists())->toBeTrue();
});

test('assigned mentor can toggle course status between published and draft', function () {
    $mentor = createUser([
        'role' => 'mentor',
        'email' => 'mentor-'.Str::random(5).'@test.com',
    ]);

    $course = Course::create([
        'title' => 'Mentor Course',
        'slug' => 'mentor-course-'.Str::random(5),
        'mentor_id' => (string) $mentor->_id,
        'status' => 'published',
        'is_active' => true,
    ]);

    $response = $this->actingAs($mentor)
        ->post(route('admin.courses.publish', $course->slug));

    $response->assertRedirect();
    $course->refresh();
    expect($course->status)->toBe('draft');
});
