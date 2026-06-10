<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Responses\Mentor\MentorProfileResponse;
use App\Models\User;
use App\Services\Mentor\MentorProfileService;
use Inertia\Inertia;

class MentorProfileController extends Controller
{
    public function __construct(
        protected MentorProfileService $profileService
    ) {}

    /**
     * Display the specified mentor's profile.
     *
     * @return \Inertia\Response
     */
    public function show(string $mentorId)
    {
        $mentor = User::findOrFail($mentorId);

        // Abort if not a mentor
        abort_if(! $mentor->isMentor(), 404);

        $statsData = $this->profileService->getProfileData($mentor);
        $formatted = MentorProfileResponse::make($mentor, $statsData);

        return Inertia::render('Student/MentorProfile', [
            'mentor' => $formatted,
        ]);
    }
}
