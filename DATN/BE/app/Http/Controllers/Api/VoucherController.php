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
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoucherController extends Controller
{
    /**
     * 📌 Lấy danh sách tất cả voucher (Admin)
     */
    public function index()
    {
        return response()->json([
            'status' => true,
            'message' => 'Danh sách voucher',
            'data' => Voucher::all()
        ]);
    }

    /**
     * 📌 Tạo mới voucher (Admin)
     */
    public function store(Request $request)
    {
        $request->validate([
            'code'            => 'required|string|unique:vouchers,code',
            'description'     => 'nullable|string',
            'discount_type'   => 'required|in:percentage,fixed',
            'discount_value'  => 'required|numeric|min:0|max:100',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount'    => 'nullable|numeric|min:0',
            'usage_limit'     => 'required|integer|min:1',
            'status'          => 'required|in:Hoạt động,Ngưng hoạt động,Hết hạn'
        ]);

        $validated['status'] = $validated['status'] ?? 'Hoạt động';
        
        $voucher = Voucher::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Tạo voucher thành công',
            'data' => $voucher
        ], 201);
    }

    /**
     * 📌 Xem chi tiết voucher (Admin)
     */
    public function show($id)
    {
        $voucher = Voucher::findOrFail($id);
        return response()->json([
            'status' => true,
            'data' => $voucher
        ]);
    }

    /**
     * 📌 Cập nhật voucher (Admin)
     */
    public function update(Request $request, $id)
    {
        $voucher = Voucher::findOrFail($id);

        $request->validate([
            'code'            => 'string|unique:vouchers,code,' . $id,
            'description'     => 'nullable|string',
            'discount_type'   => 'in:percentage,fixed',
            'discount_value'  => 'numeric|min:0|max:100',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_discount'    => 'nullable|numeric|min:0',
            'usage_limit'     => 'integer|min:1',
            'status'          => 'in:Hoạt động,Ngưng hoạt động,Hết hạn'
        ]);

        $voucher->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật voucher thành công',
            'data' => $voucher
        ]);
    }

    /**
     * 📌 Xóa mềm voucher (Admin)
     */
    public function softDelete($id)
    {
        $voucher = Voucher::findOrFail($id);
        $voucher->delete();

        return response()->json([
            'status' => true,
            'message' => 'Voucher đã được xóa mềm'
        ]);
    }

    /**
     * 📌 Khôi phục voucher bị xóa mềm (Admin)
     */
    public function restore($id)
    {
        $voucher = Voucher::onlyTrashed()->findOrFail($id);
        $voucher->restore();

        return response()->json([
            'status' => true,
            'message' => 'Khôi phục voucher thành công'
        ]);
    }

    /**
     * 📌 Lấy danh sách voucher bị xóa mềm (Admin)
     */
    public function trashed()
    {
        $vouchers = Voucher::onlyTrashed()->get();
        return response()->json([
            'status' => true,
            'data' => $vouchers
        ]);
    }

    /**
     * 📌 Người dùng áp dụng voucher vào giỏ hàng / đơn hàng
     */
    public function applyVoucher(Request $request)
    {
        $request->validate([
            'code'       => 'required|string',
            'cart_total' => 'required|numeric|min:0'
        ]);

        // ✅ Tìm voucher hợp lệ
        $voucher = Voucher::where('code', $request->code)
            ->where('status', 'Hoạt động')
            ->whereColumn('used_count', '<', 'usage_limit')
            ->first();

        if (!$voucher) {
            return response()->json([
                'status' => false,
                'message' => 'Voucher không hợp lệ hoặc đã hết hạn'
            ], 400);
        }

        // ✅ Kiểm tra tổng đơn hàng có đủ điều kiện sử dụng voucher
        if ($voucher->min_order_value && $request->cart_total < $voucher->min_order_value) {
            return response()->json([
                'status' => false,
                'message' => 'Giá trị đơn hàng chưa đạt mức tối thiểu để áp dụng voucher'
            ], 400);
        }

        // ✅ Tính số tiền được giảm
        $discount = 0;
        if ($voucher->discount_type === 'percentage') {
            $discount = $request->cart_total * ($voucher->discount_value / 100);
            if ($voucher->max_discount) {
                $discount = min($discount, $voucher->max_discount);
            }
        } else {
            $discount = min($voucher->discount_value, $request->cart_total);
        }

        // ✅ Không được giảm vượt quá tổng đơn
        $discount = min($discount, $request->cart_total);
        $final_total = $request->cart_total - $discount;

        // ✅ Cộng thêm lượt sử dụng
        $voucher->increment('used_count');

        // ✅ Nếu hết lượt, cập nhật trạng thái voucher
        if ($voucher->used_count >= $voucher->usage_limit) {
            $voucher->update(['status' => 'Hết hạn']);
        }

        return response()->json([
            'status' => true,
            'message' => 'Áp dụng voucher thành công',
            'discount' => $discount,
            'final_total' => $final_total
        ]);
    }
}
