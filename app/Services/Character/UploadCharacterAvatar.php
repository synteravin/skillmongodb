<?php

namespace App\Services\Character;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadCharacterAvatar
{
    public function upload(UploadedFile $file): string
    {
        $filename = 'char_'.Str::uuid().'.'.$file->extension();

        return Storage::disk('s3')->putFileAs(
            'characters',
            $file,
            $filename,
            'public'
        );
    }
}
