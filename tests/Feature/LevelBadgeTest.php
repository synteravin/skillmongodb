<?php

namespace Tests\Feature;

use App\Models\LevelBadge;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LevelBadgeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default' => 'mongodb']);
        Storage::fake('s3');
    }

    protected function tearDown(): void
    {
        LevelBadge::truncate();
        User::where('role', 'admin')->delete();
        parent::tearDown();
    }

    public function test_allows_admin_to_visit_the_badges_index_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        LevelBadge::create(['name' => 'Badge A', 'icon' => 'path/a.png', 'order' => 1]);
        LevelBadge::create(['name' => 'Badge B', 'icon' => 'path/b.png', 'order' => 2]);

        $response = $this->actingAs($admin)->get('/admin/assets/badges');

        $response->assertOk();
    }

    public function test_allows_admin_to_visit_the_badges_create_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/assets/badges/create');

        $response->assertOk();
    }

    public function test_stores_a_badge_and_auto_assigns_order_number(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        LevelBadge::create(['name' => 'Badge A', 'icon' => 'path/a.png', 'order' => 5]);

        $response = $this->actingAs($admin)->post('/admin/assets/badges', [
            'name' => 'New Badge',
            'icon' => UploadedFile::fake()->image('icon.png'),
        ]);

        $response->assertRedirect(route('admin.assets.badges.index'));

        $badge = LevelBadge::where('name', 'New Badge')->first();
        $this->assertNotNull($badge);
        $this->assertEquals(6, $badge->order);
    }

    public function test_allows_admin_to_visit_the_badge_edit_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $badge = LevelBadge::create(['name' => 'Badge Edit', 'icon' => 'path.png', 'order' => 1]);
        $id = $badge->_id ?? $badge->id;

        $response = $this->actingAs($admin)->get("/admin/assets/badges/{$id}/edit");

        $response->assertOk();
    }

    public function test_updates_a_badge_without_changing_its_order(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $badge = LevelBadge::create(['name' => 'Original Name', 'icon' => 'path.png', 'order' => 3]);
        $id = $badge->_id ?? $badge->id;

        $response = $this->actingAs($admin)->put("/admin/assets/badges/{$id}", [
            'name' => 'Updated Name',
            'icon' => null,
        ]);

        $response->assertRedirect(route('admin.assets.badges.index'));

        $badge->refresh();
        $this->assertEquals('Updated Name', $badge->name);
        $this->assertEquals(3, $badge->order);
    }

    public function test_can_reorder_badges(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $badge1 = LevelBadge::create(['name' => 'Badge A', 'icon' => 'path/a.png', 'order' => 1]);
        $badge2 = LevelBadge::create(['name' => 'Badge B', 'icon' => 'path/b.png', 'order' => 2]);

        $id1 = $badge1->_id ?? $badge1->id;
        $id2 = $badge2->_id ?? $badge2->id;

        $response = $this->actingAs($admin)->post('/admin/assets/badges/reorder', [
            'badges' => [
                ['id' => $id1, 'order' => 2],
                ['id' => $id2, 'order' => 1],
            ],
        ]);

        $response->assertRedirect();

        $badge1->refresh();
        $badge2->refresh();

        $this->assertEquals(2, $badge1->order);
        $this->assertEquals(1, $badge2->order);
    }

    public function test_can_delete_a_badge(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $badge = LevelBadge::create(['name' => 'Delete Me', 'icon' => 'path.png', 'order' => 1]);
        $id = $badge->_id ?? $badge->id;

        $response = $this->actingAs($admin)->delete("/admin/assets/badges/{$id}");

        $response->assertRedirect(route('admin.assets.badges.index'));
        $this->assertNull(LevelBadge::find($id));
    }
}
