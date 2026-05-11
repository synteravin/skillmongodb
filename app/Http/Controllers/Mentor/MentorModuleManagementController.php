<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use App\Models\CareerGroup;
use App\Models\Path;
use Inertia\Inertia;

class MentorModuleManagementController extends Controller
{
    public function index(CareerGroup $group, Path $path)
    {
        $this->authorize('view', $group);

        abort_unless(
            (string) $path->career_group_id === (string) $group->_id,
            404
        );

        $path->load([
            'quiz',
            'modules.contents',
            'modules.quiz',
        ]);

        return Inertia::render('Mentor/Module/Builder', [
            'group' => [
                'id' => (string) $group->_id,
                'name' => $group->name,
            ],

            'path' => [
                'id' => (string) $path->_id,
                'name' => $path->name,
                'description' => $path->description,

                'quiz' => $path->quiz ? [
                    'id' => (string) $path->quiz->_id,
                ] : null,

                'modules' => $path->modules->map(function ($module) {
                    return [
                        'id' => (string) $module->_id,
                        'title' => $module->title,
                        'type' => $module->type,
                        'order' => $module->order,

                        'contents' => $module->contents->map(function ($content) {
                            return [
                                'id' => (string) $content->_id,
                                'type' => $content->type,
                                'order' => $content->order,
                                'content' => $content->content,
                            ];
                        }),
                    ];
                }),
            ],
        ]);
    }
}