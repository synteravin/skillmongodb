<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Path\MentorCreatePathAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Path\StorePathRequest;
use App\Models\CareerGroup;
use App\Models\MentorCareerGroup;
use App\Models\Module;
use App\Models\ModuleContent;
use App\Models\Path;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PathController extends Controller
{
    public function index(CareerGroup $group)
    {
        // dd($group->id, $group->_id);
        $this->authorize('view', $group);

        $basicPaths = Path::where('course_id', (string) $group->course_id)
            ->where('phase', 'basic_fundamental')
            ->orderBy('order')
            ->get()
            ->map(fn ($p) => [
                'id' => (string) $p->_id,
                'slug' => $p->slug,
                'name' => $p->name,
                'description' => $p->description,
                'order' => $p->order,
            ]);

        return Inertia::render('Mentor/Paths/Index', [
            'group' => [
                'id' => (string) $group->_id,
                'slug' => $group->slug,
                'name' => $group->name,
                'description' => $group->description,
                'status' => $group->status ?? 'draft',
            ],
            'paths' => $group->paths()
                ->orderBy('order')
                ->get()
                ->map(fn ($p) => [
                    'id' => (string) $p->_id,
                    'slug' => $p->slug,
                    'name' => $p->name,
                    'description' => $p->description,
                    'order' => $p->order,
                ]),
            'basic_paths' => $basicPaths,
            'course' => $group->course ? [
                'id' => (string) $group->course->_id,
                'slug' => $group->course->slug,
                'title' => $group->course->title,
                'status' => $group->course->status,
            ] : null,
        ]);
    }

    public function store(
        StorePathRequest $request,
        CareerGroup $group,
        MentorCreatePathAction $action
    ) {
        $this->authorize('update', $group);

        $data = $request->validated();

        $phase = $request->input('phase', 'career_branch');
        if ($phase === 'basic_fundamental') {
            $data['career_group_id'] = null;
            $data['phase'] = 'basic_fundamental';
        } else {
            $data['career_group_id'] = (string) $group->_id;
            $data['phase'] = 'career_branch';
        }
        $data['course_id'] = (string) $group->course_id;

        $action->execute($group, $data);

        return back()->with('success', 'Path created');
    }

    public function update(Request $request, Path $path)
    {
        /** @var User $user */
        $user = $request->user();

        $assignedGroupIds = MentorCareerGroup::where('mentor_id', (string) $user->_id)
            ->pluck('career_group_id')
            ->toArray();

        $hasAccess = CareerGroup::where('course_id', (string) $path->course_id)
            ->whereIn('_id', $assignedGroupIds)
            ->exists();

        abort_unless($hasAccess, 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $path->update($data);

        return back()->with('success', 'Path updated successfully');
    }

    public function destroy(Request $request, Path $path)
    {
        /** @var User $user */
        $user = $request->user();

        if (! $user->isAdmin()) {
            $assignedGroupIds = MentorCareerGroup::where('mentor_id', (string) $user->_id)
                ->pluck('career_group_id')
                ->map(fn ($id) => (string) $id)
                ->toArray();

            $hasAccess = (
                ($path->career_group_id && in_array((string) $path->career_group_id, $assignedGroupIds)) ||
                CareerGroup::where('course_id', (string) $path->course_id)
                    ->whereIn('_id', $assignedGroupIds)
                    ->exists()
            );

            abort_unless($hasAccess, 403);
        }

        // Delete associated modules and their contents
        $moduleIds = Module::where('path_id', (string) $path->_id)->pluck('_id')->toArray();
        ModuleContent::whereIn('module_id', $moduleIds)->delete();
        Module::where('path_id', (string) $path->_id)->delete();

        // Delete associated quizzes and their questions/answers
        $quiz = Quiz::where('path_id', (string) $path->_id)->first();
        if ($quiz) {
            $questionIds = QuizQuestion::where('quiz_id', (string) $quiz->_id)->pluck('_id')->toArray();
            QuizAnswer::whereIn('question_id', $questionIds)->delete();
            QuizQuestion::where('quiz_id', (string) $quiz->_id)->delete();
            $quiz->delete();
        }

        $path->delete();

        return back()->with('success', 'Path deleted successfully');
    }

    public function reorder(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'paths' => ['required', 'array'],
            'paths.*.id' => ['required', 'string'],
            'paths.*.order' => ['required', 'integer'],
        ]);

        if (! empty($data['paths'])) {
            $firstPath = Path::find($data['paths'][0]['id']);
            if ($firstPath) {
                $assignedGroupIds = MentorCareerGroup::where('mentor_id', (string) $user->_id)
                    ->pluck('career_group_id')
                    ->toArray();

                $hasAccess = CareerGroup::where('course_id', (string) $firstPath->course_id)
                    ->whereIn('_id', $assignedGroupIds)
                    ->exists();

                abort_unless($hasAccess, 403);
            }
        }

        foreach ($data['paths'] as $p) {
            Path::where('_id', $p['id'])->update(['order' => (int) $p['order']]);
        }

        return back()->with('success', 'Paths reordered');
    }

    public function updateStatus(Request $request, CareerGroup $group)
    {
        $this->authorize('update', $group);

        $data = $request->validate([
            'status' => ['required', 'string', 'in:draft,published,completed'],
        ]);

        $group->update(['status' => $data['status']]);

        return back()->with('success', 'Status branch berhasil diperbarui');
    }
}
