<?php

namespace Tests\Feature\Admin;

use App\Models\Character;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminQuestTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
        Quest::truncate();
        QuestBid::truncate();
    }

    private function createAdmin(): User
    {
        return User::create([
            'name' => 'Admin Test',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    private function createStudent(string $name): User
    {
        $character = Character::first() ?? Character::create([
            'name' => 'Default Character',
            'avatar' => 'warrior.png',
            'character_type' => ['attack'],
        ]);

        return User::create([
            'name' => $name,
            'email' => 'student_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'character_id' => (string) $character->_id,
        ]);
    }

    public function test_guests_are_redirected_to_the_login_page_from_admin_quests(): void
    {
        $response = $this->get('/admin/quests');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_admin_can_visit_admin_quests_index(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $response = $this->get('/admin/quests');
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Quests/Index')
            ->has('quests')
        );
    }

    public function test_admin_can_create_a_quest(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $response = $this->post('/admin/quests', [
            'title' => 'Admin Freelance Quest',
            'description' => 'Need a database setup.',
            'min_salary' => 2000000,
            'max_salary' => 4000000,
            'deadline' => now()->addDays(10)->toDateString(),
        ]);

        $quest = Quest::where('title', 'Admin Freelance Quest')->first();
        $this->assertNotNull($quest);
        $response->assertRedirect(route('admin.quests.index'));

        $this->assertEquals($admin->_id, $quest->creator_id);
    }

    public function test_admin_can_update_a_quest(): void
    {
        $admin = $this->createAdmin();
        $quest = Quest::create([
            'title' => 'Initial Title',
            'description' => 'Initial Description',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'deadline' => now()->addDays(5),
            'status' => 'open',
            'creator_id' => $admin->_id,
        ]);

        $this->actingAs($admin);

        $response = $this->put("/admin/quests/{$quest->_id}", [
            'title' => 'Updated Title',
            'description' => 'Updated Description',
            'min_salary' => 1200000,
            'max_salary' => 2200000,
            'deadline' => now()->addDays(6)->toDateString(),
        ]);

        $response->assertRedirect(route('admin.quests.index'));

        $quest->refresh();
        $this->assertEquals('Updated Title', $quest->title);
        $this->assertEquals(1200000, $quest->min_salary);
    }

    public function test_admin_can_delete_a_quest_and_its_bids(): void
    {
        $admin = $this->createAdmin();
        $quest = Quest::create([
            'title' => 'Title to Delete',
            'description' => 'Desc',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'deadline' => now()->addDays(5),
            'status' => 'open',
            'creator_id' => $admin->_id,
        ]);

        $student = $this->createStudent('Student Bidder');
        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $student->_id,
            'bid_amount' => 1500000,
            'cv' => 'CV content',
            'portfolio' => 'Portf',
            'proposal' => 'Prop',
            'status' => 'pending',
        ]);

        $this->actingAs($admin);

        $response = $this->delete("/admin/quests/{$quest->_id}");
        $response->assertRedirect(route('admin.quests.index'));

        $this->assertNull(Quest::find($quest->_id));
        $this->assertNull(QuestBid::find($bid->_id));
    }

    public function test_admin_can_delete_a_bid(): void
    {
        $admin = $this->createAdmin();
        $quest = Quest::create([
            'title' => 'Title',
            'description' => 'Desc',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'deadline' => now()->addDays(5),
            'status' => 'open',
            'creator_id' => $admin->_id,
        ]);

        $student = $this->createStudent('Student Bidder');
        $bid = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $student->_id,
            'bid_amount' => 1500000,
            'cv' => 'CV content',
            'portfolio' => 'Portf',
            'proposal' => 'Prop',
            'status' => 'pending',
        ]);

        $this->actingAs($admin);

        $response = $this->delete("/admin/quests/{$quest->_id}/bids/{$bid->_id}");
        $response->assertRedirect(); // should redirect back

        $this->assertNull(QuestBid::find($bid->_id));
    }
}
