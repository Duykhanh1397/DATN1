<?php



// namespace App\Http\Controllers;

// use App\Models\Voucher;
// use Illuminate\Http\Request;

// class VoucherController extends Controller
// {
//     public function store(Request $request)
//     {
//         $request->validate([
//             'code' => 'required|string|max:255|unique:vouchers,code',
//             'discount_type' => 'required|string',
//             'discount_value' => 'required|numeric',
//             'start_date' => 'required|date',
//             'end_date' => 'required|date',
//             'usage_limit' => 'required|integer',
//             'min_order_value' => 'required|numeric'
//         ]);

//         $voucher = Voucher::create($request->all());
//         return response()->json($voucher, 201);
//     }

//     public function index()
//     {
//         return response()->json(Voucher::all());
//     }

//     public function show($id)
//     {
//         $voucher = Voucher::findOrFail($id);
//         return response()->json($voucher);
//     }

//     public function update(Request $request, $id)
//     {
//         // $request->validate([
//         //     'code' => 'sometimes|required|string|max:255|unique:vouchers,code,' . $id,
//         //     'discount_type' => 'required|string',
//         //     'discount_value' => 'required|numeric',
//         //     'start_date' => 'required|date',
//         //     'end_date' => 'required|date',
//         //     'usage_limit' => 'required|integer',
//         //     'min_order_value' => 'required|numeric'
//         // ]);
    
//         $voucher = Voucher::findOrFail($id);
//         $voucher->update($request->all());
//         return response()->json($voucher);
//     }
    
//     public function softDelete($id)
//     {
//         $voucher = Voucher::findOrFail($id);
//         $voucher->delete();
//         return response()->json(['message' => 'Voucher has been soft deleted.']);
//     }

//     public function restore($id)
//     {
//         $voucher = Voucher::withTrashed()->findOrFail($id);
//         $voucher->restore();
//         return response()->json(['message' => 'Voucher has been restored.']);
//     }

//     public function trashed()
//     {
//         return response()->json(Voucher::onlyTrashed()->get());
//     }

//     public function isValid($id)
//     {
//         $voucher = Voucher::findOrFail($id);
//         $now = now();

//         if ($now->between($voucher->start_date, $voucher->end_date) && $voucher->usage_limit > 0) {
//             return response()->json(['valid' => true, 'message' => 'Voucher is valid.']);
//         }

//         return response()->json(['valid' => false, 'message' => 'Voucher is not valid.']);
//     }

//     public function applyVoucher(Request $request, $id)
//     {
//         $voucher = Voucher::findOrFail($id);

//         if (!$voucher->isValid()) {
//             return response()->json(['message' => 'Voucher is not valid or expired.'], 400);
//         }

//         $orderValue = $request->input('order_value');

//         if (!$voucher->isApplicable($orderValue)) {
//             return response()->json(['message' => 'Order value does not meet the minimum requirement.'], 400);
//         }

//         $discount = $voucher->calculateDiscount($orderValue);

//         $voucher->decrementUsage();

//         return response()->json([
//             'discount' => $discount,
//             'message' => 'Voucher applied successfully.'
//         ]);
//     }

//     public function validVouchers()
//     {
//         return response()->json(Voucher::valid()->get());
//     }

