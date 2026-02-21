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

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [AdminDashboard::class, 'index'])
            ->name('dashboard');

        Route::resource('characters', CharacterController::class)
            ->except(['show']);
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
    });

/*
|--------------------------------------------------------------------------
| SELECT CHARACTER (NO has.character middleware)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:student'])
    ->group(function () {

        Route::get('/select-character', [SelectCharacterController::class, 'index'])
            ->name('character.select');

        Route::post('/select-character', [SelectCharacterController::class, 'store'])
            ->name('character.store');
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

require __DIR__.'/settings.php';
