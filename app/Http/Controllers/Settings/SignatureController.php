<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Services\CertificateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SignatureController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/signature');
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $signatureData = null;
        $extension = 'png';

        if ($request->hasFile('signature_file')) {
            $request->validate([
                'signature_file' => 'required|image|mimes:png,jpg,jpeg,webp|max:2048',
            ]);

            $file = $request->file('signature_file');
            if ($file) {
                $signatureData = file_get_contents($file->getRealPath());
                $extension = strtolower($file->getClientOriginalExtension());
                if ($extension === 'jpeg') {
                    $extension = 'jpg';
                }
            }
        } else {
            $request->validate([
                'signature' => 'required|string',
            ]);

            $input = $request->input('signature');
            if (preg_match('/^data:image\/(\w+);base64,/', $input, $type)) {
                $rawBase64 = substr($input, strpos($input, ',') + 1);
                $ext = strtolower($type[1]);

                if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
                    return back()->withErrors(['signature' => 'Invalid image type.']);
                }

                $decoded = base64_decode($rawBase64);
                if ($decoded === false) {
                    return back()->withErrors(['signature' => 'Base64 decode failed.']);
                }

                $signatureData = $decoded;
                $extension = $ext === 'jpeg' ? 'jpg' : $ext;
            } else {
                return back()->withErrors(['signature' => 'Invalid base64 format.']);
            }
        }

        if (! $signatureData) {
            return back()->withErrors(['signature' => 'No signature content received.']);
        }

        $filename = 'signatures/'.$user->_id.'_'.Str::random(10).'.'.$extension;

        // Delete old signature if exists
        if ($user->signature_path && Storage::disk('s3')->exists($user->signature_path)) {
            Storage::disk('s3')->delete($user->signature_path);
        }

        Storage::disk('s3')->put($filename, $signatureData, [
            'visibility' => 'private',
        ]);

        $user->update([
            'signature_path' => $filename,
        ]);

        (new CertificateService)->regenerateAllForUser($user);

        return back()->with('success', 'Signature updated successfully.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->signature_path && Storage::disk('s3')->exists($user->signature_path)) {
            Storage::disk('s3')->delete($user->signature_path);

            $user->update([
                'signature_path' => null,
            ]);

            (new CertificateService)->regenerateAllForUser($user);
        }

        return back()->with('success', 'Signature removed successfully.');
    }
}
