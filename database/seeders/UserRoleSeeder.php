<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         User::firstOrCreate(
            ['email' => 'admin@skillmongo.com'],
            [
                'name' => 'Admin Root',
                'password' => Hash::make('SkillVentura123!'),
                'role' => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'mentor@skillmongo.com'],
            [
                'name' => 'Mentor Sample',
                'password' => Hash::make('MentorVentura123!'),
                'role' => 'mentor',
            ]
        );
    }
}
