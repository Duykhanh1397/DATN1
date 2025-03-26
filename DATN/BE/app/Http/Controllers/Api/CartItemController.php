<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartItemController extends Controller
{
    /**
     * 📌 Lấy danh sách sản phẩm trong giỏ hàng của người dùng
     */
    public function index()
{
    $cart = Cart::with([
            'items.productVariant.color',
            'items.productVariant.storage',
            'items.productVariant.product',
            'items.productVariant.images'
        ])
        ->where('user_id', Auth::id())
        ->first();

    if (!$cart) {
        return response()->json([
            'status' => false,
            'message' => 'Giỏ hàng trống',
            'data' => []
        ]);
    }

    $items = $cart->items->map(function ($item) {
        $variant = $item->productVariant;

        // Xử lý toàn bộ images trong variant (theo logic bạn nói)
        $variant->images->map(function ($img) {
            // Kiểm tra nếu image_url đã có domain chưa
            if (!filter_var($img->image_url, FILTER_VALIDATE_URL)) {
                $img->image_url = asset('storage/' . ltrim($img->image_url, '/'));
            }
            return $img;
        });

        // Lấy ảnh đầu tiên trong danh sách images (sau khi đã map xong ở trên)
        $variantImage = $variant->images->first()->image_url
            ?? ($variant->product->image ? asset('storage/' . ltrim($variant->product->image, '/')) : null);

        return [
            'cart_item_id' => $item->id,
            'product_variant' => [
                'id' => $variant->id,
                'color' => $variant->color->value ?? null,
                'storage' => $variant->storage->value ?? null,
                'price' => $variant->price,
                'stock' => $variant->stock,
                'name' => $variant->product->name ?? null,
                'image' => $variantImage, // ảnh đầu tiên sau khi xử lý images
                'images' => $variant->images // có thể trả cả list ảnh đã xử lý ra đây nếu cần
            ],
            'quantity' => $item->quantity,
            'total_price' => $item->total_price
        ];
    });

    return response()->json([
        'status' => true,
        'message' => 'Lấy danh sách sản phẩm trong giỏ',
        'data' => $items
    ]);
}



    /**
     * 📌 Thêm sản phẩm vào giỏ hàng
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'color_id' => 'required|exists:variant_color,id',
            'storage_id' => 'required|exists:variant_storage,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // ✅ Tìm đúng ProductVariant theo bộ color_id + storage_id + product_id
        $variant = ProductVariant::where('product_id', $validatedData['product_id'])
            ->where('color_id', $validatedData['color_id'])
            ->where('storage_id', $validatedData['storage_id'])
            ->first();

        if (!$variant) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy biến thể phù hợp với lựa chọn!'
            ], 404);
        }

        // ✅ Kiểm tra tồn kho
        if ($variant->stock < $validatedData['quantity']) {
            return response()->json([
                'status' => false,
                'message' => 'Số lượng sản phẩm không đủ trong kho'
            ], 400);
        }

        // ✅ Lấy hoặc tạo giỏ hàng
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        // ✅ Kiểm tra xem đã có sản phẩm này trong giỏ chưa
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_variant_id', $variant->id)
            ->first();

        if ($cartItem) {
            // Tăng số lượng nếu có
            $newQuantity = $cartItem->quantity + $validatedData['quantity'];
            if ($variant->stock < $newQuantity) {
                return response()->json([
                    'status' => false,
                    'message' => 'Số lượng sản phẩm vượt quá tồn kho'
                ], 400);
            }
            $cartItem->update([
                'quantity' => $newQuantity,
                'total_price' => $newQuantity * $variant->price,
            ]);
        } else {
            // Thêm mới
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_variant_id' => $variant->id,
                'quantity' => $validatedData['quantity'],
                'total_price' => $validatedData['quantity'] * $variant->price,
            ]);
        }

        // ✅ Update tổng tiền giỏ hàng
        $this->calculateTotalAmount($cart->id);

        return response()->json([
            'status' => true,
            'message' => 'Thêm vào giỏ hàng thành công',
            'data' => $cartItem
        ], 201);
    }


    /**
     * 📌 Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    public function update(Request $request, $cartItemId)
    {
        $validatedData = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = CartItem::findOrFail($cartItemId);

        // ✅ Kiểm tra quyền (Chỉ chủ sở hữu hoặc Admin)
        if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền cập nhật sản phẩm này'], 403);
        }

        // ✅ Lấy thông tin sản phẩm
        $variant = ProductVariant::findOrFail($cartItem->product_variant_id);

        // ✅ Kiểm tra tồn kho
        if ($variant->stock < $validatedData['quantity']) {
            return response()->json([
                'status' => false,
                'message' => 'Số lượng sản phẩm vượt quá tồn kho'
            ], 400);
        }

        // ✅ Cập nhật số lượng & tổng tiền
        $cartItem->update([
            'quantity' => $validatedData['quantity'],
            'total_price' => $validatedData['quantity'] * $variant->price,
        ]);

        // ✅ Cập nhật tổng tiền giỏ hàng
        $this->calculateTotalAmount($cartItem->cart_id);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật số lượng thành công',
            'data' => $cartItem
        ]);
    }

    /**
     * 📌 Tăng số lượng sản phẩm trong giỏ hàng
     */
    public function increase($cartItemId)
    {
        $cartItem = CartItem::findOrFail($cartItemId);

        // ✅ Check quyền
        if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền tăng sản phẩm này'], 403);
        }

        // ✅ Check tồn kho variant
        $variant = ProductVariant::findOrFail($cartItem->product_variant_id);
        if ($variant->stock < $cartItem->quantity + 1) {
            return response()->json(['status' => false, 'message' => 'Không đủ tồn kho để tăng số lượng'], 400);
        }

        // ✅ Tăng số lượng và cập nhật giá
        $cartItem->quantity += 1;
        $cartItem->total_price = $cartItem->quantity * $variant->price;
        $cartItem->save();

        // ✅ Cập nhật tổng tiền giỏ hàng
        $this->calculateTotalAmount($cartItem->cart_id);

        return response()->json(['status' => true, 'message' => 'Tăng số lượng thành công']);
    }

    /**
     * 📌 Giảm số lượng sản phẩm (Về 0 thì xóa luôn)
     */
    public function decrease($cartItemId)
    {
        $cartItem = CartItem::findOrFail($cartItemId);

        // ✅ Check quyền
        if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền giảm sản phẩm này'], 403);
        }

        if ($cartItem->quantity > 1) {
            $cartItem->quantity -= 1;
            $cartItem->total_price = $cartItem->quantity * $cartItem->productVariant->price;
            $cartItem->save();
        } else {
            // ✅ Nếu còn 1, giảm thì xóa luôn
            $cartItem->delete();
        }

        $this->calculateTotalAmount($cartItem->cart_id);

        return response()->json(['status' => true, 'message' => 'Giảm 1 sản phẩm thành công']);
    }

    /**
     * 📌 Xóa hẳn sản phẩm ra khỏi giỏ hàng
     */
    public function destroy($cartItemId)
    {
        $cartItem = CartItem::findOrFail($cartItemId);

        // ✅ Check quyền
        if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền xóa sản phẩm này'], 403);
        }

        $cartItem->delete();

        // ✅ Cập nhật tổng tiền giỏ hàng
        $this->calculateTotalAmount($cartItem->cart_id);

        return response()->json(['status' => true, 'message' => 'Đã xóa sản phẩm khỏi giỏ hàng']);
    }


    /**
     * 📌 Cập nhật tổng tiền của giỏ hàng (Tự động tính dựa trên `cart_items`)
     */
    private function calculateTotalAmount($cartId)
    {
        $cart = Cart::with('items.productVariant')->findOrFail($cartId);

        // ✅ Tính tổng tiền dựa trên các `cart_items`
        $totalAmount = $cart->items->sum(function ($item) {
            return $item->quantity * $item->productVariant->price;
        });

        $cart->update(['total_amount' => $totalAmount]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật tổng tiền giỏ hàng thành công',
            'total_amount' => $totalAmount
        ]);
    }
}