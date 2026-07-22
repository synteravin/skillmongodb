<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Mentor\UpdateMentorProfileAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Mentor\ProfileUpdateRequest;
use App\Http\Responses\Mentor\MentorProfileResponse;
use App\Services\Mentor\MentorProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        protected MentorProfileService $profileService,
        protected UpdateMentorProfileAction $updateAction
    ) {}

    /**
     * Show the mentor's profile edit page.
     *
     * @return Response
     */
    public function edit(Request $request)
    {
        $mentor = $request->user();
        $statsData = $this->profileService->getProfileData($mentor);

        $formatted = MentorProfileResponse::make($mentor, $statsData);

        return Inertia::render('Mentor/Profile', [
            'mentor' => $formatted,
        ]);
    }

    /**
     * Update the mentor's profile in storage.
     *
     * @return RedirectResponse
     */
    public function update(ProfileUpdateRequest $request)
    {
        $mentor = $request->user();

        $this->updateAction->execute($mentor, $request->validated());

        return back()->with('success', 'Profile updated successfully.');
    }
}
