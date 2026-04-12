<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Module\CompleteModuleRequest;
use App\Models\Module;
use App\Actions\Module\CompleteModuleAction;


class CompleteModuleController extends Controller
{
    public function __invoke(
        CompleteModuleRequest $request,
        Module $module,
        CompleteModuleAction $action
    ) {
        $this->authorize('complete', $module);

        $action->execute(auth()->user(), $module);

        return back()->with('success', 'Module completed');
    }
}
