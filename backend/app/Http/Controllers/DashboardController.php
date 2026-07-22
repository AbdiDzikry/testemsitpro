<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class DashboardController extends Controller
{
    public function stats()
    {
        $categories = Category::withCount('products')->get();
        return response()->json($categories);
    }
}
