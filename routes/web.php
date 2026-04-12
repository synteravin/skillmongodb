<?php

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
use App\Http\Controllers\Admin\LevelBadgeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CareerGroupController;
use App\Http\Controllers\Admin\ModuleManagementController;
use App\Http\Controllers\ModuleContentController;
use App\Http\Controllers\Student\CompleteModuleController;
use App\Http\Controllers\Student\SelectPathController;
use App\Http\Controllers\Student\CompletePathController;
use App\Http\Controllers\Student\CourseRoadmapController;
use App\Http\Controllers\Student\LearnController;
use App\Http\Controllers\Admin\QuizController;


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

        Route::post('/quiz-question', [CourseBuilderController::class, 'storeQuestion'])
            ->name('quiz-question.store');

        Route::post('/quiz-answer', [CourseBuilderController::class, 'storeAnswer'])
            ->name('quiz-answer.store');

        /* ---------------- LEVEL BADGES ---------------- */

        Route::resource('/levelbadge', LevelBadgeController::class);

        /* ---------------- USER ---------------- */

        Route::resource('users', UserController::class);
        // Route::post('/admin/users/{user}', [UserController::class, 'update']);
    
        /* ---------------- ASSIGN MENTOR ---------------- */
        Route::post('/career-groups/{group}/assign-mentor', [CareerGroupController::class, 'assignMentor']);

        /* ---------------- MODULE MANAGEMENT ---------------- */
        Route::get('/paths/{path}/modules', [ModuleManagementController::class, 'index'])
            ->name('paths.modules');

        Route::get('/modules/create', [ModuleManagementController::class, 'create']);
        Route::get('/modules/{module:slug}', [ModuleManagementController::class, 'show'])
            ->name('modules.show');
        Route::post('/modules/{module}/contents', [ModuleContentController::class, 'store'])
            ->name('module-contents.store');
        Route::delete('/module-contents/{content}', [ModuleContentController::class, 'destroy'])
            ->name('module-contents.destroy');
        Route::put('/module-contents/reorder', [ModuleContentController::class, 'reorder']);


        Route::put('/module-contents/{content}', [ModuleContentController::class, 'update'])
            ->name('module-contents.update');

        Route::post('/quiz', [QuizController::class, 'store'])->name('quiz.store');
        Route::get('/quiz/{quiz}', [QuizController::class, 'show'])->name('quiz.show');
        Route::put('/quiz/{quiz}', [QuizController::class, 'update'])->name('quiz.update');
        Route::delete('/quiz/{quiz}', [QuizController::class, 'destroy'])->name('quiz.destroy');
        Route::get('/modules/{module}/quiz/create', [QuizController::class, 'create'])
            ->name('quiz.create');

        Route::get('/quiz/{quiz}/edit', [QuizController::class, 'edit'])
            ->name('quiz.edit');
        Route::get('/quiz', [QuizController::class, 'index'])->name('quiz.index');

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

        Route::post('/modules/{module}/complete', CompleteModuleController::class)
            ->name('student.modules.complete');

        Route::post('/paths/{path}/select', SelectPathController::class)
            ->name('student.paths.select');

        Route::post('/paths/{path}/complete', CompletePathController::class)
            ->name('student.paths.complete');

        Route::get('/courses/{course}', CourseRoadmapController::class)
            ->name('student.courses.roadmap');

        Route::get('/learn/{course}/{path}/{module}', [LearnController::class, 'show'])
            ->name('course.path.module.show');

        Route::get('/quiz/{quiz}', [\App\Http\Controllers\QuizController::class, 'show'])->name('quiz.show');
        Route::post('/quiz/{quiz}/submit', [\App\Http\Controllers\QuizController::class, 'submit'])->name('quiz.submit');
        Route::get('/quiz/{quiz}/result', [\App\Http\Controllers\QuizController::class, 'result'])->name('quiz.result');

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
