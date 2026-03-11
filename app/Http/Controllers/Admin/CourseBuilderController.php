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

        return inertia('Admin/Course/Index', [
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
            ->values();

        $careerGroups = $course->careerGroups->values();

        return Inertia::render('Admin/Course/Builder', [

            'course' => [
                '_id' => $course->_id,
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

        return response()->json([
            'message' => 'Course created',
            'data' => $course
        ]);
    }


    public function storeCareerGroup(
        StoreCareerGroupRequest $request,
        CreateCareerGroupAction $action
    ) {

        $group = $action->execute($request->validated());

        return response()->json([
            'message' => 'Career Group created',
            'data' => $group
        ]);
    }


    public function storePath(
        StorePathRequest $request,
        CreatePathAction $action
    ) {

        $path = $action->execute($request->validated());

        return response()->json([
            'message' => 'Path created',
            'data' => $path
        ]);
    }


    public function storeModule(
        StoreModuleRequest $request,
        CreateModuleAction $action
    ) {

        $module = $action->execute($request->validated());

        return response()->json([
            'message' => 'Module created',
            'data' => $module
        ]);
    }

}