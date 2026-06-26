<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CareerGroup;
use App\Models\MentorCareerGroup;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CareerGroupController extends Controller
{
    public function assignMentor(Request $request, string $group): RedirectResponse
    {
        $group = CareerGroup::findOrFail($group);

        $data = $request->validate([
            'mentor_id' => ['nullable', 'string'],
        ]);

        if (empty($data['mentor_id'])) {
            $group->update(['mentor_id' => null]);
            MentorCareerGroup::where('career_group_id', (string) $group->_id)->delete();

            return back()->with('success', 'Mentor unassigned');
        }

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
                'assigned_by' => (string) Auth::id(),
            ]
        );

        return back()->with('success', 'Mentor assigned');
    }
}
