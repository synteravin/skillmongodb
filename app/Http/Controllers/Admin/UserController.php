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

    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $query = User::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(25)->withQueryString()->through(function ($user) {
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('s3');

            return [
                '_id' => (string) $user->_id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar
                    ? $disk->url($user->avatar)
                    : null,
            ];
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only('search'),
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
            'username' => ['sometimes', 'string', 'unique:users,username,'.$user->_id.',_id'],
            'email' => ['sometimes', 'email', 'unique:users,email,'.$user->_id.',_id'],
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

    public function show(User $user, \App\Services\Admin\UserDetailService $userDetailService)
    {
        $this->authorize('view', $user);

        $details = [];
        if ($user->role === 'student') {
            $details = $userDetailService->getStudentDetails($user);
        } elseif ($user->role === 'mentor') {
            $details = $userDetailService->getMentorDetails($user);
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('s3');
        $userData = [
            '_id' => (string) $user->_id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'created_at' => $user->created_at,
            'avatar' => $user->avatar ? $disk->url($user->avatar) : null,
        ];

        return Inertia::render('Admin/Users/Show', [
            'user' => $userData,
            'details' => $details,
        ]);
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
