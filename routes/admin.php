<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CourseBuilderController;
use App\Http\Controllers\Admin\CourseController;

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/courses/{course}', [CourseBuilderController::class, 'show'])
            ->name('courses.show');

        Route::post('/courses', [CourseBuilderController::class, 'storeCourse'])
            ->name('courses.store');

        Route::get('/courses', [CourseBuilderController::class, 'index'])
            ->name('courses.index');

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

        Route::get('/courses', [CourseController::class, 'index'])
            ->name('courses.index');

        Route::get('/courses/create', [CourseController::class, 'create'])
            ->name('courses.create');

        Route::post('/courses', [CourseController::class, 'store'])
            ->name('courses.store');

        Route::get('/courses/{course}', [CourseBuilderController::class, 'show'])
            ->name('courses.builder');


    });