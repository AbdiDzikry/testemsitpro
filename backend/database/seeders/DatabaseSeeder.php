<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin123@email.com',
            'password' => bcrypt('admin123'),
        ]);

        $categories = [
            Category::create(['name' => 'Elektronik']),
            Category::create(['name' => 'Pakaian Pria & Wanita']),
            Category::create(['name' => 'Peralatan Rumah Tangga']),
            Category::create(['name' => 'Alat Tulis Kantor']),
            Category::create(['name' => 'Kesehatan & Perawatan']),
        ];

        $faker = \Faker\Factory::create('id_ID');
        for ($i = 1; $i <= 50; $i++) {
            $cat = $categories[array_rand($categories)];
            Product::create([
                'category_id' => $cat->id,
                'name' => ucwords($faker->words(rand(2, 3), true)),
                'stock' => $faker->numberBetween(5, 500),
                'price' => $faker->numberBetween(10, 5000) * 1000,
            ]);
        }
    }
}
