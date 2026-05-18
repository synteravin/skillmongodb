<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SignatureController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'signature' => 'required|string', // Base64 string
        ]);

        $user = $request->user();
        $signatureData = $request->input('signature');

        // Extract base64 content
        if (preg_match('/^data:image\/(\w+);base64,/', $signatureData, $type)) {
            $signatureData = substr($signatureData, strpos($signatureData, ',') + 1);
            $type = strtolower($type[1]); // png, jpg, etc.

            if (! in_array($type, ['jpg', 'jpeg', 'png'])) {
                return back()->withErrors(['signature' => 'Invalid image type.']);
            }

            $signatureData = base64_decode($signatureData);

            if ($signatureData === false) {
                return back()->withErrors(['signature' => 'Base64 decode failed.']);
            }
        } else {
            return back()->withErrors(['signature' => 'Invalid base64 string.']);
        }

        $filename = 'signatures/'.$user->_id.'_'.Str::random(10).'.'.$type;

        // Optionally delete old signature if exists
        if ($user->signature_path && Storage::disk('s3')->exists($user->signature_path)) {
            Storage::disk('s3')->delete($user->signature_path);
        }

        Storage::disk('s3')->put($filename, $signatureData, [
            'visibility' => 'private', // Keep private for security
        ]);

        $user->update([
            'signature_path' => $filename,
        ]);

        return back()->with('success', 'Signature updated successfully.');
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        if ($user->signature_path && Storage::disk('s3')->exists($user->signature_path)) {
            Storage::disk('s3')->delete($user->signature_path);

            $user->update([
                'signature_path' => null,
            ]);
        }

        return back()->with('success', 'Signature removed successfully.');
    }
}
