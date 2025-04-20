<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class NewUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'email' => 'salafabulosa@gmail.com'
        ], [
            'name' => 'Admin',
            'lastname' => 'SalaFabulosa',
            'password' => '5@l4F@bul054'
        ])->assignRole('Admin');
    }
}
