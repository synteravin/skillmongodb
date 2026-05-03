<?php

namespace App\Http\Controllers\Student;

use App\Actions\Path\CompletePathAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Path\CompletePathRequest;
use App\Models\Path;

class CompletePathController extends Controller
{
    public function __invoke(
        CompletePathRequest $request,
        Path $path,
        CompletePathAction $action
    ) {
        $this->authorize('complete', $path);

        $action->execute(auth()->user(), $path);

        return back()->with('success', 'Path completed');
    }
}
