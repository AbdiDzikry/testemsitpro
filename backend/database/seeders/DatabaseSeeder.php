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

        $productNames = [
            'Elektronik' => ['Laptop Asus ROG', 'Smartphone Samsung Galaxy', 'TV LED LG 32 inch', 'Mouse Wireless Logitech', 'Keyboard Mekanikal Rexus', 'Monitor Dell 4K', 'Smartwatch Apple', 'Tablet iPad Pro', 'Earphone TWS Sony', 'Powerbank Anker 10000mAh'],
            'Pakaian Pria & Wanita' => ['Kemeja Flanel Uniqlo', 'Kaos Polos Cotton Combed', 'Celana Jeans Levi\'s', 'Jaket Denim Pria', 'Gaun Pesta Wanita', 'Rok Lipit Korea', 'Sweater Rajut Halus', 'Sepatu Sneakers Vans', 'Jas Formal Hitam', 'Blus Wanita Lengan Panjang'],
            'Peralatan Rumah Tangga' => ['Kipas Angin Miyako', 'Rice Cooker Philips', 'Blender Panasonic', 'Setrika Listrik Maspion', 'Vacuum Cleaner Sharp', 'Mesin Cuci LG 8kg', 'Kulkas Polytron 2 Pintu', 'Microwave Samsung', 'Kompor Gas Rinnai', 'Dispenser Air Cosmos'],
            'Alat Tulis Kantor' => ['Kertas HVS A4 Sidu', 'Pulpen Gel Kenko', 'Pensil 2B Faber-Castell', 'Buku Catatan Joyko', 'Stapler Max', 'Gunting Kertas Joyko', 'Lem Kertas Kenko', 'Spidol Papan Tulis Snowman', 'Map Folder Plastik', 'Kalkulator Casio'],
            'Kesehatan & Perawatan' => ['Sabun Mandi Cair Biore', 'Sampo Anti Ketombe Clear', 'Sikat Gigi Pepsodent', 'Pasta Gigi Sensodyne', 'Deodorant Rexona', 'Vitamin C Enervon-C', 'Masker Wajah Wardah', 'Body Lotion Vaseline', 'Hand Sanitizer Carex', 'Minyak Angin FreshCare']
        ];

        $faker = \Faker\Factory::create('id_ID');
        
        foreach ($categories as $cat) {
            // Pick the array of names for this category
            $names = $productNames[$cat->name];
            
            // Generate 10 products per category
            foreach ($names as $name) {
                Product::create([
                    'category_id' => $cat->id,
                    'name' => $name,
                    'stock' => $faker->numberBetween(5, 500),
                    'price' => $faker->numberBetween(10, 300) * 10000,
                ]);
            }
        }
    }
}
