<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = \App\Models\Notification::latest()->take(50)->get();
        return response()->json($notifications);
    }

    public function markAsRead()
    {
        \App\Models\Notification::where('is_read', false)->update(['is_read' => true]);
        return response()->json(['message' => 'All marked as read']);
    }
}
