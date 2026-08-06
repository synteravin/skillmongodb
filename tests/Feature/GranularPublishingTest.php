<?php

use App\Models\CareerGroup;
use App\Models\Course;
use App\Models\CourseStudent;
use App\Models\Path;
use App\Services\Course\CourseService;
use App\Services\Course\RoadmapService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

test('enrolled student can access course even if course status is changed to draft', function () {
    $student = createUser([
        'role' => 'student',
        'email' => 'student-'.Str::random(5).'@test.com',
    ]);

    $course = Course::create([
        'title' => 'Sample Course',
        'slug' => 'sample-course-'.Str::random(5),
        'status' => 'draft',
        'is_active' => true,
    ]);

    CourseStudent::create([
        'user_id' => (string) $student->_id,
        'course_id' => (string) $course->_id,
        'status' => 'active',
    ]);

    $service = new CourseService;

    // Should not throw 403 for enrolled student
    $service->selectCourse($student, (string) $course->_id);
    expect(true)->toBeTrue();
});

test('roadmap service filters out unpublished draft paths for students', function () {
    $student = createUser([
        'role' => 'student',
        'email' => 'student-'.Str::random(5).'@test.com',
    ]);

    $course = Course::create([
        'title' => 'Roadmap Course',
        'slug' => 'roadmap-course-'.Str::random(5),
        'status' => 'published',
        'is_active' => true,
    ]);

    $publishedPath = Path::create([
        'course_id' => (string) $course->_id,
        'name' => 'Published Path',
        'phase' => 'basic_fundamental',
        'order' => 1,
        'is_published' => true,
        'is_active' => true,
    ]);

    $draftPath = Path::create([
        'course_id' => (string) $course->_id,
        'name' => 'Draft Path',
        'phase' => 'basic_fundamental',
        'order' => 2,
        'is_published' => false,
        'is_active' => true,
    ]);

    $roadmapService = new RoadmapService;
    $roadmap = $roadmapService->generate($student, $course);

    $basicPaths = $roadmap['basic_paths'];
    expect($basicPaths)->toHaveCount(1);
    expect($basicPaths->first()['_id'])->toBe((string) $publishedPath->_id);
});

test('getCoursesForUser includes enrolled courses even if course status is draft', function () {
    $student = createUser([
        'role' => 'student',
        'email' => 'student-'.Str::random(5).'@test.com',
    ]);

    $draftCourse = Course::create([
        'title' => 'Enrolled Draft Course',
        'slug' => 'enrolled-draft-course-'.Str::random(5),
        'status' => 'draft',
        'is_active' => true,
    ]);

    CourseStudent::create([
        'user_id' => (string) $student->_id,
        'course_id' => (string) $draftCourse->_id,
        'status' => 'active',
    ]);

    $service = new CourseService;
    $courses = $service->getCoursesForUser($student);

    expect($courses->pluck('_id')->toArray())->toContain((string) $draftCourse->_id);
});

test('roadmap service filters out draft career groups for students unless selected', function () {
    $student = createUser([
        'role' => 'student',
        'email' => 'student-'.Str::random(5).'@test.com',
    ]);

    $course = Course::create([
        'title' => 'Career Test Course',
        'slug' => 'career-test-course-'.Str::random(5),
        'status' => 'published',
        'is_active' => true,
    ]);

    $publishedGroup = CareerGroup::create([
        'course_id' => (string) $course->_id,
        'name' => 'Published Branch',
        'slug' => 'published-branch-'.Str::random(5),
        'status' => 'published',
    ]);

    $draftGroup = CareerGroup::create([
        'course_id' => (string) $course->_id,
        'name' => 'Draft Branch',
        'slug' => 'draft-branch-'.Str::random(5),
        'status' => 'draft',
    ]);

    $roadmapService = new RoadmapService;
    $roadmap = $roadmapService->generate($student, $course);

    $careerGroups = $roadmap['career_groups'];
    expect($careerGroups->pluck('_id')->toArray())->toContain((string) $publishedGroup->_id);
    expect($careerGroups->pluck('_id')->toArray())->not->toContain((string) $draftGroup->_id);
});

test('mentor can publish career branch status via updateStatus endpoint', function () {
    $mentor = createUser([
        'role' => 'mentor',
        'email' => 'mentor-'.Str::random(5).'@test.com',
    ]);

    $course = Course::create([
        'title' => 'Mentor Course',
        'slug' => 'mentor-course-'.Str::random(5),
        'status' => 'published',
        'is_active' => true,
    ]);

    $group = CareerGroup::create([
        'course_id' => (string) $course->_id,
        'mentor_id' => (string) $mentor->_id,
        'name' => 'Mentor Branch',
        'slug' => 'mentor-branch-'.Str::random(5),
        'status' => 'draft',
    ]);

    $response = $this->actingAs($mentor)
        ->post(route('mentor.career-groups.status', $group->slug), [
            'status' => 'published',
        ]);

    $response->assertSessionHasNoErrors();
    $group->refresh();
    expect($group->status)->toBe('published');
});
