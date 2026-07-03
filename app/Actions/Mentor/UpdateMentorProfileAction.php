<?php

namespace App\Actions\Mentor;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateMentorProfileAction
{
    /**
     * Execute the update action for the given user.
     */
    public function execute(User $user, array $data): User
    {
        /* ---------- HANDLES AVATAR S3 UPLOAD ---------- */
        if (isset($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
            // Delete old avatar from S3 if exists
            if ($user->avatar) {
                Storage::disk('s3')->delete($user->avatar);
            }

            // Upload new avatar
            $data['avatar'] = $data['avatar']->store('avatars', 's3');
        } else {
            // Keep existing avatar if not modified
            unset($data['avatar']);
        }

        // Format LinkedIn URL to be absolute if protocol is missing
        if (isset($data['linkedin']) && trim($data['linkedin']) !== '') {
            $linkedin = trim($data['linkedin']);
            if (! str_starts_with($linkedin, 'http://') && ! str_starts_with($linkedin, 'https://')) {
                $data['linkedin'] = 'https://'.$linkedin;
            } else {
                $data['linkedin'] = $linkedin;
            }
        }

        // Only update fields that are present in the request data
        $updateData = array_intersect_key($data, array_flip([
            'name',
            'username',
            'email',
            'profession',
            'linkedin',
            'description',
            'user_experience',
            'work_experiences',
            'educations',
            'avatar',
        ]));

        $user->update($updateData);

        return $user;
    }
}
