<?php

namespace App\Services\Character;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class UploadCharacterAvatar
{
    public function upload(UploadedFile $file): string
    {
        $destination = public_path('images/characters');

        if (! is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        $filename = 'char_'.Str::uuid().'.'.$file->getClientOriginalExtension();

        $file->move($destination, $filename);

        return 'images/characters/'.$filename;
    }
}
