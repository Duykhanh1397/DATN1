<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    /**
     * 📌 [USER/ADMIN] Lấy danh sách sản phẩm trong đơn hàng
     * - FE gọi: GET /api/orders/{orderId}/items
     */
    public function index($orderId)
    {
        $orderItems = OrderItem::where('order_id', $orderId)
            ->with('productVariant') // ✅ Load luôn thông tin productVariant
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Danh sách sản phẩm trong đơn hàng',
            'data' => $orderItems
        ]);
    }

    /**
     * 📌 2. Thêm sản phẩm vào đơn hàng
     */
    public function store(Request $request, $orderId)
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $order = Order::findOrFail($orderId);
        $productVariant = ProductVariant::findOrFail($request->product_variant_id);

        // 🔥 Kiểm tra tồn kho
        if ($request->quantity > $productVariant->stock) {
            return response()->json(['status' => false, 'message' => 'Số lượng đặt vượt quá tồn kho'], 400);
        }

        // 🔥 Kiểm tra xem sản phẩm đã có trong đơn hàng chưa
        $orderItem = OrderItem::where('order_id', $orderId)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        if ($orderItem) {
            // Nếu sản phẩm đã tồn tại, chỉ tăng số lượng
            $newQuantity = $orderItem->quantity + $request->quantity;

            // Kiểm tra lại tồn kho sau khi tăng số lượng
            if ($newQuantity > $productVariant->stock) {
                return response()->json(['status' => false, 'message' => 'Số lượng tổng cộng vượt quá tồn kho'], 400);
            }

            $orderItem->update([
                'quantity' => $newQuantity,
                'total_price' => $productVariant->price * $newQuantity,
            ]);
        } else {
            // Nếu chưa có, thêm mới vào đơn hàng
            OrderItem::create([
                'order_id' => $orderId,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $request->quantity,
                'total_price' => $productVariant->price * $request->quantity,
            ]);
        }

        // 🔥 Cập nhật tổng tiền đơn hàng sau khi thêm sản phẩm
        $this->updateOrderTotal($orderId);

        return response()->json(['status' => true, 'message' => 'Sản phẩm đã được thêm vào đơn hàng'], 201);
    }

    /**
     * 📌 3. Cập nhật số lượng sản phẩm trong đơn hàng
     */


    public function update(Request $request, $orderItemId)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $orderItem = OrderItem::findOrFail($orderItemId);
        $productVariant = ProductVariant::findOrFail($orderItem->product_variant_id);

        // 🔥 Kiểm tra tồn kho
        if ($request->quantity > $productVariant->stock) {
            return response()->json(['status' => false, 'message' => 'Số lượng đặt vượt quá tồn kho'], 400);
        }

        $orderItem->update([
            'quantity' => $request->quantity,
            'total_price' => $productVariant->price * $request->quantity,
        ]);

        // 🔥 Cập nhật tổng tiền đơn hàng
        $this->updateOrderTotal($orderItem->order_id);

        return response()->json(['status' => true, 'message' => 'Cập nhật số lượng thành công']);
    }
    /**
     * 📌 4. Xóa sản phẩm khỏi đơn hàng
     */
    public function destroy($orderItemId)
    {
        $orderItem = OrderItem::findOrFail($orderItemId);
        $orderId = $orderItem->order_id;
        $orderItem->delete();

        // 🔥 Cập nhật tổng tiền đơn hàng
        $this->updateOrderTotal($orderId);

        return response()->json(['status' => true, 'message' => 'Sản phẩm đã được xóa khỏi đơn hàng']);
    }

    /**
     * 📌 Hàm cập nhật tổng tiền đơn hàng
     */
    private function updateOrderTotal($orderId)
    {
        $order = Order::findOrFail($orderId);
        $totalAmount = OrderItem::where('order_id', $orderId)->sum('total_price');
        $order->update(['total_amount' => $totalAmount]);
    }
}
