<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Character;
use App\Models\LevelBadge;
use App\Models\Rank;
use Inertia\Inertia;

class AssetsController extends Controller
{
    public function index()
    {
        $ranks = Rank::orderBy('order')->get()->map(fn ($r) => [
            'id' => (string) $r->_id,
            '_id' => (string) $r->_id,
            'name' => $r->name,
            'image' => $r->image,
            'image_url' => $r->image_url,
            'order' => $r->order,
        ]);

        $characters = Character::latest()->get()->map(fn ($c) => [
            'id' => (string) $c->_id,
            '_id' => (string) $c->_id,
            'name' => $c->name,
            'tagline' => $c->tagline,
            'avatar' => $c->avatar,
            'avatar_url' => $c->avatar_url,
            'backstory' => $c->backstory,
            'quote' => $c->quote,
            'character_type' => $c->character_type,
            'abilities' => $c->abilities,
            'guide_power' => $c->guide_power,
            'system_bonus' => $c->system_bonus,
            'cosmetic_bonus' => $c->cosmetic_bonus,
        ]);

        $badges = LevelBadge::orderBy('order')->get()->map(fn ($b) => [
            'id' => (string) $b->_id,
            '_id' => (string) $b->_id,
            'name' => $b->name,
            'icon' => $b->icon,
            'icon_url' => $b->icon_url,
            'order' => $b->order,
        ]);

        return Inertia::render('Admin/Assets/Index', [
            'stats' => [
                'ranks' => $ranks->count(),
                'characters' => $characters->count(),
                'badges' => $badges->count(),
            ],
            'ranks' => $ranks,
            'characters' => $characters,
            'badges' => $badges,
        ]);
    }
}
