<?php

namespace Tests\Feature\Admin;

use App\Models\CertificateDesign;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CertificateDesignTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
        CertificateDesign::truncate();
    }

    private function createAdmin(): User
    {
        return User::create([
            'name' => 'Admin Test',
            'email' => 'admin_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    public function test_admin_can_upload_new_certificate_design(): void
    {
        Storage::fake('s3');
        $admin = $this->createAdmin();

        $file = UploadedFile::fake()->image('cert_bg.png', 1920, 1080);

        $response = $this->actingAs($admin)->post('/admin/assets/certificate-designs', [
            'title' => 'Custom Design 2026',
            'background' => $file,
        ]);

        $response->assertRedirect(route('admin.assets.index'));

        $design = CertificateDesign::where('title', 'Custom Design 2026')->first();
        $this->assertNotNull($design);
        $this->assertTrue((bool) $design->is_active);
        $this->assertNotNull($design->background_path);

        Storage::disk('s3')->assertExists($design->background_path);
    }

    public function test_admin_can_set_certificate_design_as_active(): void
    {
        $admin = $this->createAdmin();

        $design1 = CertificateDesign::create([
            'title' => 'Design 1',
            'background_path' => 'certificates/templates/design1.png',
            'is_active' => true,
        ]);

        $design2 = CertificateDesign::create([
            'title' => 'Design 2',
            'background_path' => 'certificates/templates/design2.png',
            'is_active' => false,
        ]);

        $response = $this->actingAs($admin)->post("/admin/assets/certificate-designs/{$design2->_id}/active");

        $response->assertRedirect(route('admin.assets.index'));

        $this->assertFalse((bool) $design1->fresh()->is_active);
        $this->assertTrue((bool) $design2->fresh()->is_active);
    }

    public function test_admin_can_delete_certificate_design(): void
    {
        Storage::fake('s3');
        $admin = $this->createAdmin();

        $design = CertificateDesign::create([
            'title' => 'Design to Delete',
            'background_path' => 'certificates/templates/delete_me.png',
            'is_active' => false,
        ]);

        $response = $this->actingAs($admin)->delete("/admin/assets/certificate-designs/{$design->_id}");

        $response->assertRedirect(route('admin.assets.index'));
        $this->assertNull(CertificateDesign::find($design->_id));
    }

    public function test_non_admin_cannot_manage_certificate_designs(): void
    {
        $student = User::create([
            'name' => 'Student Test',
            'email' => 'student_'.uniqid().'@test.com',
            'password' => bcrypt('password'),
            'role' => 'student',
        ]);

        $response = $this->actingAs($student)->post('/admin/assets/certificate-designs', [
            'title' => 'Unauthorized Upload',
        ]);

        $response->assertForbidden();
    }
}
