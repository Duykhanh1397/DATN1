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
        try {
            $user = Auth::user();

            $rules = [
                'order_items' => 'required|array',
                'order_items.*.product_variant_id' => 'required|exists:product_variants,id',
                'order_items.*.quantity' => 'required|integer|min:1',
                'voucher_code' => 'nullable|string',
                'payment_method' => 'required|string|in:COD,VNPay',
                'shipping_fee' => 'nullable|numeric|min:0',
                'address' => 'required|string'
            ];

            if (!$user) {
                $rules['phone_number'] = 'required|string';
            }

            $validated = $request->validate($rules);

            $phone = $user ? $user->phone : $request->phone_number;
            $address = $request->address;

            if (!$phone || !$address) {
                return response()->json([
                    'status' => false,
                    'message' => 'Thiếu thông tin số điện thoại hoặc địa chỉ'
                ], 400);
            }

            // Lấy thông tin voucher nếu có và kiểm tra tính hợp lệ
            $voucher = null;
            $discount = 0;
            if ($request->voucher_code) {
                $voucher = Voucher::where('code', $request->voucher_code)
                    ->where('status', 'Hoạt động')
                    ->first();

                if (!$voucher) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Voucher không hợp lệ hoặc đã hết hạn'
                    ], 400);
                }

                // Kiểm tra xem user đã sử dụng voucher này chưa
                if ($user) {
                    $hasUsed = VoucherUser::where('user_id', $user->id)
                        ->where('voucher_id', $voucher->id)
                        ->exists();
                    if ($hasUsed) {
                        return response()->json([
                            'status' => false,
                            'message' => 'Bạn đã sử dụng voucher này rồi. Mỗi tài khoản chỉ được sử dụng voucher một lần.'
                        ], 400);
                    }
                }

                // Kiểm tra các điều kiện khác của voucher
                $now = Carbon::now();
                if ($voucher->used_count >= $voucher->usage_limit) {
                    return response()->json([
                        'status' => false,
                        'message' => "Voucher đã hết lượt sử dụng (đã dùng: {$voucher->used_count}/{$voucher->usage_limit})"
                    ], 400);
                }

                if ($voucher->start_date && Carbon::parse($voucher->start_date)->gt($now)) {
                    $startDateLocal = Carbon::parse($voucher->start_date)->setTimezone('Asia/Ho_Chi_Minh');
                    return response()->json([
                        'status' => false,
                        'message' => "Voucher chưa có hiệu lực (bắt đầu từ: {$startDateLocal->format('Y-m-d H:i:s')})"
                    ], 400);
                }

                if ($voucher->end_date && Carbon::parse($voucher->end_date)->lt($now)) {
                    $endDateLocal = Carbon::parse($voucher->end_date)->setTimezone('Asia/Ho_Chi_Minh');
                    return response()->json([
                        'status' => false,
                        'message' => "Voucher đã hết hạn (kết thúc vào: {$endDateLocal->format('Y-m-d H:i:s')})"
                    ], 400);
                }
            }

            // Tính tổng giá sản phẩm
            $subtotal = 0;
            foreach ($request->order_items as $item) {
                $variant = ProductVariant::find($item['product_variant_id']);
                if (!$variant) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Không tìm thấy sản phẩm với ID: ' . $item['product_variant_id']
                    ], 400);
                }

                $subtotal += $variant->price * $item['quantity'];
            }

            // Kiểm tra giá trị đơn hàng tối thiểu nếu có voucher
            if ($voucher && $voucher->min_order_value && $subtotal < $voucher->min_order_value) {
                return response()->json([
                    'status' => false,
                    'message' => "Giá trị đơn hàng chưa đạt mức tối thiểu để áp dụng voucher (tối thiểu: " . number_format($voucher->min_order_value, 0, ',', '.') . " VNĐ)"
                ], 400);
            }

            // Tính giảm giá từ voucher
            if ($voucher) {
                if ($voucher->discount_type === 'percentage') {
                    $discount = $subtotal * ($voucher->discount_value / 100);
                    if ($voucher->max_discount !== null) {
                        $discount = min($discount, (float) $voucher->max_discount);
                    }
                    Log::info('Discount calculated for percentage voucher', [
                        'voucher_id' => $voucher->id,
                        'subtotal' => $subtotal,
                        'discount_value' => $voucher->discount_value,
                        'max_discount' => $voucher->max_discount,
                        'discount' => $discount,
                    ]);
                } else {
                    $discount = $voucher->discount_value;
                    Log::info('Discount calculated for fixed voucher', [
                        'voucher_id' => $voucher->id,
                        'subtotal' => $subtotal,
                        'discount_value' => $voucher->discount_value,
                        'discount' => $discount,
                    ]);
                }
            }

            $shippingFee = $request->shipping_fee ?? 0;
            $finalTotal = max($subtotal - $discount + $shippingFee, 0);

            Log::info('Order totals calculated', [
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping_fee' => $shippingFee,
                'final_total' => $finalTotal,
            ]);

            // Tạo đơn hàng với địa chỉ vừa nhập
            $order = Order::create([
                'user_id' => $user ? $user->id : null,
                'guest_user' => $user ? null : $phone,
                'status' => 'Chờ xác nhận',
                'total_amount' => $finalTotal,
                'phone_number' => $phone,
                'address' => $address,
                'order_code' => strtoupper(Str::random(10)),
                'voucher_id' => $voucher?->id,
                'payment_method' => $request->payment_method,
                'payment_status' => $request->payment_method === 'COD' ? 'Chờ thanh toán' : 'Thanh toán thành công',
                'shipping_fee' => $shippingFee,
                'discount_amount' => $discount,
            ]);

            // Ghi nhận việc sử dụng voucher nếu có
            if ($voucher && $user) {
                VoucherUser::create([
                    'user_id' => $user->id,
                    'voucher_id' => $voucher->id,
                    'used_at' => Carbon::now(),
                ]);

                $voucher->increment('used_count');
                if ($voucher->used_count >= $voucher->usage_limit) {
                    $voucher->update(['status' => 'Hết hạn']);
                }
            }

            // Tạo bản ghi thanh toán
            $paymentStatus = $request->payment_method === 'VNPay'
                ? 'Thanh toán thành công'
                : 'Chờ thanh toán';

            Payment::create([
                'order_id' => $order->id,
                'payment_method' => $request->payment_method,
                'payment_status' => $paymentStatus,
                'amount' => $finalTotal,
                'payment_date' => now(),
            ]);

            // Nếu là VNPay thì cập nhật trạng thái trong đơn hàng (nếu muốn lưu)
            if ($request->payment_method === 'VNPay') {
                $order->update(['payment_status' => 'Thanh toán thành công']);
            }

            foreach ($request->order_items as $item) {
                $variant = ProductVariant::find($item['product_variant_id']);
                if (!$variant) continue;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $item['product_variant_id'],
                    'quantity' => $item['quantity'],
                    'total_price' => $variant->price * $item['quantity'],
                ]);

                $variant->decrement('stock', $item['quantity']);
            }

            return response()->json([
                'status' => true,
                'message' => 'Đơn hàng đã được tạo thành công',
                'order_id' => $order->id,
                'payment_method' => $order->payment_method,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Lỗi tạo đơn hàng: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Lỗi server: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->all());

        return response()->json(['message' => 'Order updated successfully']);
    }
}
