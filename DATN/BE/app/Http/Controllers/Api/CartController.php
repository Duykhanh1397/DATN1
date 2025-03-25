<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart; 
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * 📌 Lấy giỏ hàng của người dùng hiện tại (Chỉ user tự xem giỏ hàng của mình)
     */
    public function index()
    {
        try {
            $cart = Cart::with('items.productVariant')->where('user_id', Auth::id())->first();

            if (!$cart) {
                return response()->json([
                    'status' => false,
                    'message' => 'Giỏ hàng trống',
                    'data' => []
                ], 200);
            }

            return response()->json([
                'status' => true,
                'message' => 'Lấy giỏ hàng thành công',
                'data' => $cart
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi lấy giỏ hàng');
        }
    }

    /**
     * 📌 Quản trị viên có thể lấy danh sách tất cả giỏ hàng (Chỉ Admin)
     */
    public function getAllCarts()
    {
        try {
            if (Auth::user()->role !== 'Admin') {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không có quyền truy cập'
                ], 403);
            }

            $carts = Cart::with('items.productVariant')->get();

            return response()->json([
                'status' => true,
                'message' => 'Danh sách tất cả giỏ hàng',
                'data' => $carts
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi lấy danh sách giỏ hàng');
        }
    }

    /**
     * 📌 Xóa giỏ hàng (Chỉ chủ sở hữu hoặc Admin)
     */
    public function destroy($cartId)
    {
        try {
            $cart = Cart::with('items')->findOrFail($cartId);

            if (Auth::id() !== $cart->user_id && Auth::user()->role !== 'Admin') {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không có quyền xóa giỏ hàng này'
                ], 403);
            }

            $cart->items()->delete();
            $cart->delete();

        return response()->json(['message' => 'Giỏ hàng đã được xóa thành công'], 200);
    }
}
}