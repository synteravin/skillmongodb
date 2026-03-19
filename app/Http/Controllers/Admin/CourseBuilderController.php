<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Actions\Course\CreateCourseAction;
use App\Actions\CareerGroup\CreateCareerGroupAction;
use App\Actions\Path\CreatePathAction;
use App\Actions\Module\CreateModuleAction;

use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\CareerGroup\StoreCareerGroupRequest;
use App\Http\Requests\Path\StorePathRequest;
use App\Http\Requests\Module\StoreModuleRequest;

use App\Models\Course;

use Inertia\Inertia;

class CourseBuilderController extends Controller
{

    public function index()
    {

        $courses = Course::latest()->get();

        return Inertia::render('Admin/Course/Index', [
            'courses' => $courses
        ]);

    }

    public function show(Course $course)
    {

        $course->load([
            'paths.modules',
            'careerGroups.paths.modules'
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
                            'title' => $module->title
                        ];
                    })
                ];

            });

        $careerGroups = $course->careerGroups
            ->values()
            ->map(function ($group) {

                return [
                    '_id' => (string) $group->_id,
                    'name' => $group->name,
                    'paths' => $group->paths->map(function ($path) {

                        return [
                            '_id' => (string) $path->_id,
                            'name' => $path->name,
                            'modules' => $path->modules->map(function ($module) {
                                return [
                                    '_id' => (string) $module->_id,
                                    'title' => $module->title
                                ];
                            })
                        ];

                    })
                ];

            });

        return Inertia::render('Admin/Course/Builder', [

            'course' => [
                '_id' => (string) $course->_id,
                'title' => $course->title,
                'slug' => $course->slug,
                'basic_paths' => $basicPaths,
                'career_groups' => $careerGroups
            ]

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
        CreatePathAction $action
    ) {

        $action->execute($request->validated());

        $course = Course::find($request->course_id);

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