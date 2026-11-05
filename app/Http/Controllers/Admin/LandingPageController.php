<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LandingPage\UpdateAboutRequest;
use App\Http\Requests\LandingPage\UpdateCommunityRequest;
use App\Http\Requests\LandingPage\UpdateContactRequest;
use App\Http\Requests\LandingPage\UpdateFaqsRequest;
use App\Http\Requests\LandingPage\UpdateVisionMissionRequest;
use App\Services\LandingPageService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    public function __construct(public LandingPageService $landingPageService) {}

    /**
     * Display the Landing Page management dashboard.
     */
    public function index(): Response
    {
        $settings = $this->landingPageService->getSettingsPayload();

        return Inertia::render('Admin/LandingPage/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the About section content.
     */
    public function updateAbout(UpdateAboutRequest $request): RedirectResponse
    {
        $this->landingPageService->updateAbout(
            $request->validated(),
            $request->user()?->id
        );

        return redirect()
            ->back()
            ->with('success', 'Konten About Section berhasil diperbarui.');
    }

    /**
     * Update the Vision & Mission section content.
     */
    public function updateVisionMission(UpdateVisionMissionRequest $request): RedirectResponse
    {
        $this->landingPageService->updateVisionMission(
            $request->validated('pillars'),
            $request->user()?->id
        );

        return redirect()
            ->back()
            ->with('success', 'Pilar Visi & Misi berhasil diperbarui.');
    }

    /**
     * Update the FAQs list.
     */
    public function updateFaqs(UpdateFaqsRequest $request): RedirectResponse
    {
        $this->landingPageService->updateFaqs(
            $request->validated('faqs') ?? [],
            $request->user()?->id
        );

        return redirect()
            ->back()
            ->with('success', 'Daftar FAQ berhasil diperbarui.');
    }

    /**
     * Update the Community / CTA section.
     */
    public function updateCommunity(UpdateCommunityRequest $request): RedirectResponse
    {
        $this->landingPageService->updateCommunity(
            $request->validated(),
            $request->user()?->id
        );

        return redirect()
            ->back()
            ->with('success', 'Ajakan Komunitas (CTA) berhasil diperbarui.');
    }

    /**
     * Update the Contact section.
     */
    public function updateContact(UpdateContactRequest $request): RedirectResponse
    {
        $this->landingPageService->updateContact(
            $request->validated(),
            $request->user()?->id
        );

        return redirect()
            ->back()
            ->with('success', 'Informasi Kontak berhasil diperbarui.');
    }
}