//     public function expiringSoon()
//     {
//         return response()->json(Voucher::expiringSoon()->get());
//     }
// }

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Http\Controllers;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class VoucherController extends Controller
{
    /**
     *  Lấy danh sách tất cả voucher (chỉ Admin)
     */
    public function index()
    {
        return response()->json(Voucher::all());
    }

    /**
     * Tạo voucher mới (chỉ Admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:vouchers',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'required|integer|min:1',
            'status' => 'required|in:active,expired,disabled'
        ]);

        $voucher = Voucher::create($request->all());
        return response()->json(['message' => 'Voucher created successfully', 'data' => $voucher], 201);
    }

    /**
     * Lấy thông tin voucher cụ thể (chỉ Admin)
     */
    public function show($id)
    {
        return response()->json(Voucher::findOrFail($id));
    }

    /**
     *  Cập nhật voucher (chỉ Admin)
     */
    public function update(Request $request, $id)
    {
        $voucher = Voucher::findOrFail($id);

        $request->validate([
            'code' => 'string|unique:vouchers,code,' . $id,
            'discount_type' => 'in:percentage,fixed',
            'discount_value' => 'numeric|min:0',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'integer|min:1',
            'status' => 'in:active,expired,disabled'
        ]);

        $voucher->update($request->all());
        return response()->json(['message' => 'Voucher updated successfully', 'data' => $voucher]);
    }

    /**
     * Xóa mềm voucher (chỉ Admin)
     */
    public function softDelete($id)
    {
        $voucher = Voucher::findOrFail($id);
        $voucher->delete(); // Xóa mềm (đặt deleted_at)
        return response()->json(['message' => 'Voucher soft deleted successfully']);
    }

    /**
     * Khôi phục voucher đã bị xóa mềm (chỉ Admin)
     */
    public function restore($id)
    {
        $voucher = Voucher::onlyTrashed()->findOrFail($id);
        $voucher->restore(); // Khôi phục từ xóa mềm
        return response()->json(['message' => 'Voucher restored successfully']);
    }

    /**
     * Lấy danh sách voucher đã bị xóa mềm (chỉ Admin)
     */
    public function trashed()
    {
        return response()->json(Voucher::onlyTrashed()->get());
    }

    /**
     *  Áp dụng voucher khi thanh toán (Tất cả user có thể sử dụng)
     */
    public function applyVoucher(Request $request)
{
    //  Kiểm tra dữ liệu đầu vào
    $request->validate([
        'code' => 'required|string', // Mã voucher bắt buộc phải có
        'cart_total' => 'required|numeric|min:0' // Tổng tiền giỏ hàng phải >= 0
    ]);

    //  Tìm voucher hợp lệ
    $voucher = Voucher::where('code', $request->code)
        ->where('status', 'active') // Chỉ chấp nhận voucher đang hoạt động
        ->whereColumn('used_count', '<', 'usage_limit') // Chưa sử dụng hết số lần cho phép
        ->first();

    //  Nếu không tìm thấy voucher hợp lệ, trả về lỗi
    if (!$voucher) {
        return response()->json([
            'success' => false,
            'message' => 'This voucher is expired or invalid.'
        ], 400);
    }

    // ❌ 4. Kiểm tra nếu tổng tiền giỏ hàng có đạt điều kiện tối thiểu hay không
    if ($request->cart_total < $voucher->min_order_value) {
        return response()->json([
            'success' => false,
            'message' => 'Order value too low for this voucher.'
        ], 400);
    }

    //  Tính số tiền được giảm giá
    if ($voucher->discount_type === 'percentage') {
        // Nếu giảm giá theo phần trăm, không vượt quá max_discount (nếu có)
        $discount = min($request->cart_total * ($voucher->discount_value / 100), $voucher->max_discount);
    } else {
        // Nếu giảm giá theo số tiền cố định, không vượt quá tổng tiền giỏ hàng
        $discount = min($voucher->discount_value, $request->cart_total);
    }

    // Tăng số lần đã sử dụng của voucher
    $voucher->increment('used_count');

    //  Nếu đã sử dụng hết số lần cho phép, cập nhật trạng thái thành "expired"
    if ($voucher->used_count >= $voucher->usage_limit) {
        $voucher->update(['status' => 'Hết hạn']);
    }

    //  Trả về kết quả với số tiền giảm và tổng tiền sau khi áp dụng voucher
    return response()->json([
        'success' => true,
        'discount' => $discount, // Số tiền giảm giá
        'new_total' => $request->cart_total - $discount // Tổng tiền sau khi áp dụng voucher
    ]);
}

}
