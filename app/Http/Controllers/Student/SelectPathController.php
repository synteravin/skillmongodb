<?php

namespace App\Http\Controllers\Student;

use App\Actions\Path\SelectPathAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Path\SelectPathRequest;
use App\Models\Path;
use Illuminate\Support\Facades\Auth;

class SelectPathController extends Controller
{
    public function __invoke(
        SelectPathRequest $request,
        Path $path,
        SelectPathAction $action
    ) {
        $this->authorize('select', $path);

        $action->execute(Auth::User(), $path);

        return back()->with('success', 'Path selected');
    }
}
