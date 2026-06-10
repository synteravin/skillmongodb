<?php

use App\Models\Character;
use App\Models\Course;
use App\Models\Module;
use App\Models\Path;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use App\Models\User;
use App\Models\UserStat;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('student can view quiz play page if completed all modules', function () {
    // 0. Create character
    $character = Character::create([
        'name' => 'Warrior',
        'avatar' => 'warrior.png',
        'character_type' => ['attack'],
        'abilities' => [],
        'guide_power' => [],
        'personality' => [],
        'system_bonus' => [],
        'cosmetic_bonus' => [],
    ]);

    // 1. Create a student user
    $user = User::create([
        'name' => 'Student Test',
        'email' => 'student@test.com',
        'password' => bcrypt('password'),
        'role' => 'student',
        'character_id' => (string) $character->_id,
    ]);

    // 2. Create Course
    $course = Course::create([
        'title' => 'Test Course',
        'slug' => 'test-course',
        'description' => 'Test Description',
    ]);

    // 3. Create Path
    $path = Path::create([
        'course_id' => (string) $course->_id,
        'name' => 'Test Path',
    ]);

    // 4. Create Module
    $module = Module::create([
        'path_id' => (string) $path->_id,
        'title' => 'Test Module',
        'type' => 'video',
        'slug' => 'test-module',
        'order' => 1,
    ]);

    // 5. Create Quiz
    $quiz = Quiz::create([
        'path_id' => (string) $path->_id,
        'difficulty' => 'easy',
    ]);

    // 6. Create Quiz Question and Answer
    $question = QuizQuestion::create([
        'quiz_id' => (string) $quiz->_id,
        'question_text' => 'What is Laravel?',
        'order' => 1,
    ]);

    $answer = QuizAnswer::create([
        'question_id' => (string) $question->_id,
        'answer_text' => 'A PHP Framework',
        'is_correct' => true,
    ]);

    // 7. Create UserStat (complete the module)
    UserStat::create([
        'user_id' => (string) $user->_id,
        'course_id' => (string) $course->_id,
        'completed_modules' => [(string) $module->_id],
    ]);

    // Acting as student
    $this->actingAs($user);

    // Call route
    $response = $this->get(route('student.quiz.show', $quiz));

    // Assert render is ok
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('Student/Quiz/Play')
        ->has('quiz')
    );
});
