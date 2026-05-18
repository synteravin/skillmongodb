<?php

namespace Tests\Feature;

use App\Models\CareerGroup;
use App\Models\Course;
use App\Models\CourseStudent;
use App\Models\User;
use App\Models\UserStat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MentorDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_mentor_can_view_their_detail_page(): void
    {
        // Create mentor and students
        $mentor = User::factory()->create(['role' => 'mentor']);
        $student1 = User::factory()->create(['role' => 'student']);
        $student2 = User::factory()->create(['role' => 'student']);

        // Create course and career group
        $course = Course::factory()->create(['mentor_id' => (string) $mentor->_id]);
        $careerGroup = CareerGroup::factory()->create([
            'course_id' => (string) $course->_id,
            'mentor_id' => (string) $mentor->_id,
        ]);

        // Enroll students
        CourseStudent::create([
            'course_id' => (string) $course->_id,
            'user_id' => (string) $student1->_id,
            'career_group_id' => (string) $careerGroup->_id,
            'status' => 'active',
        ]);

        CourseStudent::create([
            'course_id' => (string) $course->_id,
            'user_id' => (string) $student2->_id,
            'career_group_id' => (string) $careerGroup->_id,
            'status' => 'completed',
        ]);

        // Create user stats
        UserStat::create([
            'user_id' => (string) $student1->_id,
            'course_id' => (string) $course->_id,
            'exp' => 1000,
            'completed_modules' => ['mod1', 'mod2'],
        ]);

        UserStat::create([
            'user_id' => (string) $student2->_id,
            'course_id' => (string) $course->_id,
            'exp' => 500,
            'completed_modules' => ['mod1'],
        ]);

        // Act as mentor and view detail page
        $response = $this->actingAs($mentor)
            ->get(route('mentor.detail', $mentor));

        // Assert
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Mentor/Detail')
            ->has('mentor')
            ->has('statistics')
            ->has('careerGroups')
            ->has('students')
        );
    }

    public function test_student_cannot_view_mentor_detail(): void
    {
        $mentor = User::factory()->create(['role' => 'mentor']);
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)
            ->get(route('mentor.detail', $mentor));

        $response->assertStatus(403);
    }

    public function test_admin_can_view_any_mentor_detail(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $mentor = User::factory()->create(['role' => 'mentor']);

        // Create minimal setup
        $course = Course::factory()->create(['mentor_id' => (string) $mentor->_id]);
        CareerGroup::factory()->create([
            'course_id' => (string) $course->_id,
            'mentor_id' => (string) $mentor->_id,
        ]);

        $response = $this->actingAs($admin)
            ->get(route('mentor.detail', $mentor));

        $response->assertStatus(200);
    }
}
