<?php

namespace Tests\Feature;

use App\Models\User;
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
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertOk();
    }

    public function test_admin_can_visit_the_admin_users_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/users');
        $response->assertOk();
    }

    public function test_admin_can_visit_the_admin_courses_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/courses');
        $response->assertOk();
    }

    public function test_admin_can_visit_the_admin_assets_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin/assets');
        $response->assertOk();
    }
}
