<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\CourseStudent;
use App\Models\MentorCareerGroup;
use App\Models\StudentSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $mentor = $request->user();

        $groups = MentorCareerGroup::with('careerGroup')
            ->where('mentor_id', (string) $mentor->_id)
            ->get()
            ->pluck('careerGroup')
            ->filter()
            ->values();

        // 🔥 HITUNG TOTAL STUDENT
        $totalStudents = $groups->sum(function ($group) {
            return CourseStudent::where(
                'career_group_id',
                (string) $group->_id
            )->count();
        });

        // 🔥 HITUNG ACTIVE STUDENT
        $activeStudents = $groups->sum(function ($group) {
            return CourseStudent::where(
                'career_group_id',
                (string) $group->_id
            )
                ->where('status', 'active')
                ->count();
        });

        // Ambil semua notifikasi yang belum dibaca milik mentor
        $allUnreadNotifications = $mentor->unreadNotifications()->get();

        // Ekstrak ID submission unik dari notifikasi
        $submissionIds = $allUnreadNotifications
            ->map(fn ($n) => is_array($n->data) ? ($n->data['student_submission_id'] ?? null) : null)
            ->filter()
            ->unique()
            ->values()
            ->all();

        // Ambil data StudentSubmission terkait
        $studentSubmissions = ! empty($submissionIds)
            ? StudentSubmission::whereIn('_id', $submissionIds)->get()->keyBy(fn ($s) => (string) $s->_id)
            : collect();

        $validPendingNotifications = collect();
        $seenSubmissionIds = [];

        foreach ($allUnreadNotifications as $notif) {
            $subId = is_array($notif->data) ? (string) ($notif->data['student_submission_id'] ?? '') : '';

            // Hanya notifikasi terkait submission yang masuk ke Submission Review Center
            if (! $subId) {
                continue;
            }

            $submission = $studentSubmissions->get($subId);

            // Jika tugas sudah dinilai (status === 'graded' / ada grade) atau data tugas terhapus:
            // Maka tidak ada lagi antrian penilaian. Tandai notifikasi sebagai sudah dibaca (read).
            if (! $submission || $submission->status === 'graded' || $submission->grade !== null) {
                $notif->markAsRead();

                continue;
            }

            // Jika student melakukan update berulang kali, deduplikasi: hanya ambil 1 notifikasi terbaru per submission
            if (! in_array($subId, $seenSubmissionIds, true)) {
                $seenSubmissionIds[] = $subId;
                $validPendingNotifications->push($notif);
            } else {
                // Notifikasi duplikat/lama dari update sebelumnya otomatis ditandai sudah dibaca
                $notif->markAsRead();
            }
        }

        $pendingReviewsCount = $validPendingNotifications->count();
        $notificationsList = $validPendingNotifications->take(15);

        return Inertia::render('Mentor/Dashboard', [
            'mentor' => [
                'name' => $mentor->name,
                'username' => $mentor->username ?? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $mentor->name)),

                'stats' => [
                    'career_groups' => $groups->count(),
                    'students' => $totalStudents,   // ✅ FIX
                    'active' => $activeStudents,    // ✅ FIX
                    'pending_reviews' => $pendingReviewsCount,
                ],

                'careerGroups' => $groups->map(function ($group) {
                    $students = CourseStudent::where(
                        'career_group_id',
                        (string) $group->_id
                    )->count();

                    $active = CourseStudent::where(
                        'career_group_id',
                        (string) $group->_id
                    )
                        ->where('status', 'active')
                        ->count();

                    return [
                        'id' => (string) $group->_id,
                        'slug' => $group->slug ?: Str::slug($group->name) ?: (string) $group->_id,
                        'name' => $group->name,
                        'paths_count' => $group->paths()->count(),
                        'students' => $students,
                        'active' => $active,
                    ];
                })->values()->all(),
            ],
            'notifications' => $notificationsList->map(function ($notif) {
                return [
                    'id' => (string) $notif->id,
                    'data' => $notif->data,
                    'created_at' => $notif->created_at ? $notif->created_at->diffForHumans() : 'Just now',
                ];
            })->values()->all(),
        ]);
    }
}
