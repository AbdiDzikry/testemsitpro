<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DashboardController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products/export', [ProductController::class, 'export']);
    Route::apiResource('products', ProductController::class);
});
