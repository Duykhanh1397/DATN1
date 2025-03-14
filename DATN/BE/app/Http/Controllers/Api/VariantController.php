<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Variant;
use Illuminate\Http\Request;

class VariantController extends Controller
{
    /**
     * 📌 Lấy danh sách tất cả các loại biến thể
     */
    public function index()
    {
        $variants = Variant::with('variantValues')->get();
        return response()->json([
            'status'  => true,
            'message' => 'Danh sách các loại biến thể',
            'data'    => $variants
        ]);
    }

    /**
     * 📌 Lấy danh sách giá trị của một loại biến thể
     */
    public function getVariantValues($variant_id)
    {
        $variant = Variant::with('variantValues')->find($variant_id);

        if (!$variant) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy loại biến thể'
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => "Danh sách giá trị biến thể của {$variant->name}",
            'data'    => $variant->variantValues
        ]);
    }

    /**
     * 📌 Thêm loại biến thể mới
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:variants,name',
        ]);

        $variant = Variant::create($validatedData);

        return response()->json([
            'status'  => true,
            'message' => 'Thêm loại biến thể thành công',
            'data'    => $variant
        ], 201);
    }

    /**
     * 📌 Hiển thị chi tiết một loại biến thể
     */
    public function show($id)
    {
        $variant = Variant::with('variantValues')->find($id);

        if (!$variant) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy loại biến thể'
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Chi tiết loại biến thể',
            'data'    => $variant
        ]);
    }

    /**
     * 📌 Cập nhật loại biến thể
     */
    public function update(Request $request, $id)
    {
        $variant = Variant::find($id);

        if (!$variant) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy loại biến thể'
            ], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255|unique:variants,name,' . $id,
        ]);

        $variant->update($validatedData);

        return response()->json([
            'status'  => true,
            'message' => 'Cập nhật loại biến thể thành công',
            'data'    => $variant
        ]);
    }

    /**
     * 📌 Xóa mềm loại biến thể
     */
    public function softDelete($id)
    {
        $variant = Variant::find($id);

        if (!$variant) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy loại biến thể'
            ], 404);
        }

        $variant->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Loại biến thể đã được xóa mềm'
        ]);
    }

    /**
     * 📌 Khôi phục loại biến thể đã bị xóa mềm
     */
    public function restore($id)
    {
        $variant = Variant::withTrashed()->find($id);

        if (!$variant) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy loại biến thể để khôi phục'
            ], 404);
        }

        $variant->restore();

        return response()->json([
            'status'  => true,
            'message' => 'Loại biến thể đã được khôi phục'
        ]);
    }

    /**
     * 📌 Lấy danh sách các loại biến thể đã bị xóa mềm
     */
    public function trashed()
    {
        $trashedVariants = Variant::onlyTrashed()->get();

        return response()->json([
            'status'  => true,
            'message' => 'Danh sách các loại biến thể đã bị xóa mềm',
            'data'    => $trashedVariants
        ]);
    }

    /**
     * 📌 Xóa vĩnh viễn loại biến thể
     */
    public function forceDelete($id)
    {
        $variant = Variant::withTrashed()->find($id);

        if (!$variant) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy loại biến thể'
            ], 404);
        }

        $variant->forceDelete();

        return response()->json([
            'status'  => true,
            'message' => 'Loại biến thể đã bị xóa vĩnh viễn'
        ]);
    }
}
