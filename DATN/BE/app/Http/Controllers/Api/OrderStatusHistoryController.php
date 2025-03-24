<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderStatusHistoryController extends Controller
{
    /**
     * 📌 Lấy danh sách lịch sử trạng thái của một đơn hàng
     */
    public function index($orderId)
    {
        $history = OrderStatusHistory::where('order_id', $orderId)
            ->with([
                'user:id,name,email', // 🔹 Lấy thêm `email` của người thay đổi trạng thái
                'order:id,order_code,status' // 🔹 Lấy thêm mã đơn hàng và trạng thái hiện tại
            ])
            ->orderByDesc('updated_at')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Lịch sử trạng thái đơn hàng',
            'data' => $history
        ]);
    }

    /**
     * 📌 Thêm mới lịch sử trạng thái đơn hàng (Admin hoặc nhân viên)
     */
    public function store(Request $request, $orderId)
    {
        $request->validate([
            'status' => 'required|string|in:Chờ xác nhận,Đã xác nhận,Đang giao hàng,Giao hàng thành công,Giao hàng thất bại,Hủy đơn',
            'note' => 'nullable|string|max:500'
        ]);

        // 🔹 Lưu trạng thái mới
        $history = OrderStatusHistory::create([
            'order_id' => $orderId,
            'user_id' => Auth::id(), // 🔹 Lưu ID của người thực hiện thay đổi
            'status' => $request->status,
            'note' => $request->note ?? null
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Đã cập nhật trạng thái đơn hàng',
            'data' => $history
        ], 201);
    }
}
