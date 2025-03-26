<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\VariantColor;
use App\Models\VariantStorage;
use App\Models\VariantImage;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    /**
     * 📌 Lấy danh sách biến thể theo sản phẩm
     */
    public function index($product_id)
    {
        $variants = ProductVariant::with(['color', 'storage'])
            ->where('product_id', $product_id)
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Danh sách biến thể của sản phẩm',
            'data' => $variants
        ]);
    }


public function getAllProductVariants()
{
    $variants = ProductVariant::with(['color', 'storage', 'product.category', 'images'])->get();

    // Lặp qua từng variant và image để thêm link đầy đủ
    $variants->map(function ($variant) {
        $variant->images->map(function ($img) {
            // Kiểm tra nếu image_url đã có domain
            if (!str_contains($img->image_url, 'http://127.0.0.1:8000/storage/')) {
                // Chỉ thêm domain nếu chưa có
                $img->image_url = asset('storage/' . $img->image_url);
            }
            return $img;
        });
        return $variant;
    });

    return response()->json([
        'status' => true,
        'message' => 'Danh sách tất cả biến thể sản phẩm',
        'data' => $variants
    ]);
}


    /**
     * 📌 Thêm biến thể mới ()
     */
    public function store(Request $request, $product_id)
    {
        try {
            $validatedData = $request->validate([
                'color_id' => 'required|exists:variant_color,id',
                'storage_id' => 'required|exists:variant_storage,id',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
            ]);

            // ✅ Kiểm tra biến thể tồn tại (color_id + storage_id)
            $exists = ProductVariant::where('product_id', $product_id)
                ->where('color_id', $validatedData['color_id'])
                ->where('storage_id', $validatedData['storage_id'])
                ->exists();

            if ($exists) {
                return response()->json([
                    'status' => false,
                    'message' => 'Biến thể này đã tồn tại!'
                ], 400);
            }

            // ✅ Lưu biến thể
            $variant = ProductVariant::create([
                'product_id' => $product_id,
                'color_id' => $validatedData['color_id'],
                'storage_id' => $validatedData['storage_id'],
                'price' => $validatedData['price'],
                'stock' => $validatedData['stock'],
            ]);

            // ✅ Load quan hệ color và storage để trả về value
            $variant->load(['color', 'storage', 'product']);

            return response()->json([
                'status' => true,
                'message' => 'Thêm biến thể thành công',
                'data' => [
                    'id' => $variant->id,
                    'product' => $variant->product->name ?? null,
                    'color' => $variant->color->value ?? null,
                    'storage' => $variant->storage->value ?? null,
                    'price' => $variant->price,
                    'stock' => $variant->stock
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi thêm biến thể',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    /**
     * 📌 Hiển thị chi tiết một biến thể
     */
    public function show($variant_id)
    {
        $variant = ProductVariant::with(['images', 'color', 'storage', 'product'])->find($variant_id);

        if (!$variant) {
            return response()->json([
                'status' => false,
                'message' => "Không tìm thấy biến thể với ID: $variant_id"
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Chi tiết biến thể',
            'data' => $this->formatVariant($variant)
        ]);
    }

    /**
     * 📌 Cập nhật biến thể (Không còn hỗ trợ upload ảnh)
     */
   public function update(Request $request, $variant_id)
{
    $variant = ProductVariant::find($variant_id);

    if (!$variant) {
        return response()->json([
            'status' => false,
            'message' => "Không tìm thấy biến thể với ID: $variant_id"
        ], 404);
    }

    $validatedData = $request->validate([
        'color_id' => 'required|exists:variant_color,id',
        'storage_id' => 'required|exists:variant_storage,id',
        'price' => 'required|numeric|min:0',
        'stock' => 'required|integer|min:0',
    ]);

    $variant->update($validatedData);

    return response()->json([
        'status' => true,
        'message' => 'Cập nhật biến thể thành công',
        'data' => $variant
    ]);
}



    /**
     * 📌 Xóa mềm biến thể
     */
    public function softDelete($id)
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->delete();

        return response()->json([
            'status' => true,
            'message' => 'Biến thể đã được xóa mềm'
        ]);
    }

    /**
     * 📌 Khôi phục biến thể đã xóa mềm
     */
    public function restore($id)
    {
        $variant = ProductVariant::withTrashed()->findOrFail($id);
        $variant->restore();

        return response()->json([
            'status' => true,
            'message' => 'Biến thể đã được khôi phục'
        ]);
    }

    /**
     * 📌 Lấy danh sách biến thể đã xóa mềm
     */
    public function trashed()
    {
        $trashedVariants = ProductVariant::onlyTrashed()->get();

        return response()->json([
            'status' => true,
            'message' => 'Danh sách biến thể đã xóa mềm',
            'data' => $trashedVariants
        ]);
    }

    /**
     * 📌 Xóa vĩnh viễn biến thể (Xóa luôn ảnh nếu có)
     */
    public function forceDelete($id)
    {
        $variant = ProductVariant::withTrashed()->findOrFail($id);

        $variant->forceDelete();

        return response()->json([
            'status' => true,
            'message' => 'Biến thể đã bị xóa vĩnh viễn'
        ]);
    }

    /**
     * 📌 Format biến thể để trả về response đúng đường dẫn ảnh
     */
    private function formatVariant($variant)
    {
        $variant->image = $variant->image ? asset('storage/' . $variant->image) : null;
        return $variant;
    }
}
    