<?php
require __DIR__ . '/../bootstrap/providers.php';
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$pngPath = public_path('images/Sertifikat Course LMS SkillVentura.png');
$jpgPath = public_path('images/Sertifikat Course LMS SkillVentura.jpg');

if (file_exists($pngPath)) {
    $img = imagecreatefrompng($pngPath);
    // Convert to JPG at 70% quality (great compression, still looks extremely sharp)
    imagejpeg($img, $jpgPath, 70);
    imagedestroy($img);
    echo "Successfully compressed! PNG: " . round(filesize($pngPath) / 1024, 2) . " KB, JPG: " . round(filesize($jpgPath) / 1024, 2) . " KB\n";
} else {
    echo "PNG file not found!\n";
}
