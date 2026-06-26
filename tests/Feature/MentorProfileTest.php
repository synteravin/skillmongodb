<?php

namespace Tests\Feature;

use App\Models\Character;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MentorProfileTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that student can view a mentor's profile page.
     */
    public function test_student_can_view_mentor_profile(): void
    {
        $character = Character::create([
            'name' => 'Warrior',
            'avatar' => 'avatars/warrior.png',
            'backstory' => 'A brave warrior.',
        ]);

        $student = User::factory()->create([
            'name' => 'Student Tester',
            'username' => 'studenttester',
            'email' => 'student@skillmongo.com',
            'password' => bcrypt('password123'),
            'role' => 'student',
            'character_id' => (string) $character->_id,
        ]);

        $mentor = User::factory()->create([
            'name' => 'Mentor Tester',
            'username' => 'mentortester',
            'email' => 'mentor@skillmongo.com',
            'password' => bcrypt('password123'),
            'role' => 'mentor',
            'profession' => 'Expert Web Developer',
        ]);

        $response = $this->actingAs($student)
            ->get(route('student.mentors.show', $mentor->_id));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Student/MentorProfile')
            ->where('mentor.name', 'Mentor Tester')
            ->where('mentor.profession', 'Expert Web Developer')
        );
    }

    /**
     * Test that mentor can access self profile edit page.
     */
    public function test_mentor_can_access_edit_page(): void
    {
        $mentor = User::factory()->create([
            'name' => 'Mentor Self',
            'username' => 'mentorself',
            'email' => 'mentorself@skillmongo.com',
            'password' => bcrypt('password123'),
            'role' => 'mentor',
        ]);

        $response = $this->actingAs($mentor)
            ->get(route('mentor.profile.edit'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Mentor/Profile')
        );
    }

    /**
     * Test that mentor can self-update their profile details.
     */
    public function test_mentor_can_self_update_profile(): void
    {
        $mentor = User::factory()->create([
            'name' => 'Mentor Self Update',
            'username' => 'mentorselfupdate',
            'email' => 'mentorselfupdate@skillmongo.com',
            'password' => bcrypt('password123'),
            'role' => 'mentor',
        ]);

        $response = $this->actingAs($mentor)
            ->post(route('mentor.profile.update'), [
                'name' => 'Mentor Updated',
                'email' => 'mentorselfupdate@skillmongo.com',
                'profession' => 'Senior Tech Architect',
                'linkedin' => 'https://linkedin.com/in/mentorupdated',
                'description' => 'A very experienced engineer.',
                'user_experience' => '10+ Years',
                'work_experiences' => [
                    [
                        'jabatan' => 'Principal Lead',
                        'perusahaan' => 'Global Corp',
                        'tahun_mulai' => '2020',
                        'tahun_selesai' => 'Present',
                        'deskripsi' => 'Architecting cloud systems.',
                    ],
                ],
                'educations' => [
                    [
                        'gelar' => 'M.S.',
                        'prodi' => 'Software Systems',
                        'universitas' => 'Top Tech School',
                        'tahun_mulai' => '2016',
                        'tahun_selesai' => '2018',
                        'spesialisasi' => 'Distributed Systems',
                    ],
                ],
            ]);

        $response->assertRedirect();

        $mentor->refresh();
        $this->assertEquals('Mentor Updated', $mentor->name);
        $this->assertEquals('Senior Tech Architect', $mentor->profession);
        $this->assertEquals('10+ Years', $mentor->user_experience);
        $this->assertCount(1, $mentor->work_experiences);
        $this->assertEquals('Principal Lead', $mentor->work_experiences[0]['jabatan']);
    }

    /**
     * Test that admin can update any mentor's profile.
     */
    public function test_admin_can_update_mentor_profile(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin Boss',
            'username' => 'adminboss',
            'email' => 'adminboss@skillmongo.com',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        $mentor = User::factory()->create([
            'name' => 'Mentor Admin Update',
            'username' => 'mentoradminupdate',
            'email' => 'mentoradminupdate@skillmongo.com',
            'password' => bcrypt('password123'),
            'role' => 'mentor',
        ]);

        $response = $this->actingAs($admin)
            ->put(route('admin.users.update', $mentor->_id), [
                'name' => 'Mentor Managed By Admin',
                'email' => 'mentoradminupdate@skillmongo.com',
                'profession' => 'Staff Research Scientist',
                'linkedin' => 'https://linkedin.com/in/mentoradmin',
                'description' => 'Admin has set this bio.',
                'user_experience' => '15 Years',
                'work_experiences' => [],
                'educations' => [],
            ]);

        $response->assertRedirect();

        $mentor->refresh();
        $this->assertEquals('Mentor Managed By Admin', $mentor->name);
        $this->assertEquals('Staff Research Scientist', $mentor->profession);
        $this->assertEquals('15 Years', $mentor->user_experience);
    }

    /**
     * Test that student cannot update mentor profile.
     */
    public function test_student_cannot_update_mentor_profile(): void
    {
        $student = User::factory()->create([
            'name' => 'Student Attacker',
            'username' => 'studentattacker',
            'email' => 'studentattacker@skillmongo.com',
            'password' => bcrypt('password123'),
            'role' => 'student',
            'character_id' => 'dummy_char_id',
        ]);

        $response = $this->actingAs($student)
            ->post(route('mentor.profile.update'), [
                'name' => 'Hacked Name',
                'email' => 'studentattacker@skillmongo.com',
            ]);

        $response->assertStatus(403);
    }
}
