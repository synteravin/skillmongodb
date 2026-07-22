<?php

namespace App\Services\Module;

use App\Models\ModuleContent;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class ModuleContentService
{
    /**
     * CREATE MULTIPLE CONTENTS
     */
    public function createContents($module, array $contents)
    {
        $lastOrder = ModuleContent::where('module_id', $module->_id)->max('order') ?? 0;

        foreach ($contents as $index => $item) {

            $contentData = $this->buildContentData($item);

            ModuleContent::create([
                'module_id' => $module->_id,
                'type' => $item['type'],
                'order' => $lastOrder + $index + 1,
                'content' => $contentData,
            ]);
        }
    }

    /**
     * CREATE SINGLE CONTENT
     */
    public function createSingle($module, array $data)
    {
        $order = ModuleContent::where('module_id', $module->_id)->max('order') ?? 0;

        $contentData = $this->buildContentData($data);

        return ModuleContent::create([
            'module_id' => $module->_id,
            'type' => $data['type'],
            'order' => $order + 1,
            'content' => $contentData,
        ]);
    }

    /**
     * 🔥 CORE LOGIC (NO DUPLICATE)
     */
    private function buildContentData(array $item): array
    {
        $type = $item['type'];
        $file = $item['file'] ?? null;

        // ================= TEXT =================
        if ($type === 'text') {
            return [
                'title' => $item['title'] ?? null,
                'description' => $item['description'] ?? null,
            ];
        }

        // ================= YOUTUBE =================
        if ($type === 'youtube') {
            return [
                'url' => $item['url'] ?? null,
            ];
        }

        // ================= FILE BASED =================
        if ($file) {

            if ($type === 'image' && ! str_starts_with($file->getMimeType(), 'image')) {
                throw new \Exception('Invalid image file');
            }

            if ($type === 'video' && ! str_starts_with($file->getMimeType(), 'video')) {
                throw new \Exception('Invalid video file');
            }

            $folder = match ($type) {
                'image' => 'modules/images',
                'video' => 'modules/videos',
                default => 'modules/files',
            };

            $name = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $ext = $file->getClientOriginalExtension();

            $filename = \Str::slug($name).'-'.time().'.'.$ext;

            $path = $file->storeAs($folder, $filename, 's3');

            /** @var FilesystemAdapter $disk */
            $disk = Storage::disk('s3');

            return [
                'url' => $disk->url($path),
                'path' => $path,
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
            ];
        }

        return [];
    }
}
