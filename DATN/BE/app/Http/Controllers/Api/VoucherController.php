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
use App\Models\User;
use App\Models\Voucher;
use App\Models\VoucherUser;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

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
        try {
            $validated = $request->validate([
                'code' => 'required|string|min:3|max:50|unique:vouchers,code',
                'discount_type' => 'required|in:percentage,fixed',
                'discount_value' => [
                    'required',
                    'numeric',
                    'min:1',
                    function ($attribute, $value, $fail) use ($request) {
                        if ($request->discount_type === 'percentage' && $value > 100) {
                            $fail('Giá trị giảm giá không được vượt quá 100%');
                        }
                    },
                ],
                'min_order_value' => 'nullable|numeric|min:0',
                'max_discount' => 'nullable|numeric|min:0',
                'usage_limit' => 'required|integer|min:1',
                'start_date' => 'required|date', // Allow any date
                'end_date' => 'required|date|after:start_date', // Ensure end_date is after start_date
                'status' => 'required|in:Hoạt động,Ngưng hoạt động',
            ], [
                'code.required' => 'Mã voucher là bắt buộc.',
                'code.string' => 'Mã voucher phải là chuỗi ký tự.',
                'code.min' => 'Mã voucher phải có ít nhất 3 ký tự.',
                'code.max' => 'Mã voucher không được vượt quá 50 ký tự.',
                'code.unique' => 'Mã voucher đã tồn tại.',
                'discount_type.required' => 'Loại giảm giá là bắt buộc.',
                'discount_type.in' => 'Loại giảm giá không hợp lệ.',
                'discount_value.required' => 'Giá trị giảm giá là bắt buộc.',
                'discount_value.numeric' => 'Giá trị giảm giá phải là số.',
                'discount_value.min' => 'Giá trị giảm giá phải lớn hơn 0.',
                'min_order_value.numeric' => 'Giá trị đơn hàng tối thiểu phải là số.',
                'min_order_value.min' => 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0.',
                'max_discount.numeric' => 'Giảm giá tối đa phải là số.',
                'max_discount.min' => 'Giảm giá tối đa không được nhỏ hơn 0.',
                'usage_limit.required' => 'Giới hạn sử dụng là bắt buộc.',
                'usage_limit.integer' => 'Giới hạn sử dụng phải là số nguyên.',
                'usage_limit.min' => 'Giới hạn sử dụng phải lớn hơn hoặc bằng 1.',
                'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
                'start_date.date' => 'Ngày bắt đầu không hợp lệ.',
                'end_date.required' => 'Ngày kết thúc là bắt buộc.',
                'end_date.date' => 'Ngày kết thúc không hợp lệ.',
                'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
                'status.required' => 'Tình trạng là bắt buộc.',
                'status.in' => 'Tình trạng không hợp lệ.',
            ]);

            $voucher = Voucher::create($validated);

            return response()->json([
                'status' => true,
                'message' => 'Tạo voucher thành công',
                'data' => $voucher,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi tạo voucher',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

 

   

    /**
     * 📌 Xem chi tiết voucher (Admin)
     */
    public function show($id)
    {
        try {
            $voucher = Voucher::findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => 'Thông tin voucher',
                'data' => $voucher
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy voucher',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * 📌 Cập nhật voucher (Admin)
     */
    public function update(Request $request, $id)
    {
        try {
            $voucher = Voucher::findOrFail($id);

            $validated = $request->validate([
                'code' => 'required|string|min:3|max:50|unique:vouchers,code,' . $voucher->id,
                'discount_type' => 'required|in:percentage,fixed',
                'discount_value' => [
                    'required',
                    'numeric',
                    'min:1',
                    function ($attribute, $value, $fail) use ($request) {
                        if ($request->discount_type === 'percentage' && $value > 100) {
                            $fail('Giá trị giảm giá không được vượt quá 100%');
                        }
                    },
                ],
                'min_order_value' => 'nullable|numeric|min:0',
                'max_discount' => 'nullable|numeric|min:0',
                'usage_limit' => 'required|integer|min:1',
                'start_date' => 'required|date', // Allow any date
                'end_date' => 'required|date|after:start_date', // Ensure end_date is after start_date
                'status' => 'required|in:Hoạt động,Ngưng hoạt động,Hết hạn',
            ], [
                'code.required' => 'Mã voucher là bắt buộc.',
                'code.string' => 'Mã voucher phải là chuỗi ký tự.',
                'code.min' => 'Mã voucher phải có ít nhất 3 ký tự.',
                'code.max' => 'Mã voucher không được vượt quá 50 ký tự.',
                'code.unique' => 'Mã voucher đã tồn tại.',
                'discount_type.required' => 'Loại giảm giá là bắt buộc.',
                'discount_type.in' => 'Loại giảm giá không hợp lệ.',
                'discount_value.required' => 'Giá trị giảm giá là bắt buộc.',
                'discount_value.numeric' => 'Giá trị giảm giá phải là số.',
                'discount_value.min' => 'Giá trị giảm giá phải lớn hơn 0.',
                'min_order_value.numeric' => 'Giá trị đơn hàng tối thiểu phải là số.',
                'min_order_value.min' => 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0.',
                'max_discount.numeric' => 'Giảm giá tối đa phải là số.',
                'max_discount.min' => 'Giảm giá tối đa không được nhỏ hơn 0acente.',
                'usage_limit.required' => 'Giới hạn sử dụng là bắt buộc.',
                'usage_limit.integer' => 'Giới hạn sử dụng phải là số nguyên.',
                'usage_limit.min' => 'Giới hạn sử dụng phải lớn hơn hoặc bằng 1.',
                'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
                'start_date.date' => 'Ngày bắt đầu không hợp lệ.',
                'end_date.required' => 'Ngày kết thúc là bắt buộc.',
                'end_date.date' => 'Ngày kết thúc không hợp lệ.',
                'end_date.after' => 'Ngày kết thúc phải sau ngày bắt đầu.',
                'status.required' => 'Tình trạng là bắt buộc.',
                'status.in' => 'Tình trạng không hợp lệ.',
            ]);

            $voucher->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật voucher thành công',
                'data' => $voucher,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật voucher',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

   /**
     * 📌 Xóa mềm voucher (Admin)
     */
    public function softDelete($id)
    {
        try {
            $voucher = Voucher::findOrFail($id);
            $voucher->delete();

            return response()->json([
                'status' => true,
                'message' => 'Voucher đã được xóa mềm'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy voucher để xóa mềm',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * 📌 Khôi phục voucher bị xóa mềm (Admin)
     */
    public function restore($id)
    {
        try {
            $voucher = Voucher::onlyTrashed()->findOrFail($id);
            $voucher->restore();

            return response()->json([
                'status' => true,
                'message' => 'Khôi phục voucher thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy voucher để khôi phục',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * 📌 Lấy danh sách voucher bị xóa mềm (Admin)
     */
    public function trashed()
    {
        $vouchers = Voucher::onlyTrashed()->get();
        return response()->json([
            'status' => true,
            'message' => 'Danh sách voucher đã xóa mềm',
            'data' => $vouchers
        ]);
    }

    /**
     * 📌 Xóa vĩnh viễn voucher (Admin)
     */
    public function forceDelete($id)
    {
        try {
            $voucher = Voucher::onlyTrashed()->findOrFail($id);
            $voucher->forceDelete();

            return response()->json([
                'status' => true,
                'message' => 'Voucher đã bị xóa vĩnh viễn'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy voucher để xóa vĩnh viễn',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * 📌 Người dùng áp dụng voucher vào giỏ hàng / đơn hàng
     */

     public function applyVoucher(Request $request)
     {
         try {
             $validated = $request->validate([
                 'code' => 'required|string',
                 'cart_total' => 'required|numeric|min:0',
             ], [
                 'code.required' => 'Mã voucher là bắt buộc.',
                 'code.string' => 'Mã voucher phải là chuỗi ký tự.',
                 'cart_total.required' => 'Tổng giá trị giỏ hàng là bắt buộc.',
                 'cart_total.numeric' => 'Tổng giá trị giỏ hàng phải là số.',
                 'cart_total.min' => 'Tổng giá trị giỏ hàng không được nhỏ hơn 0.',
             ]);
 
             $user = Auth::user();
             if (!$user) {
                 return response()->json([
                     'status' => false,
                     'message' => 'Bạn cần đăng nhập để áp dụng voucher'
                 ], 401);
             }
 
             $code = trim($request->code);
             Log::info('Applying voucher', [
                 'code' => $code,
                 'user_id' => $user->id,
                 'cart_total' => $request->cart_total,
                 'current_time' => Carbon::now()->toDateTimeString(),
                 'timezone' => config('app.timezone'),
             ]);
 
             $voucher = Voucher::where('code', $code)->first();
             if (!$voucher) {
                 Log::info('Voucher not found', [
                     'code' => $code,
                     'current_time' => Carbon::now()->toDateTimeString(),
                 ]);
                 return response()->json([
                     'status' => false,
                     'message' => 'Không tìm thấy voucher với mã này'
                 ], 400);
             }
 
             $userExists = User::where('id', $user->id)->exists();
             if (!$userExists) {
                 Log::error('User does not exist', ['user_id' => $user->id]);
                 return response()->json([
                     'status' => false,
                     'message' => 'Tài khoản không tồn tại'
                 ], 400);
             }
 
             $voucherExists = Voucher::where('id', $voucher->id)->exists();
             if (!$voucherExists) {
                 Log::error('Voucher does not exist', ['voucher_id' => $voucher->id]);
                 return response()->json([
                     'status' => false,
                     'message' => 'Voucher không tồn tại'
                 ], 400);
             }
 
             $hasUsed = VoucherUser::where('user_id', $user->id)
                                  ->where('voucher_id', $voucher->id)
                                  ->exists();
             if ($hasUsed) {
                 Log::info('User has already used this voucher', [
                     'user_id' => $user->id,
                     'voucher_id' => $voucher->id,
                 ]);
                 return response()->json([
                     'status' => false,
                     'message' => 'Bạn đã sử dụng voucher này rồi. Mỗi tài khoản chỉ được sử dụng voucher một lần.'
                 ], 400);
             }
 
             $now = Carbon::now();
             $isValid = true;
             $invalidReason = '';
 
             if ($voucher->status !== 'Hoạt động') {
                 $isValid = false;
                 $invalidReason = "Voucher không ở trạng thái Hoạt động (trạng thái hiện tại: {$voucher->status})";
             }
 
             if ($voucher->used_count >= $voucher->usage_limit) {
                 $isValid = false;
                 $invalidReason = "Voucher đã hết lượt sử dụng (đã dùng: {$voucher->used_count}/{$voucher->usage_limit})";
             }
 
             if ($voucher->start_date && Carbon::parse($voucher->start_date)->gt($now)) {
                 $isValid = false;
                 $startDateLocal = Carbon::parse($voucher->start_date)->setTimezone('Asia/Ho_Chi_Minh');
                 $invalidReason = "Voucher chưa có hiệu lực (bắt đầu từ: {$startDateLocal->format('Y-m-d H:i:s')})";
             }
 
             if ($voucher->end_date && Carbon::parse($voucher->end_date)->lt($now)) {
                 $isValid = false;
                 $endDateLocal = Carbon::parse($voucher->end_date)->setTimezone('Asia/Ho_Chi_Minh');
                 $invalidReason = "Voucher đã hết hạn (kết thúc vào: {$endDateLocal->format('Y-m-d H:i:s')})";
             }
 
             if (!$isValid) {
                 Log::info('Voucher invalid', [
                     'voucher' => $voucher->toArray(),
                     'reason' => $invalidReason,
                     'current_time' => $now->toDateTimeString(),
                 ]);
                 return response()->json([
                     'status' => false,
                     'message' => $invalidReason
                 ], 400);
             }
 
             if ($voucher->min_order_value && $request->cart_total < $voucher->min_order_value) {
                 return response()->json([
                     'status' => false,
                     'message' => "Giá trị đơn hàng chưa đạt mức tối thiểu để áp dụng voucher (tối thiểu: " . number_format($voucher->min_order_value, 0, ',', '.') . " VNĐ)"
                 ], 400);
             }
 
             $discount = 0;
             if ($voucher->discount_type === 'percentage') {
                 $discount = $request->cart_total * ($voucher->discount_value / 100);
                 Log::info('Discount before max_discount limit', [
                     'voucher_id' => $voucher->id,
                     'discount' => $discount,
                     'max_discount' => $voucher->max_discount,
                 ]);
                 if ($voucher->max_discount !== null) {
                     $discount = min($discount, (float) $voucher->max_discount);
                 }
                 Log::info('Discount after max_discount limit', [
                     'voucher_id' => $voucher->id,
                     'discount' => $discount,
                     'max_discount' => $voucher->max_discount,
                 ]);
             } else {
                 $discount = $voucher->discount_value;
             }
 
             $final_total = max(0, $request->cart_total - $discount);
 
             Log::info('Final discount and total', [
                 'voucher_id' => $voucher->id,
                 'discount' => $discount,
                 'final_total' => $final_total,
                 'cart_total' => $request->cart_total,
             ]);
 
             return response()->json([
                 'status' => true,
                 'message' => 'Áp dụng voucher thành công',
                 'discount' => $discount,
                 'final_total' => $final_total,
                 'voucher_code' => $voucher->code,
             ]);
         } catch (ValidationException $e) {
             return response()->json([
                 'status' => false,
                 'message' => 'Dữ liệu không hợp lệ',
                 'errors' => $e->errors(),
             ], 422);
         } catch (\Exception $e) {
             Log::error('Error applying voucher', [
                 'error' => $e->getMessage(),
                 'trace' => $e->getTraceAsString(),
                 'request_data' => $request->all(),
                 'user_id' => Auth::id(),
             ]);
             return response()->json([
                 'status' => false,
                 'message' => 'Có lỗi xảy ra khi áp dụng voucher',
                 'error' => $e->getMessage(),
             ], 500);
         }
     }
 
 
 
 
 
 
 public function checkCode(Request $request)
 {
     $code = $request->input('code');  
     $voucher = Voucher::where('code', $code)->first();
     return response()->json(['exists' => $voucher ? true : false]);
 }
}
