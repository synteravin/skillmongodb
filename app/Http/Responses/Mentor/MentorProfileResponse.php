<?php

namespace App\Http\Responses\Mentor;

use App\Models\User;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class MentorProfileResponse
{
    /**
     * Format a mentor's profile payload.
     */
    public static function make(User $mentor, array $statsData = []): array
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        $avatarUrl = null;
        if ($mentor->avatar) {
            $avatarUrl = str_starts_with($mentor->avatar, 'http')
                ? $mentor->avatar
                : $disk->url($mentor->avatar);
        }

        return [
            '_id' => (string) $mentor->_id,
            'name' => $mentor->name,
            'username' => $mentor->username,
            'email' => $mentor->email,
            'avatar' => $avatarUrl,
            'role' => $mentor->role,

            // Profile fields
            'profession' => $mentor->profession ?? '',
            'linkedin' => $mentor->linkedin ?? '',
            'description' => $mentor->description ?? '',
            'user_experience' => $mentor->user_experience ?? '',

            // Embedded lists
            'work_experiences' => is_array($mentor->work_experiences) ? $mentor->work_experiences : [],
            'educations' => is_array($mentor->educations) ? $mentor->educations : [],

            // Dynamic Stats & Relational Data
            'career_groups' => $statsData['career_groups'] ?? [],
            'stats' => $statsData['stats'] ?? [
                'total_career_groups' => 0,
                'total_students' => 0,
            ],
        ];
    }
}
