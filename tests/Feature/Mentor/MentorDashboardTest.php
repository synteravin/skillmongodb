<?php

namespace Tests\Feature\Mentor;

use App\Models\CareerGroup;
use App\Models\MentorCareerGroup;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MentorDashboardTest extends TestCase
{
    protected $mentor;

    protected $careerGroup;

    protected $mentorCareerGroup;

    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
    }

    protected function tearDown(): void
    {
        if ($this->mentor) {
            $this->mentor->delete();
        }
        if ($this->careerGroup) {
            $this->careerGroup->delete();
        }
        if ($this->mentorCareerGroup) {
            $this->mentorCareerGroup->delete();
        }
        parent::tearDown();
    }

    public function test_mentor_dashboard_requires_authentication(): void
    {
        $response = $this->get('/mentor/dashboard');
        $response->assertRedirect(route('login'));
    }

    public function test_mentor_can_visit_the_dashboard_and_see_statistics(): void
    {
        // 1. Create a mentor user
        $this->mentor = User::create([
            'name' => 'Test Mentor',
            'email' => 'mentor_test_'.uniqid().'@example.com',
            'password' => bcrypt('password'),
            'role' => 'mentor',
        ]);

        // 2. Create a career group
        $this->careerGroup = CareerGroup::create([
            'name' => 'Frontend Engineering',
            'description' => 'Learn Frontend Development',
        ]);

        // 3. Assign mentor to career group
        $this->mentorCareerGroup = MentorCareerGroup::create([
            'mentor_id' => (string) $this->mentor->_id,
            'career_group_id' => (string) $this->careerGroup->_id,
        ]);

        $this->actingAs($this->mentor);

        $response = $this->get('/mentor/dashboard');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Mentor/Dashboard')
            ->has('mentor')
            ->has('notifications')
        );
    }
}
