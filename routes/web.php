<?php

use App\Http\Controllers\Admin\AssetsController;
use App\Http\Controllers\Admin\CareerGroupController;
use App\Http\Controllers\Admin\CertificateDesignController;
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
use App\Http\Controllers\Mentor\DetailController as MentorDetailController;
use App\Http\Controllers\Mentor\MentorModuleManagementController;
use App\Http\Controllers\Mentor\MentorQuizController;
use App\Http\Controllers\Mentor\NotificationController;
use App\Http\Controllers\Mentor\PathController;
use App\Http\Controllers\Mentor\StudentSubmissionController as MentorStudentSubmission;
use App\Http\Controllers\Mentor\SubmissionController;
use App\Http\Controllers\ModuleContentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestMessageController;
use App\Http\Controllers\Student\CareerController;
use App\Http\Controllers\Student\CertificateController;
use App\Http\Controllers\Student\CompleteModuleController;
use App\Http\Controllers\Student\CompletePathController;
use App\Http\Controllers\Student\CourseController as StudentCourseActionController;
use App\Http\Controllers\Student\CourseRoadmapController;
use App\Http\Controllers\Student\DashboardController as StudentDashboard;
use App\Http\Controllers\Student\ForumController;
use App\Http\Controllers\Student\LeaderboardController;
use App\Http\Controllers\Student\LearnController;
use App\Http\Controllers\Student\MentorProfileController;
use App\Http\Controllers\Student\QuestController;
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
                Route::post('badges/reorder', [LevelBadgeController::class, 'reorder'])
                    ->name('badges.reorder');

                // CERTIFICATE DESIGN
                Route::post('certificate-designs', [CertificateDesignController::class, 'store'])
                    ->name('certificates.store');
                Route::post('certificate-designs/{id}/active', [CertificateDesignController::class, 'setActive'])
                    ->name('certificates.active');
                Route::delete('certificate-designs/{id}', [CertificateDesignController::class, 'destroy'])
                    ->name('certificates.destroy');

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

        Route::post('/courses/{course}/publish', [CourseController::class, 'publish'])
            ->name('courses.publish');

        /* ---------------- COURSE BUILDER ---------------- */

        Route::get('/courses/{course}', [CourseBuilderController::class, 'show'])
            ->name('courses.builder');

        /* ---------------- BUILDER API ---------------- */

        Route::post('/career-groups', [CourseBuilderController::class, 'storeCareerGroup'])
            ->name('career-groups.store');
        Route::put('/career-groups/{group}', [CourseBuilderController::class, 'updateCareerGroup'])
            ->name('career-groups.update');
        Route::delete('/career-groups/{group}', [CourseBuilderController::class, 'destroyCareerGroup'])
            ->name('career-groups.destroy');
        Route::post('/career-groups/{group}/status', [CourseBuilderController::class, 'updateCareerGroupStatus'])
            ->name('career-groups.status');

        Route::post('/paths', [CourseBuilderController::class, 'storePath'])
            ->name('paths.store');
        Route::put('/paths/reorder', [CourseBuilderController::class, 'reorderPaths'])
            ->name('paths.reorder');
        Route::put('/paths/{path}', [CourseBuilderController::class, 'updatePath'])
            ->name('paths.update');
        Route::delete('/paths/{path}', [CourseBuilderController::class, 'destroyPath'])
            ->name('paths.destroy');

        Route::post('/modules', [CourseBuilderController::class, 'storeModule'])
            ->name('modules.store');
        Route::delete('/modules/{module}', [CourseBuilderController::class, 'destroyModule'])
            ->name('modules.destroy');

        Route::post('/module-content', [CourseBuilderController::class, 'storeContent'])
            ->name('module-content.store');

        Route::post('/quiz-question', [CourseBuilderController::class, 'storeQuestion'])
            ->name('quiz-question.store');

        Route::post('/quiz-answer', [CourseBuilderController::class, 'storeAnswer'])
            ->name('quiz-answer.store');

        /* ---------------- LEVEL BADGES ---------------- */

        // Route::resource('/levelbadge', LevelBadgeController::class);

        /* ---------------- USER ---------------- */

        Route::post('/users/bulk-delete', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
        Route::post('/users/bulk-role', [UserController::class, 'bulkRole'])->name('users.bulk-role');
        Route::resource('users', UserController::class);
        // Route::post('/admin/users/{user}', [UserController::class, 'update']);

        /* ---------------- ASSIGN MENTOR ---------------- */
        Route::post('/career-groups/{group}/assign-mentor', [CareerGroupController::class, 'assignMentor'])
            ->name('career-groups.assign-mentor');

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

        // FORUM
        Route::get('/forum/user/{user}/profile', [App\Http\Controllers\Admin\ForumController::class, 'userProfile'])->name('forum.user.profile');
        Route::get('/forum/{course?}', [App\Http\Controllers\Admin\ForumController::class, 'index'])->name('forum.index');
        Route::get('/forum/{course}/messages', [App\Http\Controllers\Admin\ForumController::class, 'getMessages'])->name('forum.messages');
        Route::post('/forum/{course}/messages', [App\Http\Controllers\Admin\ForumController::class, 'store'])->name('forum.messages.store');
        Route::post('/forum/messages/{message}/reaction', [App\Http\Controllers\Admin\ForumController::class, 'toggleReaction'])->name('forum.messages.reaction');
        Route::post('/forum/messages/{message}/pin', [App\Http\Controllers\Admin\ForumController::class, 'togglePin'])->name('forum.messages.pin');
        Route::put('/forum/messages/{message}', [App\Http\Controllers\Admin\ForumController::class, 'update'])->name('forum.messages.update');
        Route::delete('/forum/messages/{message}', [App\Http\Controllers\Admin\ForumController::class, 'destroy'])->name('forum.messages.destroy');

        // ADMIN QUEST CRUD
        Route::get('/quests', [App\Http\Controllers\Admin\QuestController::class, 'index'])->name('quests.index');
        Route::post('/quests', [App\Http\Controllers\Admin\QuestController::class, 'store'])->name('quests.store');
        Route::get('/quests/{quest}', [App\Http\Controllers\Admin\QuestController::class, 'show'])->name('quests.show');
        Route::put('/quests/{quest}', [App\Http\Controllers\Admin\QuestController::class, 'update'])->name('quests.update');
        Route::delete('/quests/{quest}', [App\Http\Controllers\Admin\QuestController::class, 'destroy'])->name('quests.destroy');
        Route::delete('/quests/{quest}/bids/{bid}', [App\Http\Controllers\Admin\QuestController::class, 'destroyBid'])->name('quests.bids.destroy');
        Route::post('/quests/{quest}/accept-bid/{bid}', [App\Http\Controllers\Admin\QuestController::class, 'acceptBid'])->name('quests.accept-bid');
        Route::post('/quests/{quest}/approve', [App\Http\Controllers\Admin\QuestController::class, 'approveWork'])->name('quests.approve-work');
        Route::post('/quests/{quest}/reject', [App\Http\Controllers\Admin\QuestController::class, 'rejectWork'])->name('quests.reject-work');
        Route::post('/quests/{quest}/approve-post', [App\Http\Controllers\Admin\QuestController::class, 'approvePost'])->name('quests.approve-post');
        Route::post('/quests/{quest}/reject-post', [App\Http\Controllers\Admin\QuestController::class, 'rejectPost'])->name('quests.reject-post');
        Route::post('/quests/{quest}/arbitrate', [App\Http\Controllers\Admin\QuestController::class, 'arbitrate'])->name('quests.arbitrate');
        Route::post('/quests/{quest}/force-cancel', [App\Http\Controllers\Admin\QuestController::class, 'forceCancel'])->name('quests.force-cancel');
        Route::post('/quests/{quest}/extend-deadline', [App\Http\Controllers\Admin\QuestController::class, 'extendDeadline'])->name('quests.extend-deadline');
        Route::post('/quests/{quest}/reopen-bidding', [App\Http\Controllers\Admin\QuestController::class, 'reopenBidding'])->name('quests.reopen-bidding');
        Route::get('/quests-flags', [App\Http\Controllers\Admin\QuestController::class, 'flagQueue'])->name('quests.flags');
        Route::post('/quests-flags/{flag}/resolve', [App\Http\Controllers\Admin\QuestController::class, 'resolveFlag'])->name('quests.flags.resolve');
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

        Route::get('/profile', [App\Http\Controllers\Mentor\ProfileController::class, 'edit'])
            ->name('profile.edit');
        Route::post('/profile', [App\Http\Controllers\Mentor\ProfileController::class, 'update'])
            ->name('profile.update');

        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])
            ->name('notifications.read');
        Route::get('/student-journey', [MentorDetailController::class, 'index'])
            ->name('student-journey');

        Route::get('/student-journey', [MentorDetailController::class, 'index'])
            ->name('student-journey');

        Route::get('/student-journey/{student}', [MentorDetailController::class, 'show'])
            ->name('student-journey.show');

        Route::get('/career-groups/{group}/paths', [PathController::class, 'index'])
            ->name('paths.index');

        Route::post('/career-groups/{group}/paths', [PathController::class, 'store'])
            ->name('paths.store');

        Route::post('/career-groups/{group}/status', [PathController::class, 'updateStatus'])
            ->name('career-groups.status');

        Route::put('/paths/reorder', [PathController::class, 'reorder'])
            ->name('paths.reorder');

        Route::put('/paths/{path}', [PathController::class, 'update'])
            ->name('paths.update');

        Route::delete('/paths/{path}', [PathController::class, 'destroy'])
            ->name('paths.destroy');

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

        Route::delete(
            '/modules/{module}',
            [CourseBuilderController::class, 'destroyModule']
        )->name('modules.destroy');

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
            '/quiz',
            [MentorQuizController::class, 'index']
        )->name('quiz.index');

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

        // FORUM
        Route::get('/forum/user/{user}/profile', [App\Http\Controllers\Mentor\ForumController::class, 'userProfile'])->name('forum.user.profile');
        Route::get('/forum/{course?}', [App\Http\Controllers\Mentor\ForumController::class, 'index'])->name('forum.index');
        Route::get('/forum/{course}/messages', [App\Http\Controllers\Mentor\ForumController::class, 'getMessages'])->name('forum.messages');
        Route::post('/forum/{course}/messages', [App\Http\Controllers\Mentor\ForumController::class, 'store'])->name('forum.messages.store');
        Route::post('/forum/messages/{message}/reaction', [App\Http\Controllers\Mentor\ForumController::class, 'toggleReaction'])->name('forum.messages.reaction');
        Route::post('/forum/messages/{message}/pin', [App\Http\Controllers\Mentor\ForumController::class, 'togglePin'])->name('forum.messages.pin');
        Route::put('/forum/messages/{message}', [App\Http\Controllers\Mentor\ForumController::class, 'update'])->name('forum.messages.update');
        Route::delete('/forum/messages/{message}', [App\Http\Controllers\Mentor\ForumController::class, 'destroy'])->name('forum.messages.destroy');
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
        Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::post('/profile/edit', [ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

        Route::get('/mentors/{mentor}', [MentorProfileController::class, 'show'])
            ->name('mentors.show');

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

        Route::get('/quiz/{quiz}', [App\Http\Controllers\QuizController::class, 'show'])->name('quiz.show');
        Route::post('/quiz/{quiz}/submit', [App\Http\Controllers\QuizController::class, 'submit'])->name('quiz.submit');
        Route::get('/quiz/{quiz}/result', [App\Http\Controllers\QuizController::class, 'result'])->name('quiz.result');
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
| QUEST SYSTEM (FREELANCE)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:student,admin', 'has.character'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/quests', [QuestController::class, 'index'])->name('quests.index');
        Route::get('/quests/history', [QuestController::class, 'history'])->name('quests.history');
        Route::get('/quests/create', [QuestController::class, 'create'])->name('quests.create');
        Route::post('/quests', [QuestController::class, 'store'])->name('quests.store');
        Route::get('/quests/{quest}', [QuestController::class, 'show'])->name('quests.show');
        Route::post('/quests/{quest}/bid', [QuestController::class, 'storeBid'])->name('quests.store-bid');
        Route::post('/quests/{quest}/accept-bid/{bid}', [QuestController::class, 'acceptBid'])->name('quests.accept-bid');
        Route::post('/quests/{quest}/submit', [QuestController::class, 'submitWork'])->name('quests.submit-work');
        Route::post('/quests/{quest}/submit-final-zip', [QuestController::class, 'submitFinalZIP'])->name('quests.submit-final-zip');
        Route::post('/quests/{quest}/approve', [QuestController::class, 'approveWork'])->name('quests.approve-work');
        Route::post('/quests/{quest}/reject', [QuestController::class, 'rejectWork'])->name('quests.reject-work');
        Route::post('/quests/{quest}/dispute', [QuestController::class, 'fileDispute'])->name('quests.dispute');
        Route::post('/quests/{quest}/extend-deadline', [QuestController::class, 'extendDeadline'])->name('quests.extend-deadline');
        Route::post('/quests/{quest}/upload-payment', [QuestController::class, 'uploadPaymentProof'])->name('quests.upload-payment');
    });

