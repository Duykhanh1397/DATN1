<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    /**
     * 📌 Lấy danh sách đánh giá của một sản phẩm
     */
    public function index(Request $request, $product_variant_id)
    {
        try {
            Log::info('Lấy danh sách đánh giá', [
                'product_variant_id' => $product_variant_id,
            ]);

            $productVariant = ProductVariant::find($product_variant_id);
            if (!$productVariant) {
                return response()->json([
                    'status' => false,
                    'message' => 'Biến thể sản phẩm không tồn tại!'
                ], 404);
            }

            $reviews = Review::with(['user:id,name', 'order:id,order_code', 'product:id,name'])
                            ->visible()
                            ->byProductVariant($product_variant_id)
                            ->orderBy('created_at', 'desc')
                            ->paginate(10);

            Log::info('Đã lấy danh sách đánh giá', [
                'product_variant_id' => $product_variant_id,
                'total_reviews' => $reviews->total(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Lấy danh sách đánh giá thành công',
                'data' => $reviews
            ], 200);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy danh sách đánh giá: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'product_variant_id' => $product_variant_id,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh sách đánh giá. Vui lòng thử lại!'
            ], 500);
        }
    }







    /**
     * 📌 Thêm đánh giá cho một sản phẩm
     */
    // public function store(Request $request, $product_id)
    // {
    //     if (!Auth::check()) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Bạn cần đăng nhập để đánh giá sản phẩm!'
    //         ], 401);
    //     }
    
    //     $request->validate([
    //         'order_id' => 'required|exists:orders,id',
    //         'rating' => 'required|integer|min:1|max:5',
    //         'comment' => 'nullable|string|max:1000'
    //     ]);
    
    //     try {
    //         Log::info('Bắt đầu xử lý đánh giá', [
    //             'product_id' => $product_id,
    //             'order_id' => $request->order_id,
    //             'user_id' => Auth::id(),
    //         ]);
    
    //         $order = Order::where('id', $request->order_id)
    //                       ->where('user_id', Auth::id())
    //                       ->where('status', 'Giao hàng thành công')
    //                       ->first();
    
    //         if (!$order) {
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Bạn chỉ có thể đánh giá sản phẩm sau khi đơn hàng đã giao thành công!'
    //             ], 400);
    //         }
    
    //         Log::info('Đã tìm thấy đơn hàng', ['order_id' => $order->id]);
    
    //         // Lấy tất cả order items để debug
    //         $orderItems = $order->orderItems()->with('productVariant')->get();
    //         Log::info('Danh sách order items', [
    //             'order_id' => $request->order_id,
    //             'order_items' => $orderItems->toArray(),
    //         ]);
    
    //         // Kiểm tra xem sản phẩm có trong đơn hàng không
    //         $orderItem = $order->orderItems()
    //                            ->whereHas('productVariant', function ($query) use ($product_id) {
    //                                $query->where('product_id', $product_id);
    //                            })
    //                            ->first();
    
    //         if (!$orderItem) {
    //             Log::info('Không tìm thấy sản phẩm trong đơn hàng', [
    //                 'order_id' => $request->order_id,
    //                 'product_id' => $product_id,
    //             ]);
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Sản phẩm này không thuộc đơn hàng của bạn!'
    //             ], 400);
    //         }
    
    //         Log::info('Đã tìm thấy order item', ['order_item_id' => $orderItem->id]);
    
    //         $existingReview = Review::where('product_id', $product_id)
    //                                 ->where('order_id', $request->order_id)
    //                                 ->where('user_id', Auth::id())
    //                                 ->first();
    
    //         if ($existingReview) {
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi!'
    //             ], 400);
    //         }
    
    //         // Dữ liệu để tạo đánh giá
    //         $reviewData = [
    //             'product_id' => $product_id,
    //             'order_id' => $request->order_id,
    //             'user_id' => Auth::id(),
    //             'rating' => $request->rating,
    //             'comment' => $request->comment,
    //             'status' => 'Hiển thị',
    //         ];
    
    //         Log::info('Tạo đánh giá mới', $reviewData);
    
    //         // Kiểm tra dữ liệu trước khi tạo
    //         if (!in_array($reviewData['status'], ['Hiển thị', 'Ẩn'])) {
    //             throw new \Exception('Giá trị status không hợp lệ: ' . $reviewData['status']);
    //         }
    
    //         $review = Review::create($reviewData);
    
    //         Log::info('Đã tạo đánh giá thành công', ['review_id' => $review->id]);
    
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'Đánh giá đã được thêm thành công',
    //             'data' => $review
    //         ], 201);
    //     } catch (\Exception $e) {
    //         Log::error('Lỗi khi tạo đánh giá: ' . $e->getMessage(), [
    //             'stack' => $e->getTraceAsString(),
    //             'product_id' => $product_id,
    //             'order_id' => $request->order_id,
    //             'user_id' => Auth::id(),
    //         ]);
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Có lỗi xảy ra khi lưu đánh giá. Vui lòng thử lại!'
    //         ], 500);
    //     }
    // }










    public function store(Request $request, $product_variant_id)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn cần đăng nhập để đánh giá sản phẩm!'
            ], 401);
        }

        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        try {
            Log::info('Bắt đầu xử lý đánh giá', [
                'product_variant_id' => $product_variant_id,
                'order_id' => $request->order_id,
                'user_id' => Auth::id(),
            ]);

            // Kiểm tra xem biến thể có tồn tại không
            $productVariant = ProductVariant::find($product_variant_id);
            if (!$productVariant) {
                return response()->json([
                    'status' => false,
                    'message' => 'Biến thể sản phẩm không tồn tại!'
                ], 404);
            }

            // Lấy product_id từ biến thể
            $productId = $productVariant->product_id;
            if (!$productId) {
                Log::error('Không tìm thấy product_id cho biến thể', [
                    'product_variant_id' => $product_variant_id,
                ]);
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy thông tin sản phẩm!'
                ], 400);
            }

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

            Log::info('Đã tìm thấy đơn hàng', ['order_id' => $order->id]);

            // Kiểm tra xem biến thể sản phẩm có trong đơn hàng không
            $orderItem = $order->orderItems()
                               ->where('product_variant_id', $product_variant_id)
                               ->first();

            if (!$orderItem) {
                Log::info('Không tìm thấy biến thể sản phẩm trong đơn hàng', [
                    'order_id' => $request->order_id,
                    'product_variant_id' => $product_variant_id,
                ]);
                return response()->json([
                    'status' => false,
                    'message' => 'Biến thể sản phẩm này không thuộc đơn hàng của bạn!'
                ], 400);
            }

            Log::info('Đã tìm thấy order item', ['order_item_id' => $orderItem->id]);

            // Kiểm tra xem người dùng đã đánh giá biến thể này trong đơn hàng này chưa
            $existingReview = Review::where('product_variant_id', $product_variant_id)
                                    ->where('order_id', $request->order_id)
                                    ->where('user_id', Auth::id())
                                    ->first();

            if ($existingReview) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn đã đánh giá biến thể sản phẩm này trong đơn hàng này rồi!'
                ], 400);
            }

            // Dữ liệu để tạo đánh giá
            $reviewData = [
                'product_id' => $productId,
                'product_variant_id' => $product_variant_id,
                'order_id' => $request->order_id,
                'user_id' => Auth::id(),
                'rating' => $request->rating,
                'comment' => $request->comment,
                'status' => 'Hiển thị',
            ];

            Log::info('Tạo đánh giá mới', $reviewData);

            // Kiểm tra dữ liệu trước khi tạo
            if (!in_array($reviewData['status'], ['Hiển thị', 'Ẩn'])) {
                throw new \Exception('Giá trị status không hợp lệ: ' . $reviewData['status']);
            }

            $review = Review::create($reviewData);

            Log::info('Đã tạo đánh giá thành công', ['review_id' => $review->id]);

            return response()->json([
                'status' => true,
                'message' => 'Đánh giá đã được thêm thành công',
                'data' => $review
            ], 201);
        } catch (\Exception $e) {
            Log::error('Lỗi khi tạo đánh giá: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'product_variant_id' => $product_variant_id,
                'order_id' => $request->order_id,
                'user_id' => Auth::id(),
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lưu đánh giá. Vui lòng thử lại!'
            ], 500);
        }
    }


















   /**
     * Lấy danh sách đơn hàng có thể đánh giá cho biến thể sản phẩm
     */
    public function getReviewableOrders($product_variant_id)
    {
        if (!Auth::check()) {
            return response()->json([
                'status' => false,
                'message' => 'Bạn cần đăng nhập để xem danh sách đơn hàng!'
            ], 401);
        }

        try {
            Log::info('Lấy danh sách đơn hàng có thể đánh giá', [
                'product_variant_id' => $product_variant_id,
                'user_id' => Auth::id(),
            ]);

            $productVariant = ProductVariant::find($product_variant_id);
            if (!$productVariant) {
                return response()->json([
                    'status' => false,
                    'message' => 'Biến thể sản phẩm không tồn tại!'
                ], 404);
            }

            $orders = Order::where('user_id', Auth::id())
                           ->where('status', 'Giao hàng thành công')
                           ->whereHas('orderItems', function ($query) use ($product_variant_id) {
                               $query->where('product_variant_id', $product_variant_id);
                           })
                           ->whereDoesntHave('reviews', function ($query) use ($product_variant_id) {
                               $query->where('product_variant_id', $product_variant_id)
                                     ->where('user_id', Auth::id());
                           })
                           ->select('id', 'order_code', 'created_at')
                           ->get();

            Log::info('Đã lấy danh sách đơn hàng có thể đánh giá', [
                'product_variant_id' => $product_variant_id,
                'total_orders' => $orders->count(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Danh sách đơn hàng có thể đánh giá',
                'data' => $orders
            ], 200);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy danh sách đơn hàng có thể đánh giá: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'product_variant_id' => $product_variant_id,
                'user_id' => Auth::id(),
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh sách đơn hàng. Vui lòng thử lại!'
            ], 500);
        }
    }

    /**
     * Lấy chi tiết một đánh giá
     */
    public function show($id)
    {
        try {
            Log::info('Lấy chi tiết đánh giá', ['review_id' => $id]);

            $review = Review::with(['product:id,name', 'productVariant', 'user:id,name', 'order:id,order_code'])
                            ->findOrFail($id);

            Log::info('Đã lấy chi tiết đánh giá', ['review_id' => $id]);

            return response()->json([
                'status' => true,
                'message' => 'Chi tiết đánh giá',
                'data' => $review
            ], 200);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy chi tiết đánh giá: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'review_id' => $id,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lấy chi tiết đánh giá. Vui lòng thử lại!'
            ], 500);
        }
    }

    /**
     * Cập nhật đánh giá (Chỉ chủ sở hữu có thể sửa)
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Cập nhật đánh giá', ['review_id' => $id, 'user_id' => Auth::id()]);

            $review = Review::findOrFail($id);

            if ($review->user_id !== Auth::id()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không có quyền chỉnh sửa đánh giá này'
                ], 403);
            }

            $request->validate([
                'rating' => 'sometimes|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000'
            ]);

            $review->update($request->only(['rating', 'comment']));

            Log::info('Đã cập nhật đánh giá', ['review_id' => $id]);

            return response()->json([
                'status' => true,
                'message' => 'Đánh giá đã được cập nhật',
                'data' => $review
            ], 200);
        } catch (\Exception $e) {
            Log::error('Lỗi khi cập nhật đánh giá: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'review_id' => $id,
                'user_id' => Auth::id(),
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật đánh giá. Vui lòng thử lại!'
            ], 500);
        }
    }

    /**
     * Ẩn/Hiển thị đánh giá (Chỉ Admin)
     */
    public function toggleStatus($id)
    {
        try {
            Log::info('Thay đổi trạng thái đánh giá', ['review_id' => $id]);

            $review = Review::findOrFail($id);

            $newStatus = $review->status === 'Hiển thị' ? 'Ẩn' : 'Hiển thị';
            $review->update(['status' => $newStatus]);

            Log::info('Đã thay đổi trạng thái đánh giá', [
                'review_id' => $id,
                'new_status' => $newStatus,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Trạng thái đánh giá đã được cập nhật',
                'data' => $review
            ], 200);
        } catch (\Exception $e) {
            Log::error('Lỗi khi thay đổi trạng thái đánh giá: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'review_id' => $id,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi thay đổi trạng thái đánh giá. Vui lòng thử lại!'
            ], 500);
        }
    }

    /**
     * Xóa mềm đánh giá (Chủ sở hữu hoặc Admin)
     */
    public function destroy($id)
    {
        try {
            Log::info('Xóa mềm đánh giá', ['review_id' => $id, 'user_id' => Auth::id()]);

            $review = Review::findOrFail($id);

            if ($review->user_id !== Auth::id() && Auth::user()->role !== 'Admin') {
                return response()->json([
                    'status' => false,
                    'message' => 'Bạn không có quyền xóa đánh giá này'
                ], 403);
            }

            $review->delete();

            Log::info('Đã xóa mềm đánh giá', ['review_id' => $id]);

            return response()->json([
                'status' => true,
                'message' => 'Đánh giá đã bị xóa'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Lỗi khi xóa mềm đánh giá: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'review_id' => $id,
                'user_id' => Auth::id(),
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại!'
            ], 500);
        }
    }

    /**
     * Khôi phục đánh giá đã bị xóa mềm (Chỉ Admin)
     */
    public function restore($id)
    {
        try {
            Log::info('Khôi phục đánh giá', ['review_id' => $id]);

            $review = Review::onlyTrashed()->findOrFail($id);
            $review->restore();

            Log::info('Đã khôi phục đánh giá', ['review_id' => $id]);

            return response()->json([
                'status' => true,
                'message' => 'Đánh giá đã được khôi phục'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Lỗi khi khôi phục đánh giá: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'review_id' => $id,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi khôi phục đánh giá. Vui lòng thử lại!'
            ], 500);
        }
    }

    /**
     * Lấy danh sách đánh giá đã bị xóa mềm (Chỉ Admin)
     */
    public function trashed()
    {
        try {
            Log::info('Lấy danh sách đánh giá đã xóa mềm');

            $reviews = Review::onlyTrashed()
                            ->with('user:id,name')
                            ->paginate(10);

            Log::info('Đã lấy danh sách đánh giá đã xóa mềm', [
                'total_reviews' => $reviews->total(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Danh sách đánh giá đã xóa mềm',
                'data' => $reviews
            ], 200);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy danh sách đánh giá đã xóa mềm: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lấy danh sách đánh giá đã xóa mềm. Vui lòng thử lại!'
            ], 500);
        }
    }

    /**
     * Lấy lịch sử đánh giá của một người dùng
     */
    public function history($user_id)
    {
        try {
            Log::info('Lấy lịch sử đánh giá', ['user_id' => $user_id]);

            $reviews = Review::where('user_id', $user_id)
                             ->with(['product:id,name', 'productVariant', 'order:id,order_code'])
                             ->orderBy('created_at', 'desc')
                             ->paginate(10);

            Log::info('Đã lấy lịch sử đánh giá', [
                'user_id' => $user_id,
                'total_reviews' => $reviews->total(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Lịch sử đánh giá của khách hàng',
                'data' => $reviews
            ], 200);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy lịch sử đánh giá: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'user_id' => $user_id,
            ]);
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi lấy lịch sử đánh giá. Vui lòng thử lại!'
            ], 500);
        }
    }
 
public function allReviews()
{
    $reviews = Review::with([
        'user:id,name',
        'order:id,order_code',
        'product:id,name',
        'productVariant:id,product_id,color_id,storage_id', // Chỉ định các trường cần thiết
        'productVariant.color',  // Eager load quan hệ với VariantColor
        'productVariant.storage' // Eager load quan hệ với VariantStorage
    ])
    ->select(
        'id',
        'user_id',
        'order_id',
        'product_id',
        'product_variant_id',
        'rating',
        'comment',
        'status',
        'created_at'
    )
    ->get();

    return response()->json([
        'data' => $reviews,
        'message' => 'Danh sách đánh giá',
    ]);
}



}