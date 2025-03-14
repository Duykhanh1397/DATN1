<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VariantValue;
use Illuminate\Http\Request;

class VariantValueController extends Controller
{
    /**
     * 📌 Lấy danh sách các giá trị của một biến thể
     */
    public function index($variant_id)
    {
        $values = VariantValue::with('variant')->where('variant_id', $variant_id)->get();

        return response()->json([
            'status'  => true,
            'message' => 'Danh sách giá trị của biến thể',
            'data'    => $values
        ]);
    }

    /**
     * 📌 Tạo giá trị mới cho một biến thể
     */
    public function store(Request $request, $variant_id)
    {
        $validatedData = $request->validate([
            'value' => 'required|string|max:255',
        ]);

        $value = VariantValue::create([
            'variant_id' => $variant_id,
            'value'      => $validatedData['value']
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Thêm giá trị biến thể thành công',
            'data'    => $value
        ], 201);
    }

    /**
     * 📌 Hiển thị chi tiết một giá trị biến thể
     */
    public function show($id)
    {
        $value = VariantValue::with('variant')->find($id);

        if (!$value) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy giá trị biến thể'
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Chi tiết giá trị biến thể',
            'data'    => $value
        ]);
    }

    /**
     * 📌 Cập nhật giá trị biến thể
     */
    public function update(Request $request, $id)
    {
        $value = VariantValue::find($id);

        if (!$value) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy giá trị biến thể'
            ], 404);
        }

        $validatedData = $request->validate([
            'value' => 'sometimes|string|max:255'
        ]);

        $value->update($validatedData);

        return response()->json([
            'status'  => true,
            'message' => 'Cập nhật giá trị biến thể thành công',
            'data'    => $value
        ]);
    }

    /**
     * 📌 Xóa mềm giá trị biến thể
     */
    public function softDelete($id)
    {
        $value = VariantValue::find($id);

        if (!$value) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy giá trị biến thể'
            ], 404);
        }

        $value->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Giá trị biến thể đã được xóa mềm'
        ]);
    }

    /**
     * 📌 Khôi phục giá trị biến thể đã xóa mềm
     */
    public function restore($id)
    {
        $value = VariantValue::withTrashed()->find($id);

        if (!$value) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy giá trị biến thể để khôi phục'
            ], 404);
        }

        $value->restore();

        return response()->json([
            'status'  => true,
            'message' => 'Giá trị biến thể đã được khôi phục'
        ]);
    }

    /**
     * 📌 Lấy danh sách các giá trị biến thể đã bị xóa mềm
     */
    public function trashed()
    {
        $trashedValues = VariantValue::onlyTrashed()->get();

        return response()->json([
            'status'  => true,
            'message' => 'Danh sách giá trị biến thể đã xóa mềm',
            'data'    => $trashedValues
        ]);
    }

    /**
     * 📌 Xóa vĩnh viễn giá trị biến thể (⚠️ Kiểm tra liên kết trước khi xóa)
     */
    public function forceDelete($id)
    {
        $value = VariantValue::withTrashed()->find($id);

        if (!$value) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy giá trị biến thể'
            ], 404);
        }

        // ⚠️ Kiểm tra nếu còn sản phẩm đang sử dụng giá trị này
        if ($value->productVariants()->exists()) {
            return response()->json([
                'status'  => false,
                'message' => 'Không thể xóa giá trị biến thể vì đang được sử dụng'
            ], 400);
        }

        $value->forceDelete();

        return response()->json([
            'status'  => true,
            'message' => 'Giá trị biến thể đã bị xóa vĩnh viễn'
        ]);
    }
}
