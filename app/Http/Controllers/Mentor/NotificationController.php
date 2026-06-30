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
                return redirect()->to('/mentor/student-submissions/'.$studentSubmissionId);
            }
        }

        return back();
    }
}
