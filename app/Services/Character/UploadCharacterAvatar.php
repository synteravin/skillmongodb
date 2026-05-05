<?php

namespace App\Services\Character;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class UploadCharacterAvatar
{
    public function upload(UploadedFile $file): string
    {
        $filename = 'char_' . Str::uuid() . '.' . $file->getClientOriginalExtension();

        return Storage::disk('s3')->putFileAs(
            'characters',
            $file,
            $filename
        );
    }
}
