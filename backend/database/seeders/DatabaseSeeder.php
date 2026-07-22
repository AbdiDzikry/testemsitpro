<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        \App\Models\User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin123@email.com',
            'password' => bcrypt('admin123'),
        ]);

        $elektronik = \App\Models\Category::create(['name' => 'Elektronik']);
        $pakaian = \App\Models\Category::create(['name' => 'Pakaian']);

        \App\Models\Product::create(['category_id' => $elektronik->id, 'name' => 'Laptop Asus', 'stock' => 10, 'price' => 15000000]);
        \App\Models\Product::create(['category_id' => $elektronik->id, 'name' => 'Smartphone Samsung', 'stock' => 20, 'price' => 8000000]);
        \App\Models\Product::create(['category_id' => $pakaian->id, 'name' => 'Kemeja Pria', 'stock' => 50, 'price' => 200000]);
    }
}
