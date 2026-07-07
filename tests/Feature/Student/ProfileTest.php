<?php

namespace Tests\Feature\Student;

use App\Models\Character;
use App\Models\User;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
    }

    public function test_guests_are_redirected_to_the_login_page_from_profile(): void
    {
        $response = $this->get('/student/profile');
        $response->assertRedirect(route('login'));
    }

    private function createStudentWithCharacter(): User
    {
        $character = Character::first() ?? Character::create([
            'name' => 'Default Character',
            'avatar' => 'warrior.png',
            'character_type' => ['attack'],
        ]);

        return User::create([
            'name' => 'Profile Student Test',
            'email' => 'student_prof_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'character_id' => (string) $character->_id,
        ]);
    }

    public function test_student_can_visit_profile_page(): void
    {
        $user = $this->createStudentWithCharacter();

        $this->actingAs($user);

        $response = $this->get('/student/profile');
        $response->assertOk();
    }

    public function test_student_can_update_linkedin_in_profile(): void
    {
        $user = $this->createStudentWithCharacter();

        $this->actingAs($user);

        $linkedinUrl = 'https://linkedin.com/in/profile-student-test';

        $response = $this->post('/student/profile', [
            'name' => 'Updated Name',
            'username' => 'updated_username_'.uniqid(),
            'email' => $user->email,
            'linkedin' => $linkedinUrl,
        ]);

        $response->assertRedirect();

        $user->refresh();
        $this->assertEquals($linkedinUrl, $user->linkedin);
    }
}
