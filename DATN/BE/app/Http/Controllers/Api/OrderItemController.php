<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\VariantValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderItemController extends Controller
{
    public function index($orderId)
    {
        $orderItems = OrderItem::where('order_id', $orderId)->with('variantValue')->get();
        return response()->json($orderItems);
    }

    public function store(Request $request, $orderId)
{
    $request->validate([
        'value_id' => 'required|exists:variant_values,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $order = Order::findOrFail($orderId);
    $variantValue = VariantValue::findOrFail($request->value_id);

    // 🔹 Kiểm tra tồn kho trước khi thêm sản phẩm
    if ($request->quantity > $variantValue->stock) {
        return response()->json(['message' => 'Số lượng đặt vượt quá tồn kho'], 400);
    }

    // 🔹 Kiểm tra xem sản phẩm đã có trong đơn hàng chưa
    $orderItem = OrderItem::where('order_id', $orderId)
        ->where('value_id', $request->value_id)
        ->first();

    if ($orderItem) {
        // Nếu sản phẩm đã tồn tại, chỉ tăng số lượng
        $newQuantity = $orderItem->quantity + $request->quantity;

        // Kiểm tra lại tồn kho sau khi tăng số lượng
        if ($newQuantity > $variantValue->stock) {
            return response()->json(['message' => 'Số lượng tổng cộng vượt quá tồn kho'], 400);
        }

        $orderItem->update([
            'quantity' => $newQuantity,
            'total_price' => $variantValue->price * $newQuantity,
        ]);
    } else {
        // Nếu chưa có, thêm mới vào đơn hàng
        OrderItem::create([
            'order_id' => $orderId,
            'value_id' => $request->value_id,
            'quantity' => $request->quantity,
            'total_price' => $variantValue->price * $request->quantity,
        ]);
    }

    // 🔹 Cập nhật tổng tiền đơn hàng sau khi thêm sản phẩm
    $this->updateOrderTotal($orderId);

    return response()->json(['message' => 'Sản phẩm đã được thêm vào đơn hàng'], 201);
}

/**
 * Hàm cập nhật tổng tiền đơn hàng
 */
private function updateOrderTotal($orderId)
{
    $order = Order::findOrFail($orderId);
    $totalAmount = OrderItem::where('order_id', $orderId)->sum('total_price');
    $order->update(['total_amount' => $totalAmount]);
}

    public function update(Request $request, $orderItemId)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $orderItem = OrderItem::findOrFail($orderItemId);
        $variantValue = VariantValue::findOrFail($orderItem->value_id);

        $orderItem->update([
            'quantity' => $request->quantity,
            'total_price' => $variantValue->price * $request->quantity,
        ]);

        return response()->json(['message' => 'Đã cập nhật số lượng sản phẩm'], 200);
    }

    public function destroy($orderItemId)
    {
        OrderItem::findOrFail($orderItemId)->delete();
        return response()->json(['message' => 'Sản phẩm đã được xóa khỏi đơn hàng'], 200);
    }
}