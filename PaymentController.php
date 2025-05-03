<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{

    public function vnpay_payment(Request $request)
    {
        $data = $request->all();
        $code_cart = rand(00, 9999);
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:5173/payment-return";;
        $vnp_TmnCode = "UETPMW0E"; //Mã website tại VNPAY
        $vnp_HashSecret = "9W6GQVGNQ2Y177112JVPZQK8ZFBXYH37"; //Chuỗi bí mật

        $vnp_TxnRef = $code_cart; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
        $vnp_OrderInfo = 'Thanh toán đơn hàng test';
        $vnp_OrderType = 'billpayment';
        $vnp_Amount = $data['total_vnpay'] * 100;
        $vnp_Locale = 'vn';
        // $vnp_BankCode = 'NCB';
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,

        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        //var_dump($inputData);
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret); //
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        $returnData = array(
            'code' => '00',
            'message' => 'success',
            'data' => $vnp_Url
        );
        if (isset($_POST['redirect'])) {
            header('Location: ' . $vnp_Url);
            die();
        } else {
            echo json_encode($returnData);
        }
    }

    // public function vnpayReturn(Request $request)
    // {
    //     $inputData = $request->all();
    //     $vnp_HashSecret = config('vnpay.vnp_HashSecret');

    //     if (!$vnp_HashSecret) {
    //         return response()->json(['message' => 'Cấu hình VNPay chưa đầy đủ!'], 500);
    //     }

    //     // Kiểm tra chữ ký bảo mật
    //     $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
    //     unset($inputData['vnp_SecureHash']);

    //     ksort($inputData);
    //     $hashData = urldecode(http_build_query($inputData));
    //     $expectedSecureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

    //     if ($vnp_SecureHash !== $expectedSecureHash) {
    //         Log::error("Sai chữ ký khi xác nhận thanh toán VNPay!", ['request' => $inputData]);
    //         return response()->json(['message' => 'Sai chữ ký thanh toán!'], 400);
    //     }

    //     // Kiểm tra kết quả thanh toán
    //     if ($request->vnp_ResponseCode == "00") {
    //         // Thanh toán thành công
    //         $txnRef = $request->vnp_TxnRef;
    //         $order = Order::where('vnp_txn_ref', $txnRef)->first();

    //         if ($order) {
    //             // Cập nhật trạng thái đơn hàng
    //             $order->status = 'Chờ xác nhận';
    //             $order->payment_method = 'VNPay';
    //             $order->payment_status = 'Thanh toán thành công';
    //             $order->transaction_id = $request->vnp_TransactionNo;
    //             $order->save();

    //             // Xóa sản phẩm trong giỏ hàng
    //             DB::table('cart_items')->where('user_id', $order->user_id)->delete();

    //             return response()->json(['message' => 'Thanh toán thành công!', 'order_id' => $order->id]);
    //         }
    //     } else {
    //         // Thanh toán không thành công - Hủy đơn hàng
    //         $txnRef = $request->vnp_TxnRef;
    //         $order = Order::where('vnp_txn_ref', $txnRef)->first();

    //         if ($order) {
    //             // Hủy đơn hàng nếu thanh toán không thành công
    //             $order->status = 'Đã hủy';
    //             $order->payment_status = 'Thanh toán thất bại';
    //             $order->save();

    //             return response()->json(['message' => 'Thanh toán không thành công, đơn hàng đã bị hủy.'], 400);
    //         }
    //     }

    //     return response()->json(['message' => 'Thanh toán không thành công!'], 400);
    // }

    public function vnpayReturn(Request $request)
    {
        // Redirect về frontend (bạn có thể ghi log chi tiết nếu cần)
        return redirect()->to(env('FRONTEND_URL', 'http://localhost:5173') . "/payment-return?" . http_build_query($request->all()));
    }
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'order_id' => 'required|exists:orders,id',
                'amount' => 'required|numeric|min:0',
                'payment_method' => 'required|in:COD,VNPay',
                'payment_status' => 'required|in:Chờ thanh toán,Thanh toán thành công,Thanh toán thất bại',
                'payment_date' => 'required|date',
            ]);

            $payment = Payment::create($validated);

            return response()->json([
                'status' => true,
                'message' => 'Lưu thanh toán thành công',
                'payment' => $payment,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Lỗi lưu thanh toán: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lưu thanh toán: ' . $e->getMessage(),
            ], 500);
        }
    }
}
