<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateDesign;
use App\Services\CertificateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificateDesignController extends Controller
{
    /**
     * Store a new custom certificate background design & optional logo.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'background' => 'required|image|mimes:png,jpg,jpeg,webp|max:5120',
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,webp,svg|max:2048',
        ]);

        $backgroundPath = $request->file('background')->store('certificates/templates', 's3');

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('certificates/logos', 's3');
        }

        $isFirst = CertificateDesign::count() === 0;

        CertificateDesign::create([
            'title' => $validated['title'],
            'background_path' => $backgroundPath,
            'logo_path' => $logoPath,
            'is_active' => $isFirst,
        ]);

        return redirect()
            ->route('admin.assets.index')
            ->with('success', 'Desain sertifikat berhasil diunggah.');
    }

    /**
     * Set the specified certificate design as active.
     */
    public function setActive(string $id): RedirectResponse
    {
        $design = CertificateDesign::findOrFail($id);

        CertificateDesign::query()->update(['is_active' => false]);
        $design->update(['is_active' => true]);

        (new CertificateService)->regenerateAllForUser();

        return redirect()
            ->route('admin.assets.index')
            ->with('success', 'Desain sertifikat aktif berhasil diperbarui.');
    }

    /**
     * Remove the specified certificate design.
     */
    public function destroy(string $id): RedirectResponse
    {
        $design = CertificateDesign::findOrFail($id);
        $wasActive = (bool) $design->is_active;

        if ($design->background_path) {
            Storage::disk('s3')->delete($design->background_path);
        }

        if ($design->logo_path) {
            Storage::disk('s3')->delete($design->logo_path);
        }

        $design->delete();

        if ($wasActive) {
            $nextActive = CertificateDesign::latest()->first();
            if ($nextActive) {
                $nextActive->update(['is_active' => true]);
            }
        }

        return redirect()
            ->route('admin.assets.index')
            ->with('success', 'Desain sertifikat berhasil dihapus.');
    }
}
