<?php

namespace Tests\Feature\Student;

use App\Models\Character;
use App\Models\User;
use Tests\TestCase;

class CertificateTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
    }

    public function test_guests_are_redirected_to_the_login_page_from_certificates(): void
    {
        $response = $this->get(route('student.student.certificates'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_student_users_with_character_can_visit_the_certificates_page(): void
    {
        $character = Character::first() ?? Character::create([
            'name' => 'Default Character',
            'avatar' => 'warrior.png',
            'character_type' => ['attack'],
        ]);

        // Create student user with character
        $user = User::create([
            'name' => 'Student Test',
            'email' => 'student_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'character_id' => (string) $character->_id,
        ]);

        $this->actingAs($user);

        $response = $this->get(route('student.student.certificates'));
        $response->assertOk();
    }
}
