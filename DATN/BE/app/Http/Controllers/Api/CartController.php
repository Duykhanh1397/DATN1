<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Lấy giỏ hàng của người dùng hiện tại (Chỉ user tự xem giỏ hàng của mình)
     */
    public function index()
    {
        $cart = Cart::with('items.variant')->where('user_id', Auth::id())->first();

        if (!$cart) {
            return response()->json(['message' => 'Giỏ hàng trống'], 200);
        }

        return response()->json($cart);
    }

    /**
     * Quản trị viên có thể lấy danh sách tất cả giỏ hàng (Chỉ Admin)
     */
    public function getAllCarts()
    {
        if (Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền truy cập'], 403);
        }

        $carts = Cart::with('items')->get();

        return response()->json($carts);
    }

    /**
     * Xóa giỏ hàng (Chỉ chủ sở hữu hoặc Admin)
     */
    public function destroy($cartId)
    {
        // Tìm giỏ hàng theo ID
        $cart = Cart::findOrFail($cartId);

        // Chỉ Admin hoặc chủ sở hữu mới được phép xóa
        if (Auth::id() !== $cart->user_id && Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Bạn không có quyền xóa giỏ hàng này'], 403);
        }

        // Tiến hành xóa giỏ hàng
        $cart->delete();

        return response()->json(['message' => 'Giỏ hàng đã được xóa thành công'], 200);
    }
}