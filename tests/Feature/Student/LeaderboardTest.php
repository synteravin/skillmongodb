<?php

namespace Tests\Feature\Student;

use App\Models\Character;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LeaderboardTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
    }

    public function test_guests_are_redirected_to_the_login_page_from_leaderboard(): void
    {
        $response = $this->get('/student/leaderboard');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_student_with_character_can_visit_leaderboard_page(): void
    {
        $character = Character::first() ?? Character::create([
            'name' => 'Default Character',
            'avatar' => 'warrior.png',
            'character_type' => ['attack'],
        ]);

        $user = User::create([
            'name' => 'Leaderboard Student Test',
            'email' => 'student_lb_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'character_id' => (string) $character->_id,
        ]);

        $this->actingAs($user);

        $response = $this->get('/student/leaderboard');
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/Leaderboard')
            ->has('leaderboard')
            ->has('currentUser')
        );
    }
}
