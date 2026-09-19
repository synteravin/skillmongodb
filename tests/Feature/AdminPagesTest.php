<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminPagesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
    }

    public function test_admin_can_visit_the_admin_dashboard(): void
    {
        $admin = $this->createUser(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->has('metrics')
            ->has('actionRequired')
            ->has('popularCourses')
            ->has('activityTrends')
            ->has('careerBranchDistribution')
            ->has('gamificationStats')
            ->has('topStudents')
            ->has('recentActivities')
            ->has('selectedPeriod')
        );
    }

    public function test_admin_can_visit_the_admin_users_page(): void
    {
        $admin = $this->createUser(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/users');
        $response->assertOk();
    }

    public function test_admin_can_visit_the_admin_courses_page(): void
    {
        $admin = $this->createUser(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/courses');
        $response->assertOk();
    }

    public function test_admin_can_visit_the_admin_assets_page(): void
    {
        $admin = $this->createUser(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/assets');
        $response->assertOk();
    }

    public function test_admin_can_visit_the_admin_submissions_page(): void
    {
        $admin = $this->createUser(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/submissions');
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Submissions/Index')
            ->has('submissions')
            ->has('filters')
            ->has('counts')
        );
    }
}
