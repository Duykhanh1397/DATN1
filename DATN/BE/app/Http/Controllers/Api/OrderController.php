<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Voucher;
use App\Models\VariantValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    // 1. Xem Danh Sách Đơn Hàng (Admin)
    public function index(Request $request)
    {
        $orders = Order::with(['user', 'orderItems.variantValue.productVariant'])
            ->orderBy('created_at', 'desc')
            ->paginate(10); // Phân trang đơn hàng

        return response()->json($orders);
    }

    // 2. Xem Chi Tiết Đơn Hàng (Admin)
    public function show($orderId)
    {
        $order = Order::with(['orderItems.variantValue.productVariant', 'voucher'])
            ->where('id', $orderId)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }

        return response()->json($order);
    }

    // 3. Cập Nhật Trạng Thái Đơn Hàng (Admin)
    public function updateStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|string|in:Đã xác nhận,Hủy đơn,Đang giao hàng,Giao hàng thành công,Giao hàng thất bại'
        ]);

        $order = Order::findOrFail($orderId);
        $user = Auth::user();
        $currentStatus = $order->status;
        $newStatus = $request->status;

        // Xác định các trạng thái hợp lệ
        $validStatusUpdates = [
            'Chưa xác nhận' => ['Đã xác nhận', 'Hủy đơn'],
            'Đã xác nhận' => ['Đang giao hàng'],
            'Đang giao hàng' => ['Giao hàng thành công', 'Giao hàng thất bại'],
        ];

        // Kiểm tra xem trạng thái hiện tại có thể chuyển đổi sang trạng thái mới không
        if (!isset($validStatusUpdates[$currentStatus]) || !in_array($newStatus, $validStatusUpdates[$currentStatus])) {
            return response()->json([
                'message' => 'Không thể chuyển đổi trạng thái này!'
            ], 400);
        }

        // Kiểm tra quyền của người dùng
        if ($currentStatus === 'Chưa xác nhận') {
            if ($user->role === 'Admin' || $user->id === $order->user_id) {
                $order->update(['status' => $newStatus]);
                return response()->json(['message' => 'Cập nhật trạng thái đơn hàng thành công']);
            }
        } elseif (in_array($currentStatus, ['Đã xác nhận', 'Đang giao hàng']) && $user->role === 'Admin') {
            $order->update(['status' => $newStatus]);
            return response()->json(['message' => 'Cập nhật trạng thái đơn hàng thành công']);
        }

        return response()->json(['message' => 'Bạn không có quyền cập nhật trạng thái đơn hàng này'], 403);
    }


    // 4. Tạo Đơn Hàng Mới (Admin hoặc khách chưa đăng nhập)
    public function create(Request $request)
    {
        $request->validate([
            'user_id' => 'nullable|exists:users,id', // Không bắt buộc nếu khách
            'total_amount' => 'required|numeric',
            'phone_number' => 'required|string',
            'address' => 'required|string',
            'order_items' => 'required|array',
            'order_items.*.variant_id' => 'required|exists:variant_values,id',
            'order_items.*.quantity' => 'required|integer|min:1',
        ]);

        // Kiểm tra thông tin voucher (nếu có)
        $voucher = null;
        $totalAmount = 0;

        if ($request->voucher_code) {
            $voucher = Voucher::where('code', $request->voucher_code)->where('status', 'Hoạt động')->first();
        }

        // Tính toán tổng giá trị giỏ hàng
        foreach ($request->order_items as $item) {
            $variantValue = VariantValue::find($item['variant_id']);
            $totalAmount += $variantValue->price * $item['quantity'];
        }

        // Áp dụng giảm giá (nếu có)
        if ($voucher) {
            if ($voucher->discount_type == 'percentage') {
                $discount = ($totalAmount * $voucher->discount_value) / 100;
                $totalAmount -= $discount;
            } else {
                $totalAmount -= $voucher->discount_value;
            }
        }

        // Tạo đơn hàng cho khách
        $order = Order::create([
            'user_id' => $request->user_id,
            'guest_user' => $request->phone_number, // Hoặc có thể là email, tên nếu có
            'status' => 'Chưa xác nhận',
            'total_amount' => $totalAmount,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'order_code' => strtoupper(Str::random(10)), // Tạo mã đơn hàng ngẫu nhiên
        ]);

        // Lưu các sản phẩm vào đơn hàng
        foreach ($request->order_items as $item) {
            $variantValue = VariantValue::find($item['variant_id']);
            OrderItem::create([
                'order_id' => $order->id,
                'variant_id' => $item['variant_id'],
                'quantity' => $item['quantity'],
                'total_price' => $variantValue->price * $item['quantity'],
            ]);
        }

        return response()->json(['message' => 'Đặt hàng thành công', 'order_id' => $order->id]);
    }
}
