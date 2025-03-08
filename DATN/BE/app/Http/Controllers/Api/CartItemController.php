<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartItemController extends Controller
{
    /**
     * Lấy danh sách sản phẩm trong giỏ hàng của người dùng
     */
    public function index()
    {
        // Lấy giỏ hàng của người dùng, bao gồm cả thông tin variant_value và product_variant
        $cart = Cart::with('items.variantValue.productVariant') // Eager loading để lấy variantValue và thông tin sản phẩm
            ->where('user_id', Auth::id())
            ->first();
    
        if (!$cart) {
            return response()->json(['message' => 'Giỏ hàng trống'], 200);
        }
    
        return response()->json($cart->items);
    }
    

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    public function store(Request $request)
    {
        $request->validate([
            'value_id' => 'required|exists:variant_values,id', // Kiểm tra xem variant_value có tồn tại không
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric'
        ]);
    
        // Kiểm tra xem người dùng đã có giỏ hàng chưa, nếu chưa thì tạo mới
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
    
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        $cartItem = CartItem::where('cart_id', $cart->id)
                            ->where('value_id', $request->value_id)
                            ->first();
    
        if ($cartItem) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
            $cartItem->update(['quantity' => $cartItem->quantity + $request->quantity]);
        } else {
            // Nếu chưa có, thêm mới vào giỏ hàng
            CartItem::create([
                'cart_id' => $cart->id,
                'value_id' => $request->value_id,
                'quantity' => $request->quantity,
                'total_price' => $request->total_price
            ]);
        }
    
        return response()->json(['message' => 'Đã thêm vào giỏ hàng'], 201);
    }   
    

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    public function update(Request $request, CartItem $cartItem)
{
    $request->validate([
        'quantity' => 'required|integer|min:1'
    ]);

    // Kiểm tra quyền (Chỉ chủ sở hữu hoặc Admin mới được phép cập nhật)
    if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
        return response()->json(['message' => 'Bạn không có quyền cập nhật sản phẩm này'], 403);
    }

    $cartItem->update(['quantity' => $request->quantity]);

    return response()->json(['message' => 'Đã cập nhật số lượng'], 200);
}

    /**
     * Xóa một sản phẩm khỏi giỏ hàng
     */
    public function destroy($cartItemId)
    {
        // Tìm sản phẩm trong giỏ hàng dựa trên cart_item_id
        $cartItem = CartItem::findOrFail($cartItemId);
    
        // Kiểm tra quyền (Chỉ chủ sở hữu hoặc Admin mới được phép xóa)
        if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền xóa sản phẩm này khỏi giỏ hàng'], 403);
        }
    
        // Kiểm tra số lượng sản phẩm trong giỏ hàng
        if ($cartItem->quantity > 1) {
            // Giảm số lượng sản phẩm đi 1
            $cartItem->update(['quantity' => $cartItem->quantity - 1]);
            return response()->json(['message' => 'Sản phẩm đã được giảm số lượng 1'], 200);
        } else {
            // Nếu số lượng là 1, xóa sản phẩm khỏi giỏ hàng
            $cartItem->delete();
            return response()->json(['message' => 'Sản phẩm đã được xóa khỏi giỏ hàng'], 200);
        }
    }
    
}
