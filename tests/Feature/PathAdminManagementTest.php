<?php

use App\Models\CareerGroup;
use App\Models\Course;
use App\Models\MentorCareerGroup;
use App\Models\Path;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('admin can assign a mentor to a career group', function () {
    $admin = createUser([
        'role' => 'admin',
        'email' => 'admin-'.Str::random(5).'@test.com',
    ]);
    $mentor = createUser([
        'role' => 'mentor',
        'email' => 'mentor-'.Str::random(5).'@test.com',
    ]);

    $course = Course::create([
        'title' => 'Test Course',
        'slug' => 'test-course-'.Str::random(5),
        'is_active' => true,
    ]);

    $careerGroup = CareerGroup::create([
        'course_id' => (string) $course->_id,
        'name' => 'Test Career Group',
        'slug' => 'test-career-group-'.Str::random(5),
    ]);

    $response = $this->actingAs($admin)
        ->post(route('admin.career-groups.assign-mentor', $careerGroup->_id), [
            'mentor_id' => (string) $mentor->_id,
        ]);

    $response->assertRedirect();
    $careerGroup->refresh();
    expect($careerGroup->mentor_id)->toBe((string) $mentor->_id);

    // Assert pivot is created
    expect(MentorCareerGroup::where('career_group_id', (string) $careerGroup->_id)
        ->where('mentor_id', (string) $mentor->_id)
        ->exists())->toBeTrue();
});

test('admin can unassign a mentor from a career group', function () {
    $admin = createUser([
        'role' => 'admin',
        'email' => 'admin-'.Str::random(5).'@test.com',
    ]);
    $mentor = createUser([
        'role' => 'mentor',
        'email' => 'mentor-'.Str::random(5).'@test.com',
    ]);

    $course = Course::create([
        'title' => 'Test Course',
        'slug' => 'test-course-'.Str::random(5),
        'is_active' => true,
    ]);

    $careerGroup = CareerGroup::create([
        'course_id' => (string) $course->_id,
        'name' => 'Test Career Group',
        'slug' => 'test-career-group-'.Str::random(5),
        'mentor_id' => (string) $mentor->_id,
    ]);

    // Create a pivot to begin with
    MentorCareerGroup::create([
        'career_group_id' => (string) $careerGroup->_id,
        'mentor_id' => (string) $mentor->_id,
        'assigned_by' => (string) $admin->_id,
    ]);

    $response = $this->actingAs($admin)
        ->post(route('admin.career-groups.assign-mentor', $careerGroup->_id), [
            'mentor_id' => null,
        ]);

    $response->assertRedirect();
    $careerGroup->refresh();
    expect($careerGroup->mentor_id)->toBeNull();

    // Assert pivot is cleaned up
    expect(MentorCareerGroup::where('career_group_id', (string) $careerGroup->_id)
        ->where('mentor_id', (string) $mentor->_id)
        ->exists())->toBeFalse();
});

test('admin can reorder paths', function () {
    $admin = createUser([
        'role' => 'admin',
        'email' => 'admin-'.Str::random(5).'@test.com',
    ]);

    $path1 = Path::create([
        'phase' => 'basic_fundamental',
        'name' => 'Path 1',
        'slug' => 'path-1-'.Str::random(5),
        'order' => 1,
    ]);

    $path2 = Path::create([
        'phase' => 'basic_fundamental',
        'name' => 'Path 2',
        'slug' => 'path-2-'.Str::random(5),
        'order' => 2,
    ]);

    $response = $this->actingAs($admin)
        ->put(route('admin.paths.reorder'), [
            'paths' => [
                ['id' => (string) $path1->_id, 'order' => 2],
                ['id' => (string) $path2->_id, 'order' => 1],
            ],
        ]);

    $response->assertRedirect();
    $path1->refresh();
    $path2->refresh();

    expect($path1->order)->toBe(2);
    expect($path2->order)->toBe(1);
});
