<?php

namespace Tests\Feature\Student;

use App\Models\Character;
use App\Models\Quest;
use App\Models\QuestBid;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QuestTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
        Quest::truncate();
        QuestBid::truncate();
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

    private function createAdmin(): User
    {
        return User::create([
            'name' => 'Admin Test',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    public function test_guests_are_redirected_to_the_login_page_from_quests(): void
    {
        $response = $this->get('/student/quests');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_student_can_visit_quests_index(): void
    {
        $student = $this->createStudent('Student 1');
        $this->actingAs($student);

        $response = $this->get('/student/quests');
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Student/Quests/Index')
            ->has('quests')
            ->has('filters')
        );
    }

    public function test_student_can_create_a_quest(): void
    {
        $student = $this->createStudent('Student 1');
        $this->actingAs($student);

        $response = $this->post('/student/quests', [
            'title' => 'Test Freelance Job',
            'description' => 'Need a logo designer for our new app.',
            'min_salary' => 500000,
            'max_salary' => 1000000,
            'deadline' => now()->addDays(5)->toDateString(),
        ]);

        $quest = Quest::where('title', 'Test Freelance Job')->first();
        $this->assertNotNull($quest);
        $response->assertRedirect(route('student.quests.show', $quest->_id));

        $this->assertEquals('open', $quest->status);
        $this->assertEquals($student->_id, $quest->creator_id);
    }

    public function test_student_can_bid_on_a_quest(): void
    {
        $creator = $this->createStudent('Quest Creator');
        $quest = Quest::create([
            'title' => 'Need landing page',
            'description' => 'Create a landing page using React.',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'deadline' => now()->addDays(5),
            'status' => 'open',
            'creator_id' => $creator->_id,
        ]);

        $bidder = $this->createStudent('Bidder Student');
        $this->actingAs($bidder);

        $response = $this->post("/student/quests/{$quest->_id}/bid", [
            'bid_amount' => 1500000,
            'cv' => 'http://drive.google.com/cv.pdf',
            'portfolio' => 'http://github.com/my-portfolio',
            'proposal' => 'I have 3 years of experience in React.',
        ]);

        $response->assertRedirect(route('student.quests.show', $quest->_id));

        $bid = QuestBid::where('quest_id', $quest->_id)->where('student_id', $bidder->_id)->first();
        $this->assertNotNull($bid);
        $this->assertEquals(1500000, $bid->bid_amount);
        $this->assertEquals('pending', $bid->status);
    }

    public function test_creator_can_accept_a_bid(): void
    {
        $creator = $this->createStudent('Quest Creator');
        $quest = Quest::create([
            'title' => 'Need landing page',
            'description' => 'Create a landing page using React.',
            'min_salary' => 1000000,
            'max_salary' => 2000000,
            'deadline' => now()->addDays(5),
            'status' => 'open',
            'creator_id' => $creator->_id,
        ]);

        $bidder1 = $this->createStudent('Bidder 1');
        $bid1 = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $bidder1->_id,
            'bid_amount' => 1500000,
            'cv' => 'CV 1',
            'portfolio' => 'Portfolio 1',
            'proposal' => 'Proposal 1',
            'status' => 'pending',
        ]);

        $bidder2 = $this->createStudent('Bidder 2');
        $bid2 = QuestBid::create([
            'quest_id' => $quest->_id,
            'student_id' => $bidder2->_id,
            'bid_amount' => 1800000,
            'cv' => 'CV 2',
            'portfolio' => 'Portfolio 2',
            'proposal' => 'Proposal 2',
            'status' => 'pending',
        ]);

        $this->actingAs($creator);

        $response = $this->post("/student/quests/{$quest->_id}/accept-bid/{$bid1->_id}");
        $response->assertRedirect(route('student.quests.show', $quest->_id));

        $quest->refresh();
        $bid1->refresh();
        $bid2->refresh();

        $this->assertEquals('ongoing', $quest->status);
        $this->assertEquals($bidder1->_id, $quest->worker_id);
        $this->assertEquals('accepted', $bid1->status);
        $this->assertEquals('rejected', $bid2->status);
    }
}
