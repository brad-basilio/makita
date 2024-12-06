<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'email' => 'root@mundoweb.pe'
        ], [
            'name' => 'Root',
            'lastname' => 'MundoWeb',
            'password' => 'r00tme'
        ])->assignRole('Root');
        User::updateOrCreate([
            'email' => 'admin@mundoweb.pe'
        ], [
            'name' => 'Admin',
            'lastname' => 'MundoWeb',
            'password' => '12345678'
        ])->assignRole('Admin');
        User::updateOrCreate([
            'email' => 'admin@escuelatrasciende.com'
        ], [
            'name' => 'Admin',
            'lastname' => 'Trasciende',
            'password' => 'K@0r1_admin'
        ])->assignRole('Admin');
    }
}
