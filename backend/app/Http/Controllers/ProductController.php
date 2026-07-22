<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Exports\ProductsExport;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::select('products.*', 'categories.name as category_name')
                        ->leftJoin('categories', 'products.category_id', '=', 'categories.id');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('products.name', 'like', "%{$search}%");
        }

        if ($request->has('category_id') && $request->category_id != '') {
            $query->where('products.category_id', $request->category_id);
        }

        $sortField = $request->input('sort_field', 'id');
        if (in_array($sortField, ['id', 'name', 'stock', 'price'])) {
            $sortField = 'products.' . $sortField;
        }
        
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $perPage = $request->input('per_page', 10);
        
        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($validated);
        Notification::create(['message' => "New product added: {$product->name}"]);
        return response()->json($product->load('category'), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);
        Notification::create(['message' => "Product updated: {$product->name}"]);
        return response()->json($product->load('category'));
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function export()
    {
        return Excel::download(new ProductsExport, 'products.xlsx');
    }
}
