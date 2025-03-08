<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    // 1. Xử lý Thanh Toán VNPay
    public function payment(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);
    
        // Kiểm tra nếu đơn hàng đã thanh toán
        if ($order->payment_status == 'Thanh toán thành công') {
            return response()->json(['message' => 'Đơn hàng đã thanh toán'], 400);
        }
    
        if ($order->payment_method == 'COD') {
            // Nếu chọn COD, chỉ cập nhật trạng thái thanh toán là "Chờ thanh toán"
            $order->update(['payment_status' => 'Chờ thanh toán']);
            return response()->json(['message' => 'Đơn hàng sẽ thanh toán khi nhận hàng']);
        }
    
        // Gửi yêu cầu thanh toán tới VNPay
        $vnp_TxnRef = strtoupper(Str::random(10)); // Mã đơn hàng
        $vnp_Amount = $order->total_amount * 100; // VNPay yêu cầu nhân với 100
        $vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // URL của VNPay
        $vnp_SecureHash = 'VNPay_SECURE_HASH'; // Lấy từ VNPay
    
        // Thực hiện yêu cầu API từ VNPay
        $response = Http::asForm()->post($vnp_Url, [
            'vnp_TxnRef' => $vnp_TxnRef,
            'vnp_Amount' => $vnp_Amount,
            'vnp_Currency' => 'VND',
            'vnp_OrderInfo' => 'Thanh toán đơn hàng ' . $order->order_code,
            'vnp_Locale' => 'vn',
            'vnp_ReturnUrl' => route('payment.result', $vnp_TxnRef), // URL trả về sau khi thanh toán thành công
            'vnp_SecureHash' => $vnp_SecureHash,
        ]);
    
        return redirect($response->json()['url']);
    }
    

    // 2. Nhận Kết Quả Thanh Toán Từ VNPay
    public function paymentResult(Request $request, $vnp_TxnRef)
    {
        $order = Order::where('order_code', $vnp_TxnRef)->first();

        // Kiểm tra nếu đơn hàng đã thanh toán
        if ($order->status == 'completed') {
            return response()->json(['message' => 'Đơn hàng đã thanh toán'], 200);
        }

        // Kiểm tra kết quả từ VNPay
        if ($request->input('vnp_ResponseCode') == '00') {
            // Thanh toán thành công
            $order->update(['status' => 'completed']);

            // Lưu thông tin thanh toán
            Payment::create([
                'order_id' => $order->id,
                'payment_date' => now(),
                'amount' => $order->total_amount,
                'payment_method' => 'VNPay',
                'payment_status' => 'success',
            ]);

            return response()->json(['message' => 'Thanh toán thành công'], 200);
        } else {
            // Thanh toán thất bại
            return response()->json(['message' => 'Thanh toán thất bại'], 400);
        }
    }
}
