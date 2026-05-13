<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', User::class);

        $users = User::latest()->get()->map(function ($user) {
            return [
                '_id' => (string) $user->_id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar
                    ? Storage::disk('s3')->url($user->avatar)
                    : null,
            ];
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $data = $request->validate([
            'name' => ['required', 'string'],
            'username' => ['required', 'string', 'unique:users'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:6'],
            'role' => ['required', 'in:admin,mentor,student'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        /* ---------- UPLOAD AVATAR ---------- */

        $avatarPath = null;

        if ($request->hasFile('avatar')) {
            $avatarPath = $request
                ->file('avatar')
                ->store('avatars', 's3');
        }

        /* ---------- CREATE USER ---------- */

        User::create([
            'name' => $data['name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'],
            'avatar' => $avatarPath,
        ]);

        return back();
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $data = $request->validate([
            'name' => ['sometimes', 'string'],
            'username' => ['sometimes', 'string', 'unique:users,username,' . $user->_id . ',_id'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $user->_id . ',_id'],
            'role' => ['sometimes', 'in:admin,mentor,student'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        /* ---------- UPLOAD AVATAR ---------- */

        if ($request->hasFile('avatar')) {

            // hapus avatar lama
            if ($user->avatar) {
                Storage::disk('s3')->delete($user->avatar);
            }

            $data['avatar'] = $request
                ->file('avatar')
                ->store('avatars', 's3');
        }

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $user->update($data);

        return back();
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        if ((string) auth()->user()->_id === (string) $user->_id) {
            return back()->with('error', 'Tidak bisa hapus diri sendiri');
        }

        $user->delete();

        return back();
    }
}
