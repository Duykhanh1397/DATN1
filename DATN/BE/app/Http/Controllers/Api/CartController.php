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

            return response()->json([
                'status' => true,
                'message' => 'Giỏ hàng đã được xóa thành công',
                'cart_id' => $cartId
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi xóa giỏ hàng');
        }
    }

    /**
     * 📌 Xóa tất cả sản phẩm trong giỏ hàng (Chỉ chủ sở hữu)
     */
    public function clearCart()
    {
        try {
            $cart = Cart::where('user_id', Auth::id())->first();

            if (!$cart) {
                return response()->json([
                    'status' => false,
                    'message' => 'Giỏ hàng trống'
                ], 200);
            }

            $cart->items()->delete();
            $cart->update(['total_amount' => 0]);

            return response()->json([
                'status' => true,
                'message' => 'Đã xóa toàn bộ sản phẩm trong giỏ hàng',
                'total_amount' => 0
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi xóa toàn bộ giỏ hàng');
        }
    }

    /**
     * 📌 Cập nhật tổng tiền của giỏ hàng (Tự động tính dựa trên các `cart_items`)
     */
    public function calculateTotalAmount($cartId)
    {
        $cart = Cart::with('items.productVariant')->findOrFail($cartId);

        // Tính tổng tiền dựa trên các `cart_items`
        $totalAmount = $cart->items->sum(function ($item) {
            return $item->quantity * $item->productVariant->price;
        });

        $cart->update(['total_amount' => $totalAmount]);

        return response()->json([
            'status'  => true,
            'message' => 'Cập nhật tổng tiền giỏ hàng thành công',
            'total_amount' => $totalAmount
        ]);
    }



    private function serverError($e, $customMessage)
    {
        return response()->json([
            'status' => false,
            'message' => $customMessage,
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
}

