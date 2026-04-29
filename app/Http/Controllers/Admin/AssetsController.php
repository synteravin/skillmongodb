<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rank;
use App\Models\Character;
use App\Models\LevelBadge;
use Inertia\Inertia;

class AssetsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Assets/Index', [
            'stats' => [
                'ranks' => Rank::count(),
                'characters' => Character::count(),
                'badges' => LevelBadge::count(),
            ],
        ]);
    }
}