<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * 📌 1. Xử lý Thanh Toán VNPay
     */
    public function payment(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);

        // Kiểm tra nếu đơn hàng đã thanh toán
        if ($order->payment_status == 'Thanh toán thành công') {
            return response()->json(['message' => 'Đơn hàng đã thanh toán'], 400);
        }

        // Nếu khách chọn COD, không cần xử lý VNPay
        if ($order->payment_method == 'COD') {
            $order->update(['payment_status' => 'Chờ thanh toán']);
            return response()->json(['message' => 'Đơn hàng sẽ thanh toán khi nhận hàng'], 200);
        }

        // 🔹 Cấu hình VNPay từ .env
        $vnp_TmnCode = env('VNP_TMN_CODE'); // Mã website VNPay cấp
        $vnp_HashSecret = env('VNP_HASH_SECRET'); // Chuỗi ký bí mật VNPay
        $vnp_Url = env('VNP_URL'); // URL cổng thanh toán

        // 🔹 Tạo dữ liệu thanh toán
        $vnp_TxnRef = strtoupper(Str::random(10)); // Mã giao dịch duy nhất
        $vnp_Amount = $order->total_amount * 100; // VNPay yêu cầu nhân 100
        $vnp_ReturnUrl = route('payment.result', ['order_code' => $order->order_code]);

        // 🔹 Tạo chuỗi dữ liệu gửi đến VNPay
        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => now()->format('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => request()->ip(),
            "vnp_Locale" => "vn",
            "vnp_OrderInfo" => "Thanh toán đơn hàng " . $order->order_code,
            "vnp_OrderType" => "billpayment",
            "vnp_ReturnUrl" => $vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef,
        ];

        // 🔹 Sắp xếp và tạo chữ ký bảo mật (SecureHash)
        ksort($inputData);
        $query = http_build_query($inputData);
        $hashData = urldecode($query);
        $vnpSecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        $inputData['vnp_SecureHash'] = $vnpSecureHash;

        // 🔹 Tạo URL thanh toán VNPay
        $paymentUrl = $vnp_Url . "?" . http_build_query($inputData);

        return response()->json(['redirect_url' => $paymentUrl]);
    }

    /**
     * 📌 2. Xử lý Kết Quả Thanh Toán Từ VNPay
     */
    public function paymentResult(Request $request)
    {
        $order = Order::where('order_code', $request->input('order_code'))->firstOrFail();

        // Kiểm tra nếu đơn hàng đã thanh toán
        if ($order->payment_status == 'Thanh toán thành công') {
            return response()->json(['message' => 'Đơn hàng đã thanh toán'], 200);
        }

        // Kiểm tra phản hồi từ VNPay
        if ($request->input('vnp_ResponseCode') == '00') {
            // 🔹 Thanh toán thành công
            $order->update(['payment_status' => 'Thanh toán thành công']);

            // 🔹 Lưu thông tin thanh toán
            Payment::create([
                'order_id' => $order->id,
                'payment_date' => now(),
                'amount' => $order->total_amount,
                'payment_method' => 'VNPay',
                'payment_status' => 'Thanh toán thành công',
            ]);

            return response()->json(['message' => 'Thanh toán thành công', 'order_id' => $order->id], 200);
        } else {
            // 🔹 Thanh toán thất bại
            $order->update(['payment_status' => 'Thanh toán thất bại']);

            return response()->json(['message' => 'Thanh toán thất bại'], 400);
        }
    }
}
