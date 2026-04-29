<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\CareerGroup;
use App\Actions\Path\CreatePathAction;
use App\Http\Requests\Path\StorePathRequest;
use Inertia\Inertia;

class PathController extends Controller
{
    public function index(CareerGroup $group)
    {
        // dd($group->id, $group->_id);
        $this->authorize('view', $group);

        return Inertia::render('Mentor/Paths/Index', [
            'group' => [
                'id' => (string) $group->_id,
                'name' => $group->name,
            ],
            'paths' => $group->paths()
                ->orderBy('order')
                ->get()
                ->map(fn($p) => [
                    'id' => (string) $p->_id,
                    'name' => $p->name,
                    'order' => $p->order,
                ]),
        ]);
    }

    public function store(
        StorePathRequest $request,
        CareerGroup $group,
        CreatePathAction $action
    ) {
        $this->authorize('update', $group);

        $data = $request->validated();

        // 🔥 inject dari route (mentor tidak kirim)
        $data['career_group_id'] = (string) $group->_id;
        $data['course_id'] = (string) $group->course_id;
        $data['phase'] = 'career_branch';

        $action->execute($group, $data);

        return back()->with('success', 'Path created');
    }
}