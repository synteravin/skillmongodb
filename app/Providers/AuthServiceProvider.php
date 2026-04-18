<?php

namespace App\Providers;

use App\Models\Course;
use App\Models\User;
use App\Policies\UserPolicy;
use App\Policies\QuizPolicy;
use App\Policies\CoursePolicy;
use App\Models\Quiz;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        Quiz::class => QuizPolicy::class,
        Course::class => CoursePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
