<?php

use App\Http\Controllers\Admin\AssetsController;
use App\Http\Controllers\Admin\CareerGroupController;
use App\Http\Controllers\Admin\CharacterController;
use App\Http\Controllers\Admin\CourseBuilderController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\LevelBadgeController;
use App\Http\Controllers\Admin\ModuleManagementController;
use App\Http\Controllers\Admin\QuizController;
use App\Http\Controllers\Admin\RankController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\SocialController;
use App\Http\Controllers\Mentor\DashboardController as MentorDashboard;
use App\Http\Controllers\Mentor\PathController;
use App\Http\Controllers\Mentor\StudentSubmissionController as MentorStudentSubmission;
use App\Http\Controllers\Mentor\MentorModuleManagementController as MentorModuleManagementController;
use App\Http\Controllers\Mentor\SubmissionController;
use App\Http\Controllers\Mentor\MentorQuizController;
use App\Http\Controllers\ModuleContentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\CareerController;
use App\Http\Controllers\Student\CertificateController;
use App\Http\Controllers\Student\CompleteModuleController;
use App\Http\Controllers\Student\CompletePathController;
use App\Http\Controllers\Student\CourseController as StudentCourseActionController;
use App\Http\Controllers\Student\CourseRoadmapController;
use App\Http\Controllers\Student\DashboardController as StudentDashboard;
use App\Http\Controllers\Student\LeaderboardController;
use App\Http\Controllers\Student\LearnController;
use App\Http\Controllers\Student\SelectCharacterController;
use App\Http\Controllers\Student\SelectPathController;
use App\Http\Controllers\Student\StudentCourseController;
use App\Http\Controllers\Student\SubmissionController as StudentSubmission;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::prefix('assets')
            ->name('assets.')
            ->group(function () {

                // DASHBOARD
                Route::get('/', [AssetsController::class, 'index'])
                    ->name('index');

                // RANK
                Route::resource('ranks', RankController::class);
                Route::post('ranks/reorder', [RankController::class, 'reorder'])
                    ->name('ranks.reorder');

                // CHARACTER
                Route::resource('characters', CharacterController::class)
                    ->except(['show']);

                // BADGE
                Route::resource('badges', LevelBadgeController::class);

            });
        /* ---------------- DASHBOARD ---------------- */

        Route::get('/dashboard', [AdminDashboard::class, 'index'])
            ->name('dashboard');

        /* ---------------- CHARACTERS ---------------- */

        // Route::resource('characters', CharacterController::class)
        //     ->except(['show']);
    
        /* ---------------- COURSE CRUD ---------------- */

        Route::get('/courses', [CourseController::class, 'index'])
            ->name('courses.index');



        Route::post('/courses', [CourseController::class, 'store'])
            ->name('courses.store');



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

        // Route::resource('/levelbadge', LevelBadgeController::class);
    
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

        Route::get('/quiz', [QuizController::class, 'index'])->name('quiz.index');

        Route::get('/paths/{path}/quiz/create', [QuizController::class, 'create'])
            ->name('quiz.create');

        Route::post('/paths/{path}/quiz', [QuizController::class, 'store'])
            ->name('paths.quiz.store');

        Route::get('/quiz/{quiz}', [QuizController::class, 'show'])->name('quiz.show');

        Route::get('/quiz/{quiz}/edit', [QuizController::class, 'edit'])->name('quiz.edit');

        Route::put('/quiz/{quiz}', [QuizController::class, 'update'])->name('quiz.update');

        Route::delete('/quiz/{quiz}', [QuizController::class, 'destroy'])->name('quiz.destroy');
        Route::post('/select-career', [CareerController::class, 'select']);
        // Route::resource('ranks', RankController::class);
    
        // Route::post('ranks/reorder', [RankController::class, 'reorder'])
        //     ->name('ranks.reorder');
    
        // Route::get('assets', function () {
        //     return Inertia::render('Admin/Assets/Index');
        // })->name('assets');
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

        Route::get('/career-groups/{group}/paths', [PathController::class, 'index'])
            ->name('paths.index');

        Route::post('/career-groups/{group}/paths', [PathController::class, 'store'])
            ->name('paths.store');

        Route::post(
            '/paths/{path}/submissions',
            [SubmissionController::class, 'store']
        )->name('submissions.store');

        Route::post('/submissions/{submission}/publish', [SubmissionController::class, 'publish'])
            ->name('submissions.publish');

        Route::get('/student-submissions/{studentSubmission}', [MentorStudentSubmission::class, 'show'])
            ->name('student-submissions.show');
        Route::put('/student-submissions/{studentSubmission}/grade', [MentorStudentSubmission::class, 'update'])
            ->name('student-submissions.update');

        Route::get(
            '/career-groups/{group}/submissions',
            [SubmissionController::class, 'index']
        )->name('submissions.index');

        Route::get(
            '/career-groups/{group}/submissions/create',
            [SubmissionController::class, 'create']
        )->name('submissions.create');

        Route::get(
            '/submissions/{submission}',
            [SubmissionController::class, 'show']
        )->name('submissions.show');

        Route::get(
            '/submissions/{submission}/edit',
            [SubmissionController::class, 'edit']
        )->name('submissions.edit');

        Route::put(
            '/submissions/{submission}',
            [SubmissionController::class, 'update']
        )->name('submissions.update');

        Route::post(
            '/career-groups/{group}/submissions',
            [SubmissionController::class, 'store']
        )->name('submissions.store');

        // Route::get(
        //     '/career-groups/{group}/paths/{path}/modules',
        //     [MentorModuleManagementController::class, 'index']
        // )->name('paths.modules');
    
        Route::get(
            '/career-groups/{group}/paths/{path}/modules',
            [MentorModuleManagementController::class, 'index']
        )->name('paths.modules');

        /* ---------------- MODULE BUILDER ---------------- */

        Route::post(
            '/modules',
            [CourseBuilderController::class, 'storeModule']
        )->name('modules.store');

        Route::post(
            '/modules/{module}/contents',
            [ModuleContentController::class, 'store']
        )->name('module-contents.store');

        Route::put(
            '/module-contents/reorder',
            [ModuleContentController::class, 'reorder']
        );

        Route::put(
            '/module-contents/{content}',
            [ModuleContentController::class, 'update']
        )->name('module-contents.update');

        Route::delete(
            '/module-contents/{content}',
            [ModuleContentController::class, 'destroy']
        )->name('module-contents.destroy');

        /* ---------------- FINAL QUIZ ---------------- */

        Route::get(
            '/career-groups/{group}/paths/{path}/quiz/create',
            [MentorQuizController::class, 'create']
        )->name('quiz.create');

        Route::post(
            '/paths/{path}/quiz',
            [MentorQuizController::class, 'store']
        )->name('quiz.store');

        Route::get(
            '/quiz/{quiz}/edit',
            [MentorQuizController::class, 'edit']
        )->name('quiz.edit');

        Route::put(
            '/quiz/{quiz}',
            [MentorQuizController::class, 'update']
        )->name('quiz.update');

        Route::delete(
            '/quiz/{quiz}',
            [MentorQuizController::class, 'destroy']
        )->name('quiz.destroy');
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

        Route::get('/certificates', [CertificateController::class, 'index'])
            ->name('student.certificates');

        Route::get('/profile', [ProfileController::class, 'index'])->name('profile');

        Route::get('/course', [StudentCourseController::class, 'index'])
            ->name('course');

        Route::post('/courses/select', [StudentCourseActionController::class, 'select'])
            ->name('courses.select');

        Route::get('/courses/{course}', CourseRoadmapController::class)
            ->name('courses.roadmap');

        Route::post('/modules/{module}/complete', CompleteModuleController::class)
            ->name('modules.complete');

        Route::post('/paths/{path}/select', SelectPathController::class)
            ->name('student.paths.select');

        Route::post('/paths/{path}/complete', CompletePathController::class)
            ->name('student.paths.complete');

        Route::get('/learn/{course}/{path}/{module}', [LearnController::class, 'show'])
            ->name('course.path.module.show');

        Route::get('/quiz/{quiz}', [\App\Http\Controllers\QuizController::class, 'show'])->name('quiz.show');
        Route::post('/quiz/{quiz}/submit', [\App\Http\Controllers\QuizController::class, 'submit'])->name('quiz.submit');
        Route::get('/quiz/{quiz}/result', [\App\Http\Controllers\QuizController::class, 'result'])->name('quiz.result');
        Route::post('/select-career/{path}', SelectPathController::class)
            ->name('select-career');
        Route::get('/leaderboard', [LeaderboardController::class, 'index'])
            ->name('leaderboard');

        // SUBMISSION
        Route::get('/career-groups/{group}/submissions', [StudentSubmission::class, 'index'])
            ->name('submissions.index');
        Route::get('/submissions/{submission}', [StudentSubmission::class, 'show'])
            ->name('submissions.show');
        Route::post('/submissions/{submission}/submit', [StudentSubmission::class, 'store'])
            ->name('submissions.store');
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
