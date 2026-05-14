<?php

namespace App\Http\Controllers\Admin;

use App\Actions\CareerGroup\CreateCareerGroupAction;
use App\Actions\Course\CreateCourseAction;
use App\Actions\Module\CreateModuleAction;
use App\Actions\Path\AdminCreatePathAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\CareerGroup\StoreCareerGroupRequest;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Module\StoreModuleRequest;
use App\Http\Requests\Path\StorePathRequest;
use App\Models\CareerGroup;
use App\Models\Course;
use App\Models\LevelBadge;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CourseBuilderController extends Controller
{
    public function index()
    {

        $courses = Course::latest()->get();

        return Inertia::render('Admin/Course/Index', [
            'courses' => $courses,
            'mentors' => User::where('role', 'mentor')->get()->map(fn ($m) => [
                '_id' => (string) $m->_id,
                'name' => $m->name,
            ]),
        ]);

    }

    public function show(Course $course)
    {

        $course->load([
            'paths.modules',
            'careerGroups.paths.modules',
            'careerGroups.mentor',
        ]);

        $basicPaths = $course->paths
            ->where('phase', 'basic_fundamental')
            ->values()
            ->map(function ($path) {

                return [
                    '_id' => (string) $path->_id,
                    'name' => $path->name,
                    'modules' => $path->modules->map(function ($module) {
                        return [
                            '_id' => (string) $module->_id,
                            'title' => $module->title,
                        ];
                    }),

                ];

            });

        $careerGroups = $course->careerGroups
            ->values()
            ->map(function ($group) {

                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('s3');

                return [
                    '_id' => (string) $group->_id,
                    'name' => $group->name,

                    'mentor' => $group->mentor ? [
                        '_id' => (string) $group->mentor->_id,
                        'name' => $group->mentor->name,
                        'avatar' => $group->mentor->avatar,
                        'avatar_url' => $group->mentor->avatar
                            ? $disk->url($group->mentor->avatar)
                            : null,
                    ] : null,

                    'paths' => $group->paths->map(function ($path) {
                        return [
                            '_id' => (string) $path->_id,
                            'name' => $path->name,
                            'modules' => $path->modules->map(function ($module) {
                                return [
                                    '_id' => (string) $module->_id,
                                    'title' => $module->title,
                                ];
                            }),
                        ];
                    }),
                ];

            });

        return Inertia::render('Admin/Course/Builder', [

            'course' => [
                '_id' => (string) $course->_id,
                'title' => $course->title,
                'slug' => $course->slug,
                'basic_paths' => $basicPaths,
                'career_groups' => $careerGroups,

            ],
            'badges' => LevelBadge::orderBy('order')->get()->map(function ($b) {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('s3');

                return [
                    'order' => (int) $b->order,
                    'icon' => $b->icon,
                    'icon_url' => $b->icon
                        ? $disk->url($b->icon)
                        : null,
                ];
            }),

            'mentors' => User::where('role', 'mentor')->get()->map(fn ($m) => [
                '_id' => (string) $m->_id,
                'name' => $m->name,
            ]),

        ]);

    }

    public function storeCourse(
        StoreCourseRequest $request,
        CreateCourseAction $action
    ) {

        $course = $action->execute($request->validated());

        return redirect()->route('admin.courses.builder', $course->slug);

    }

    public function storeCareerGroup(
        StoreCareerGroupRequest $request,
        CreateCareerGroupAction $action
    ) {

        $action->execute($request->validated());

        $course = Course::find($request->course_id);

        return redirect()->route('admin.courses.builder', $course->slug);

    }

    public function storePath(
        StorePathRequest $request,
        AdminCreatePathAction $action
    ) {
        $data = $request->validated();

        if (! empty($data['career_group_id'])) {
            $group = CareerGroup::findOrFail($data['career_group_id']);
            $this->authorize('update', $group);
        }

        $action->execute($data);

        $course = Course::findOrFail($data['course_id']);

        return redirect()->route('admin.courses.builder', $course->slug);
    }

    public function storeModule(
        StoreModuleRequest $request,
        CreateModuleAction $action
    ) {

        $action->execute($request->validated());

        return redirect()->back();

    }
}
