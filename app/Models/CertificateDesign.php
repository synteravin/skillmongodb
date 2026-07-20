<?php

namespace App\Models;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use MongoDB\Laravel\Eloquent\Model;

class CertificateDesign extends Model
{
    protected $connection = 'mongodb';

    protected $collection = 'certificate_designs';

    protected $fillable = [
        'title',
        'background_path',
        'logo_path',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['background_url', 'logo_url'];

    public function getBackgroundUrlAttribute(): ?string
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        return $this->background_path ? $disk->url($this->background_path) : null;
    }

    public function getLogoUrlAttribute(): ?string
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        return $this->logo_path ? $disk->url($this->logo_path) : null;
    }
}
