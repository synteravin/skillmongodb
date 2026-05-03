<?php

namespace App\Providers;

use App\Models\CareerGroup;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\User;
use App\Policies\CareerGroupPolicy;
use App\Policies\CoursePolicy;
use App\Policies\QuizPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        Quiz::class => QuizPolicy::class,
        Course::class => CoursePolicy::class,
        CareerGroup::class => CareerGroupPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
