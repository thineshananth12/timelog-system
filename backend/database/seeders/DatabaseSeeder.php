<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::updateOrCreate(
            [
                'email' => 'testuser12@gmail.com',
            ],

            [
                'name' => 'Test User',
                'password' => bcrypt('123456')
            ]
        );
        User::updateOrCreate(
            [
                'email' => 'thineshananth12@gmail.com',
            ],

            [
                'name' => 'Thinesh Ananth',
                'password' => bcrypt('123456')
            ]
        );
        $this->call(ProjectSeeder::class);
    }
}
