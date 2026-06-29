<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Mentor\UpdateMentorProfileAction;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Admin\UserDetailService;
use Illuminate\Filesystem\FilesystemAdapter;
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

        $filters = $request->only(['search', 'role']);

        $users = User::query()
            ->filter($filters)
            ->latest()
            ->paginate(25)
            ->withQueryString()
            ->through(function ($user) {
                /** @var FilesystemAdapter $disk */
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

        $totalUsers = User::count();
        $studentsCount = User::where('role', 'student')->count();
        $mentorsCount = User::where('role', 'mentor')->count();
        $adminsCount = User::where('role', 'admin')->count();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'stats' => [
                'total' => $totalUsers,
                'students' => $studentsCount,
                'mentors' => $mentorsCount,
                'admins' => $adminsCount,
            ],
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

    public function update(Request $request, User $user, UpdateMentorProfileAction $updateMentorProfileAction)
    {
        $this->authorize('update', $user);

        $rules = [
            'name' => ['sometimes', 'string'],
            'username' => ['sometimes', 'string', 'unique:users,username,'.$user->_id.',_id'],
            'email' => ['sometimes', 'email', 'unique:users,email,'.$user->_id.',_id'],
            'role' => ['sometimes', 'in:admin,mentor,student'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];

        if ($user->isMentor()) {
            $rules = array_merge($rules, [
                'profession' => ['nullable', 'string', 'max:255'],
                'linkedin' => ['nullable', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'user_experience' => ['nullable', 'string', 'max:255'],
                'work_experiences' => ['nullable', 'array'],
                'work_experiences.*.jabatan' => ['nullable', 'string', 'max:255'],
                'work_experiences.*.perusahaan' => ['nullable', 'string', 'max:255'],
                'work_experiences.*.tahun_mulai' => ['nullable', 'string', 'max:50'],
                'work_experiences.*.tahun_selesai' => ['nullable', 'string', 'max:50'],
                'work_experiences.*.deskripsi' => ['nullable', 'string'],
                'educations' => ['nullable', 'array'],
                'educations.*.gelar' => ['nullable', 'string', 'max:255'],
                'educations.*.prodi' => ['nullable', 'string', 'max:255'],
                'educations.*.universitas' => ['nullable', 'string', 'max:255'],
                'educations.*.tahun_mulai' => ['nullable', 'string', 'max:50'],
                'educations.*.tahun_selesai' => ['nullable', 'string', 'max:50'],
                'educations.*.spesialisasi' => ['nullable', 'string'],
            ]);
        }

        $data = $request->validate($rules);

        if ($user->isMentor()) {
            $data['name'] = $data['name'] ?? $user->name;
            $data['email'] = $data['email'] ?? $user->email;
            $data['profession'] = $data['profession'] ?? $user->profession;
            $data['linkedin'] = $data['linkedin'] ?? $user->linkedin;
            $data['description'] = $data['description'] ?? $user->description;
            $data['user_experience'] = $data['user_experience'] ?? $user->user_experience;
            $data['work_experiences'] = $data['work_experiences'] ?? $user->work_experiences;
            $data['educations'] = $data['educations'] ?? $user->educations;
            $data['avatar'] = $request->file('avatar') ?? null;

            $updateMentorProfileAction->execute($user, $data);

            if ($request->filled('password')) {
                $user->update(['password' => $request->password]);
            }
            if ($request->filled('role')) {
                $user->update(['role' => $request->role]);
            }

            return back();
        }

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

    public function show(User $user, UserDetailService $userDetailService)
    {
        $this->authorize('view', $user);

        $details = [];
        if ($user->role === 'student') {
            $details = $userDetailService->getStudentDetails($user);
        } elseif ($user->role === 'mentor') {
            $details = $userDetailService->getMentorDetails($user);
        }

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');
        $userData = [
            '_id' => (string) $user->_id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'created_at' => $user->created_at,
            'avatar' => $user->avatar ? $disk->url($user->avatar) : null,
            'profession' => $user->profession ?? '',
            'linkedin' => $user->linkedin ?? '',
            'description' => $user->description ?? '',
            'user_experience' => $user->user_experience ?? '',
            'work_experiences' => is_array($user->work_experiences) ? $user->work_experiences : [],
            'educations' => is_array($user->educations) ? $user->educations : [],
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

    public function bulkDestroy(Request $request)
    {
        $this->authorize('delete', User::class);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'string'],
        ]);

        $currentUserId = (string) auth()->id();
        $targetIds = array_filter($validated['ids'], function ($id) use ($currentUserId) {
            return (string) $id !== $currentUserId;
        });

        if (! empty($targetIds)) {
            User::whereIn('_id', $targetIds)->delete();
        }

        return back()->with('success', 'Selected users deleted successfully.');
    }

    public function bulkRole(Request $request)
    {
        $this->authorize('update', User::class);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'string'],
            'role' => ['required', 'in:admin,mentor,student'],
        ]);

        User::whereIn('_id', $validated['ids'])->update(['role' => $validated['role']]);

        return back()->with('success', 'Selected users role updated successfully.');
    }
}
