<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = \App\Models\Notification::latest()->take(10)->get();
        return response()->json($notifications);
    }
}