/*
|--------------------------------------------------------------------------
| FORUM DISKUSI (Bisa diakses Student, Mentor, Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/forum/attachment/download', [ForumController::class, 'downloadAttachment'])->name('forum.attachment.download');
        Route::get('/forum/user/{user}/profile', [ForumController::class, 'userProfile'])->name('forum.user.profile');
        Route::get('/forum/{course?}', [ForumController::class, 'index'])->name('forum.index');
        Route::get('/forum/{course}/messages', [ForumController::class, 'getMessages'])->name('forum.messages');
        Route::post('/forum/{course}/messages', [ForumController::class, 'store'])->name('forum.messages.store');
        Route::post('/forum/messages/{message}/reaction', [ForumController::class, 'toggleReaction'])->name('forum.messages.reaction');
        Route::post('/forum/messages/{message}/pin', [ForumController::class, 'togglePin'])->name('forum.messages.pin');
        Route::put('/forum/messages/{message}', [ForumController::class, 'update'])->name('forum.messages.update');
        Route::delete('/forum/messages/{message}', [ForumController::class, 'destroy'])->name('forum.messages.destroy');
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

Route::middleware(['auth', 'has.character'])->group(function () {
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

/*
|--------------------------------------------------------------------------
| QUEST CHAT / COMMUNICATION
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/quests/bids/{bid}/messages', [QuestMessageController::class, 'getMessages'])->name('quests.bids.messages');
    Route::post('/quests/bids/{bid}/messages', [QuestMessageController::class, 'store'])->name('quests.bids.messages.store');
});

require __DIR__.'/settings.php';
