<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\Order;
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

            // Xử lý toàn bộ images trong variant
            $variant->images->map(function ($img) {
                if (!filter_var($img->image_url, FILTER_VALIDATE_URL)) {
                    $img->image_url = asset('storage/' . ltrim($img->image_url, '/'));
                }
                return $img;
            });

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
                    'image' => $variantImage,
                    'images' => $variant->images
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
        try {
            $validatedData = $request->validate([
                'product_id' => 'required|exists:products,id',
                'color_id' => 'nullable|exists:variant_color,id',
                'storage_id' => 'nullable|exists:variant_storage,id',
                'quantity' => 'required|integer|min:1',
                'user_id' => 'required|exists:users,id',
            ]);

            // Kiểm tra rằng ít nhất một trong hai trường color_id hoặc storage_id phải được cung cấp
            if (!$validatedData['color_id'] && !$validatedData['storage_id']) {
                return response()->json([
                    'status' => false,
                    'message' => 'Vui lòng chọn ít nhất một màu sắc hoặc dung lượng.'
                ], 422);
            }

            // Tìm ProductVariant theo product_id và color_id/storage_id (nếu có)
            $query = ProductVariant::where('product_id', $validatedData['product_id']);
            if ($validatedData['color_id']) {
                $query->where('color_id', $validatedData['color_id']);
            }
            if ($validatedData['storage_id']) {
                $query->where('storage_id', $validatedData['storage_id']);
            }

            $variant = $query->first();

            if (!$variant) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy biến thể phù hợp với lựa chọn!'
                ], 404);
            }

            // Kiểm tra tồn kho
            if ($variant->stock < $validatedData['quantity']) {
                return response()->json([
                    'status' => false,
                    'message' => 'Số lượng sản phẩm không đủ trong kho'
                ], 400);
            }

            // Lấy hoặc tạo giỏ hàng
            $cart = Cart::firstOrCreate(['user_id' => $validatedData['user_id']]);

            // Kiểm tra xem đã có sản phẩm này trong giỏ chưa
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

            // Cập nhật tổng tiền giỏ hàng
            $this->calculateTotalAmount($cart->id);

            return response()->json([
                'status' => true,
                'message' => 'Thêm vào giỏ hàng thành công',
                'data' => $cartItem
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu đầu vào không hợp lệ.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi thêm vào giỏ hàng.',
                'error' => $e->getMessage(),
            ], 500);
        }
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

        // Kiểm tra quyền
        if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền cập nhật sản phẩm này'], 403);
        }

        // Lấy thông tin sản phẩm
        $variant = ProductVariant::findOrFail($cartItem->product_variant_id);

        // Kiểm tra tồn kho
        if ($variant->stock < $validatedData['quantity']) {
            return response()->json([
                'status' => false,
                'message' => 'Số lượng sản phẩm vượt quá tồn kho'
            ], 400);
        }

        // Cập nhật số lượng & tổng tiền
        $cartItem->update([
            'quantity' => $validatedData['quantity'],
            'total_price' => $validatedData['quantity'] * $variant->price,
        ]);

        // Cập nhật tổng tiền giỏ hàng
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

        // Check quyền
        if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền tăng sản phẩm này'], 403);
        }

        // Check tồn kho variant
        $variant = ProductVariant::findOrFail($cartItem->product_variant_id);
        if ($variant->stock < $cartItem->quantity + 1) {
            return response()->json(['status' => false, 'message' => 'Không đủ tồn kho để tăng số lượng'], 400);
        }

        // Tăng số lượng và cập nhật giá
        $cartItem->quantity += 1;
        $cartItem->total_price = $cartItem->quantity * $variant->price;
        $cartItem->save();

        // Cập nhật tổng tiền giỏ hàng
        $this->calculateTotalAmount($cartItem->cart_id);

        return response()->json(['status' => true, 'message' => 'Tăng số lượng thành công']);
    }

    /**
     * 📌 Giảm số lượng sản phẩm (Về 0 thì xóa luôn)
     */
    public function decrease($cartItemId)
    {
        $cartItem = CartItem::findOrFail($cartItemId);

        // Check quyền
        if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền giảm sản phẩm này'], 403);
        }

        if ($cartItem->quantity > 1) {
            $cartItem->quantity -= 1;
            $cartItem->total_price = $cartItem->quantity * $cartItem->productVariant->price;
            $cartItem->save();
        } else {
            // Nếu còn 1, giảm thì xóa luôn
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

        // Check quyền
        if (Auth::id() !== $cartItem->cart->user_id && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền xóa sản phẩm này'], 403);
        }

        $cartItem->delete();

        // Cập nhật tổng tiền giỏ hàng
        $this->calculateTotalAmount($cartItem->cart_id);

        return response()->json(['status' => true, 'message' => 'Đã xóa sản phẩm khỏi giỏ hàng']);
    }

    /**
     * 📌 Xóa sản phẩm theo đơn hàng
     */
    public function removeItemsByOrder($orderId)
    {
        $order = Order::with('orderItems')->find($orderId);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        if ($order->orderItems->isEmpty()) {
            return response()->json(['message' => 'Đơn hàng không có sản phẩm nào'], 400);
        }

        $productVariantIds = $order->orderItems->pluck('product_variant_id')->toArray();

        if (empty($productVariantIds)) {
            return response()->json(['message' => 'Không có sản phẩm nào để xóa'], 400);
        }

        $deleted = CartItem::whereIn('product_variant_id', $productVariantIds)->delete();

        return response()->json([
            'status' => true,
            'message' => "Đã xóa {$deleted} sản phẩm trong giỏ hàng sau khi đặt hàng"
        ]);
    }

    /**
     * 📌 Xóa các sản phẩm được chọn
     */
    public function removeSelectedItems(Request $request)
    {
        try {
            $userId = $request->input('user_id');
            $productVariantIds = $request->input('product_variant_ids');

            if (empty($productVariantIds)) {
                return response()->json(['message' => 'Danh sách sản phẩm trống'], 400);
            }

            CartItem::where('user_id', $userId)
                ->whereIn('product_variant_id', $productVariantIds)
                ->delete();

            return response()->json(['message' => 'Xóa sản phẩm đã chọn thành công']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi khi xóa sản phẩm đã chọn'], 500);
        }
    }

    /**
     * 📌 Cập nhật tổng tiền của giỏ hàng
     */
    private function calculateTotalAmount($cartId)
    {
        $cart = Cart::with('items.productVariant')->findOrFail($cartId);

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
