<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerGroup;
use App\Models\MentorCareerGroup;
use App\Models\User;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class CareerGroupController extends Controller
{
    public function assignMentor(Request $request, $group)
    {
        $group = CareerGroup::where('_id', new ObjectId($group))->firstOrFail();

        $data = $request->validate([
            'mentor_id' => ['required'],
        ]);

        $mentor = User::where('_id', $data['mentor_id'])
            ->where('role', 'mentor')
            ->firstOrFail();

        // 1. Update mentor_id pada dokumen CareerGroup (untuk Builder UI)
        $group->update(['mentor_id' => (string) $mentor->_id]);

        // 2. Update atau Buat pivot baru di MentorCareerGroup (untuk Mentor Dashboard)
        MentorCareerGroup::updateOrCreate(
            ['career_group_id' => (string) $group->_id],
            [
                'mentor_id' => (string) $mentor->_id,
                'assigned_by' => (string) auth()->id(),
            ]
        );

        return back()->with('success', 'Mentor assigned');
    }
}
