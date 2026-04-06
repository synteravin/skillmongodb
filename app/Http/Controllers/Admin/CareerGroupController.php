<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;
use App\Models\CareerGroup;
use App\Models\User;

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

        $group->update([
            'mentor_id' => $mentor->_id
        ]);

        return back();
    }
}
