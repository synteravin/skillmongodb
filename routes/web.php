<?php

use App\Http\Controllers\Student\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Mentor\DashboardController as MentorDashboard;
use App\Http\Controllers\Student\DashboardController as StudentDashboard;
use App\Http\Controllers\Student\SelectCharacterController;
use App\Http\Controllers\Admin\CharacterController;
use App\Http\Controllers\Auth\SocialController;
use App\Http\Controllers\Admin\CourseBuilderController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Student\StudentCourseController;

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        /* ---------------- DASHBOARD ---------------- */

        Route::get('/dashboard', [AdminDashboard::class, 'index'])
            ->name('dashboard');


        /* ---------------- CHARACTERS ---------------- */

        Route::resource('characters', CharacterController::class)
            ->except(['show']);

        /* ---------------- COURSE CRUD ---------------- */

        Route::get('/courses', [CourseController::class, 'index'])
            ->name('courses.index');

        Route::get('/courses/create', [CourseController::class, 'create'])
            ->name('courses.create');

        Route::post('/courses', [CourseController::class, 'store'])
            ->name('courses.store');

        Route::get('/courses/{course}/edit', [CourseController::class, 'edit'])
            ->name('courses.edit');

        Route::put('/courses/{course}', [CourseController::class, 'update'])
            ->name('courses.update');

        Route::delete('/courses/{course}', [CourseController::class, 'destroy'])
            ->name('courses.destroy');


        /* ---------------- COURSE BUILDER ---------------- */

        Route::get('/courses/{course}', [CourseBuilderController::class, 'show'])
            ->name('courses.builder');


        /* ---------------- BUILDER API ---------------- */

        Route::post('/career-groups', [CourseBuilderController::class, 'storeCareerGroup'])
            ->name('career-groups.store');

        Route::post('/paths', [CourseBuilderController::class, 'storePath'])
            ->name('paths.store');

        Route::post('/modules', [CourseBuilderController::class, 'storeModule'])
            ->name('modules.store');

        Route::post('/module-content', [CourseBuilderController::class, 'storeContent'])
            ->name('module-content.store');

        Route::post('/quiz', [CourseBuilderController::class, 'storeQuiz'])
            ->name('quiz.store');

        Route::post('/quiz-question', [CourseBuilderController::class, 'storeQuestion'])
            ->name('quiz-question.store');

        Route::post('/quiz-answer', [CourseBuilderController::class, 'storeAnswer'])
            ->name('quiz-answer.store');

    });
/*
|--------------------------------------------------------------------------
| MENTOR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:mentor'])
    ->prefix('mentor')
    ->name('mentor.')
    ->group(function () {

        Route::get('/dashboard', [MentorDashboard::class, 'index'])
            ->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| STUDENT (HARUS PUNYA CHARACTER)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:student', 'has.character'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {

        Route::get('/dashboard', [StudentDashboard::class, 'index'])
            ->name('dashboard');

        Route::get('/course', [StudentCourseController::class, 'index'])
            ->name('course');
    });

/*
|--------------------------------------------------------------------------
| SELECT CHARACTER (NO has.character middleware)
|--------------------------------------------------------------------------
*/

Route::controller(SelectCharacterController::class)->group(function () {
    Route::get('/select-character', 'index')->name('character.select');
    Route::post('/select-character', 'store')->name('character.store');
});

Route::middleware('has.character')->group(function () {
    Route::get('/dashboard', [StudentDashboard::class, 'index'])
        ->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| SOCIAL LOGIN
|--------------------------------------------------------------------------
*/

Route::get('/auth/google', [SocialController::class, 'redirect']);
Route::get('/auth/google/callback', [SocialController::class, 'callback']);

require __DIR__ . '/settings.php';
