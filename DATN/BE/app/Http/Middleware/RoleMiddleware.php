<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $role)
    {
        // Nếu chưa đăng nhập, trả về lỗi 401 Unauthorized
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized - Hãy đăng nhập trước'], 401);
        }

        // Nếu không phải Admin, trả về lỗi 403 Forbidden
        if (Auth::user()->role !== $role) {
            return response()->json(['message' => 'Bị cấm - Bạn không có quyền truy cập '], 403);
        }

        return $next($request);
    }
}
