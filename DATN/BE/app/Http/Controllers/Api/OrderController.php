<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Voucher;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * 📌 [User / Admin] Lấy danh sách đơn hàng
     * - Admin: Lấy toàn bộ đơn hàng
     * - User: Lấy đúng đơn của mình
     * - FE gọi: GET /api/orders
     */
    public function index(Request $request)
    { 
        $user = Auth::user();

        // ✅ Check role: Nếu Admin lấy hết, User chỉ lấy của mình
        if ($user->role === 'Admin') {
            $orders = Order::with(['user', 'orderItems.productVariant'])
                        ->orderBy('created_at', 'desc')
                        ->paginate(10); // ✅ Phân trang chuẩn
        } else {
            $orders = Order::with(['orderItems.productVariant'])
                        ->where('user_id', $user->id)
                        ->orderBy('created_at', 'desc')
                        ->paginate(10);
        }

        return response()->json([
            'status' => true,
            'message' => 'Danh sách đơn hàng',
            'data' => $orders
        ]);
    }

    /**
     * 📌 [User / Admin] Xem chi tiết 1 đơn hàng
     * - Admin: Xem tất cả
     * - User: Chỉ xem đơn của mình
     * - FE gọi: GET /api/orders/{orderId}
     */
    public function show($orderId)
    {
        // ✅ Load đầy đủ quan hệ
        // $order = Order::with(['orderItems.productVariant', 'voucher', 'user'])->find($orderId);
$order = Order::with([
    'user',
    'orderItems.productVariant.product',
    'orderItems.productVariant.color',
    'orderItems.productVariant.storage',
    'orderItems.productVariant.images'
])->findOrFail($orderId);


        if (!$order) {
            return response()->json(['status' => false, 'message' => 'Đơn hàng không tồn tại'], 404);
        }

        // ✅ Quyền xem: Chỉ chủ đơn hoặc Admin mới được xem
        if (Auth::user()->role !== 'Admin' && $order->user_id !== Auth::id()) {
            return response()->json(['status' => false, 'message' => 'Bạn không có quyền xem đơn hàng này'], 403);
        }

        return response()->json([
            'status' => true,
            'message' => 'Chi tiết đơn hàng',
            'data' => $order
        ]);
    }

    /**
     * 📌 [User] Lấy lịch sử đơn hàng của chính mình
     * - FE gọi: GET /api/orders/user
     */
    public function userOrders(Request $request)
    {
        $orders = Order::with([
                'orderItems.productVariant.color',
                'orderItems.productVariant.storage',
                'voucher'
            ])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10); // ✅ Phân trang để tránh load nhiều quá

        return response()->json([
            'status' => true,
            'message' => 'Danh sách đơn hàng của bạn',
            'data' => $orders
        ]);
    }

    /**
     * 📌 [Guest] Check đơn hàng qua SĐT hoặc mã đơn
     * - FE gọi: POST /api/orders/guest-check
     * - Body: { "phone_number": "0987xxx", "order_code": "ABC123XYZ" }
     */
    public function guestCheckOrder(Request $request)
    {
        $request->validate([
            'phone_number' => 'required_without:order_code|string',
            'order_code'   => 'required_without:phone_number|string'
        ]);

        // ✅ Tìm theo sđt hoặc mã đơn
        $query = Order::with(['orderItems.productVariant', 'voucher']);

        if ($request->filled('phone_number')) {
            $query->where('guest_user', $request->phone_number);
        }

        if ($request->filled('order_code')) {
            $query->where('order_code', $request->order_code);
        }

        $order = $query->first();

        if (!$order) {
            return response()->json(['status' => false, 'message' => 'Không tìm thấy đơn hàng'], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Thông tin đơn hàng',
            'data' => $order
        ]);
    }

    /**
     * 📌 [Admin] Cập nhật trạng thái đơn hàng
     * - FE Admin gọi: PUT /api/admin/orders/{orderId}/update-status
     * - Body: { "status": "Đã xác nhận" }
     */
    public function updateStatus(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|string|in:Chờ xác nhận,Đã xác nhận,Đang giao hàng,Giao hàng thành công,Giao hàng thất bại,Hủy đơn'
        ]);

        $order = Order::findOrFail($orderId);
        $user = Auth::user();
        
        // ✅ Cập nhật trạng thái
        $order->update(['status' => $request->status]);

        // ✅ Ghi log lịch sử trạng thái
        OrderStatusHistory::create([
            'order_id' => $order->id,
            'user_id' => $user->id,
            'status' => $request->status
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật trạng thái đơn hàng thành công'
        ]);
    }

    /**
     * 📌 [User hoặc Guest] Đặt hàng
     * - FE gọi: POST /api/orders
     * - Body:
     *   {
     *     "user_id": optional,
     *     "phone_number": "bắt buộc",
     *     "address": "bắt buộc",
     *     "order_items": [
     *          { "product_variant_id": 1, "quantity": 2 }
     *      ],
     *     "voucher_code": optional
     *   }
     */
   public function create(Request $request)
{
    $user = Auth::user(); // ✅ Kiểm tra user đã đăng nhập chưa

    // ✅ Xử lý rule validate: nếu user login -> không cần phone & address, guest bắt buộc
    $rules = [
        'order_items' => 'required|array',
        'order_items.*.product_variant_id' => 'required|exists:product_variants,id',
        'order_items.*.quantity' => 'required|integer|min:1',
        'voucher_code' => 'nullable|string'
    ];

    if (!$user) {
        // ✅ Guest bắt buộc nhập
        $rules['phone_number'] = 'required|string';
        $rules['address'] = 'required|string';
    }

    $validated = $request->validate($rules);

    // ✅ Nếu là user -> tự động lấy phone & address từ database
    $phone = $user ? $user->phone : $request->phone_number;
    $address = $user ? $user->address : $request->address;
    

    if (!$phone || !$address) {
        return response()->json([
            'status' => false,
            'message' => 'Thiếu thông tin số điện thoại hoặc địa chỉ'
        ], 400);
    }

    // ✅ Xử lý voucher nếu có
    $voucher = null;
    if ($request->voucher_code) {
        $voucher = Voucher::where('code', $request->voucher_code)
            ->where('status', 'Hoạt động')
            ->first();
    }

    // ✅ Tính tổng tiền đơn hàng
    $totalAmount = 0;
    foreach ($request->order_items as $item) {
        $variant = ProductVariant::find($item['product_variant_id']);
        if (!$variant) {
            return response()->json(['status' => false, 'message' => 'Không tìm thấy sản phẩm'], 404);
        }
        $totalAmount += $variant->price * $item['quantity'];
    }

    // ✅ Áp dụng giảm giá từ voucher (nếu có)
    if ($voucher) {
        if ($voucher->discount_type === 'percentage') {
            $discount = ($totalAmount * $voucher->discount_value) / 100;
            $totalAmount -= $discount;
        } else {
            $totalAmount -= $voucher->discount_value;
        }
    }

    // ✅ Tạo đơn hàng
    $order = Order::create([
        'user_id' => $user->id ?? null,
        'guest_user' => $user ? null : $phone,
        'status' => 'Chờ xác nhận',
        'total_amount' => $totalAmount,
        'phone_number' => $phone,
        'address' => $address,
        'order_code' => strtoupper(Str::random(10)),
        'voucher_id' => $voucher ? $voucher->id : null,
    ]);

    // ✅ Thêm từng sản phẩm vào đơn hàng
    foreach ($request->order_items as $item) {
        $variant = ProductVariant::find($item['product_variant_id']);
        OrderItem::create([
            'order_id' => $order->id,
            'product_variant_id' => $item['product_variant_id'],
            'quantity' => $item['quantity'],
            'total_price' => $variant->price * $item['quantity'],
        ]);

        // ✅ Giảm tồn kho luôn
        $variant->decrement('stock', $item['quantity']);
    }

    return response()->json([
        'status' => true,
        'message' => 'Đặt hàng thành công',
        'order_id' => $order->id
    ]);
}

}