<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAsRead(Request $request, string $id)
    {
        $notification = $request->user()->notifications()->find($id);

        if ($notification) {
            $studentSubmissionId = $notification->data['student_submission_id'] ?? null;
            $notification->markAsRead();

            if ($studentSubmissionId) {
                // Tandai semua notifikasi unread terkait student submission ini sebagai sudah dibaca
                try {
                    $request->user()->unreadNotifications()
                        ->where('data.student_submission_id', (string) $studentSubmissionId)
                        ->get()
                        ->each(fn ($n) => $n->markAsRead());
                } catch (\Throwable $e) {
                    // Abaikan jika ada kegagalan query notifikasi
                }

                return redirect()->to('/mentor/student-submissions/'.$studentSubmissionId);
            }
        }

        return back();
    }
}
