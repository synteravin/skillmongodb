<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Path;
use App\Actions\Path\SelectPathAction;
use App\Http\Requests\Path\SelectPathRequest;

class SelectPathController extends Controller
{
    public function __invoke(
        SelectPathRequest $request,
        Path $path,
        SelectPathAction $action
    ) {
        $this->authorize('select', $path);

        $action->execute(auth()->user(), $path);

        return back()->with('success', 'Path selected');
    }
}