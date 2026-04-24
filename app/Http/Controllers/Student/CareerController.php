<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CareerController extends Controller
{
    public function select(Request $request)
    {
        $user = auth()->user();

        $progress = UserStat::where('user_id', $user->_id)
            ->where('course_id', request('course_id')) // optional kalau perlu
            ->firstOrFail();

        if (!$progress->selected_path_id) {
            $progress->update([
                'selected_path_id' => $request->path_id
            ]);
        }

        return back();
    }
}
