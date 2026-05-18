<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Mentor\StudentJourneyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DetailController extends Controller
{
    public function __construct(private StudentJourneyService $studentJourneyService) {}

    public function index(Request $request)
    {
        $mentor = $request->user();
        abort_if(! $mentor->isMentor() && ! $mentor->isAdmin(), 403);

        $data = $this->studentJourneyService->getDashboardData($mentor);

        return Inertia::render('Mentor/StudentJourney/Index', $data);
    }

    public function show(Request $request, string $studentId)
    {
        $mentor = $request->user();
        abort_if(! $mentor->isMentor() && ! $mentor->isAdmin(), 403);

        $student = User::findOrFail($studentId);

        $data = $this->studentJourneyService->getStudentDetailData($mentor, $student);

        return Inertia::render('Mentor/StudentJourney/Show', $data);
    }
}
