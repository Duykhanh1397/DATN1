<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * 📌 Lấy danh sách đánh giá của một sản phẩm
     */
    public function index($product_id)
    {
        $reviews = Review::where('product_id', $product_id)
                        ->with(['user:id,name', 'order:id,order_code']) // Thêm thông tin đơn hàng
                        ->visible()
                        ->orderByDesc('created_at')
                        ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Danh sách đánh giá',
            'data' => $reviews
        ]);
    }

    /**
     * 📌 Thêm đánh giá cho một sản phẩm
     */
    public function store(Request $request, $product_id)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        // ✅ Kiểm tra xem đơn hàng đã hoàn tất chưa
        $order = Order::where('id', $request->order_id)
                      ->where('user_id', Auth::id())
                      ->where('status', 'Giao hàng thành công')
                      ->first();

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã giao thành công!'
            ], 400);
        }

        // ✅ Kiểm tra xem sản phẩm này đã được đánh giá từ đơn hàng này chưa
        $existingReview = Review::where('product_id', $product_id)
                                ->where('order_id', $request->order_id)
                                ->where('user_id', Auth::id())
                                ->first();

        if ($existingReview) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi!'
            ], 400);
        }

        // ✅ Tạo đánh giá mới
        $review = Review::create([
            'product_id' => $product_id,
            'order_id' => $request->order_id,
            'user_id' => Auth::id(),
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'Hiển thị'
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Đánh giá đã được thêm thành công',
            'data' => $review
        ], 201);
    }

    /**
     * 📌 Hiển thị chi tiết một đánh giá
     */
    public function show($id)
    {
        $review = Review::with(['product', 'user:id,name', 'order:id,order_code'])->findOrFail($id);

        return response()->json([
            'status' => true,
            'message' => 'Chi tiết đánh giá',
            'data' => $review
        ]);
    }

    /**
     * 📌 Cập nhật đánh giá (Chỉ chủ sở hữu có thể sửa)
     */
    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);

        // ✅ Kiểm tra xem người dùng có quyền chỉnh sửa không
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Bạn không có quyền chỉnh sửa đánh giá này'], 403);
        }

        $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        $review->update($request->only(['rating', 'comment']));

        return response()->json([
            'status' => true,
            'message' => 'Đánh giá đã được cập nhật',
            'data' => $review
        ]);
    }

    /**
     * 📌 Ẩn/Hiển thị đánh giá (Chỉ Admin)
     */
    public function toggleStatus($id)
    {
        $review = Review::findOrFail($id);

        $review->update(['status' => $review->status === 'Hiển thị' ? 'Ẩn' : 'Hiển thị']);

        return response()->json([
            'status' => true,
            'message' => 'Trạng thái đánh giá đã được cập nhật',
            'data' => $review
        ]);
    }

    /**
     * 📌 Xóa mềm đánh giá (Chỉ chủ sở hữu hoặc Admin)
     */
    public function destroy($id)
    {
        $review = Review::findOrFail($id);

        if ($review->user_id !== Auth::id() && Auth::user()->role !== 'Admin') {
            return response()->json(['message' => 'Bạn không có quyền xóa đánh giá này'], 403);
        }

        $review->delete();

        return response()->json([
            'status' => true,
            'message' => 'Đánh giá đã bị xóa'
        ]);
    }

    /**
     * 📌 Khôi phục đánh giá đã bị xóa mềm (Chỉ Admin)
     */
    public function restore($id)
    {
        $review = Review::onlyTrashed()->findOrFail($id);
        $review->restore();

        return response()->json([
            'status' => true,
            'message' => 'Đánh giá đã được khôi phục'
        ]);
    }

    /**
     * 📌 Lấy danh sách đánh giá đã bị xóa mềm (Chỉ Admin)
     */
    public function trashed()
    {
        $reviews = Review::onlyTrashed()->with('user:id,name')->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Danh sách đánh giá đã xóa mềm',
            'data' => $reviews
        ]);
    }

    /**
     * 📌 Lấy lịch sử đánh giá của khách hàng (có thể có nhiều lần đánh giá 1 sản phẩm)
     */
    public function history($user_id)
    {
        $reviews = Review::where('user_id', $user_id)
                         ->with(['product:id,name', 'order:id,order_code'])
                         ->orderByDesc('created_at')
                         ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Lịch sử đánh giá của khách hàng',
            'data' => $reviews
        ]);
    }
}
