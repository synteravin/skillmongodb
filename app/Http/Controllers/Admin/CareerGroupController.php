<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\CareerGroup;
use App\Models\User;
use App\Models\MentorCareerGroup;

class CareerGroupController extends Controller
{


    public function assignMentor(Request $request, $group)
    {
        $group = CareerGroup::where('_id', new ObjectId($group))->firstOrFail();

        $data = $request->validate([
            'mentor_id' => ['required']
        ]);

        $mentor = User::where('_id', $data['mentor_id'])
            ->where('role', 'mentor')
            ->firstOrFail();

        // 🔥 CEK DUPLICATE
        $exists = MentorCareerGroup::where('mentor_id', (string) $mentor->_id)
            ->where('career_group_id', (string) $group->_id)
            ->exists();

        if (!$exists) {
            MentorCareerGroup::create([
                'mentor_id' => (string) $mentor->_id,
                'career_group_id' => (string) $group->_id,
                'assigned_by' => (string) auth()->id()
            ]);
        }

        return back()->with('success', 'Mentor assigned');
    }
}
