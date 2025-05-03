<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VariantImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VariantImageController extends Controller
{
    /**
     * 📌 Lấy danh sách ảnh theo biến thể sản phẩm
     */
    // public function index($product_variant_id)
    // {
    //     try {
    //         // Lấy ảnh theo biến thể sản phẩm và sắp xếp mới nhất
    //         $images = VariantImage::with('productVariant')
    //             ->where('product_variant_id', $product_variant_id)
    //             ->orderBy('created_at', 'desc')
    //             ->get();
    
    //         if ($images->isEmpty()) {
    //             return response()->json(['status' => false, 'message' => 'Không có ảnh nào'], 404);
    //         }
    
    //         // Format kết quả trả ra
    //         $data = $images->map(function ($image) {
    //             return [
    //                 'id' => $image->id,
    //                 'product_variant_id' => $image->product_variant_id,
    //                  'image_url' => url($image->image_url),
    //                 'created_at' => $image->created_at,
    //             ];
    //         });
    
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'Danh sách ảnh',
    //             'data' => $data
    //         ]);
    //     } catch (\Exception $e) {
    //         return $this->serverError($e, 'Lỗi khi lấy danh sách ảnh');
    //     }
    // }

public function index($product_variant_id)
    {
        try {
            // Lấy ảnh theo biến thể sản phẩm và sắp xếp mới nhất
            $images = VariantImage::with('productVariant')
                ->where('product_variant_id', $product_variant_id)
                ->orderBy('created_at', 'desc')
                ->get();

            if ($images->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có ảnh nào'
                ], 404);
            }

            // Không cần asset() nữa, đã có accessor lo!
            $data = $images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'product_variant_id' => $image->product_variant_id,
                    'image_url' => $image->image_url, // accessor tự chạy
                    'created_at' => $image->created_at->toDateTimeString(),
                ];
            });

            return response()->json([
                'status' => true,
                'message' => 'Danh sách ảnh',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lấy danh sách ảnh',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 📌 Upload ảnh cho biến thể sản phẩm
     */
    public function store(Request $request, $product_variant_id)
    {
        // Kiểm tra có file ảnh không
        if (!$request->hasFile('image')) {
            return response()->json([
                'status' => false,
                'message' => 'Không nhận được file ảnh!'
            ], 400);
        }
    
        // Upload file vào storage
        $imagePath = $request->file('image')->store('variant_images', 'public');
    
        // Lưu đường dẫn vào DB
        $image = VariantImage::create([
            'product_variant_id' => $product_variant_id,
            'image_url' => $imagePath, // Lưu đường dẫn file
        ]);
    
        return response()->json([
            'status' => true,
            'message' => 'Ảnh đã được tải lên!',
            'data' => [
                'id' => $image->id,
                'product_variant_id' => $image->product_variant_id,
                'image_url' => asset('storage/' . $image->image_url), // Trả về link ảnh đầy đủ
            ]
        ], 201);
    }

    /**
     * 📌 Lấy thông tin chi tiết một ảnh
     */
    public function show($product_variant_id, $image_id)
    {
        try {
            $image = VariantImage::with('productVariant')  // Load quan hệ product_variant luôn
                ->where('product_variant_id', $product_variant_id)
                ->where('id', $image_id)
                ->first();
    
            if (!$image) {
                return response()->json([
                    'status' => false,
                    'message' => "Không tìm thấy ảnh ID: $image_id cho product_variant ID: $product_variant_id"
                ], 404);
            }
    
            return response()->json([
                'status' => true,
                'message' => 'Thông tin ảnh',
                'data' => [
                    'id' => $image->id,
                    'product_variant_id' => $image->product_variant_id,
                    'image_url' => asset('storage/' . $image->image_url)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lấy thông tin ảnh',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    /**
     * 📌 Cập nhật ảnh mới
     */
    public function update(Request $request, $product_variant_id, $id)
    {
        // Kiểm tra xem ảnh có thuộc về biến thể sản phẩm không
        $image = VariantImage::where('id', $id)->where('product_variant_id', $product_variant_id)->first();

        if (!$image) {
            return response()->json([
                'status' => false,
                'message' => "Không tìm thấy ảnh với ID: $id cho product_variant ID: $product_variant_id"
            ], 404);
        }

        // Kiểm tra request có file ảnh không
        if (!$request->hasFile('image')) {
            return response()->json([
                'status' => false,
                'message' => 'Không nhận được file ảnh từ request!'
            ], 400);
        }

        // Validate file upload
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:4096'
        ]);

        // Xóa ảnh cũ nếu tồn tại trong storage
        if ($image->image_url) {
            Storage::disk('public')->delete($image->image_url);
        }

        // Lưu file mới vào storage
        $newImagePath = $request->file('image')->store('variant_images', 'public');

        if (!$newImagePath) {
            return response()->json([
                'status' => false,
                'message' => 'Lưu file thất bại!'
            ], 500);
        }

        // Cập nhật đường dẫn ảnh mới vào database
        $image->image_url = $newImagePath;
        $image->save();

        return response()->json([
            'status' => true,
            'message' => 'Cập nhật ảnh thành công!',
            'data' => [
                'id' => $image->id,
                'product_variant_id' => $image->product_variant_id,
                'image_url' => asset('storage/' . $image->image_url),
            ]
        ]);
    }

    /**
     * 📌 Xóa mềm ảnh
     */
    public function softDelete($id)
    {
        $image = VariantImage::find($id);

        if (!$image) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy ảnh'
            ], 404);
        }

        $image->delete();

        return response()->json([
            'status' => true,
            'message' => 'Ảnh đã được xóa mềm'
        ]);
    }

    /**
     * 📌 Khôi phục ảnh đã xóa mềm
     */
    public function restore($id)
    {
        $image = VariantImage::withTrashed()->find($id);

        if (!$image) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy ảnh để khôi phục'
            ], 404);
        }

        $image->restore();

        return response()->json([
            'status' => true,
            'message' => 'Ảnh đã được khôi phục'
        ]);
    }

    /**
     * 📌 Lấy danh sách ảnh đã bị xóa mềm
     */
    public function trashed()
    {
        $trashedImages = VariantImage::onlyTrashed()->get();

        return response()->json([
            'status' => true,
            'message' => 'Danh sách ảnh đã bị xóa mềm',
            'data' => $trashedImages
        ]);
    }

    /**
     * 📌 Xóa vĩnh viễn ảnh
     */
    public function forceDelete($id)
    {
        $image = VariantImage::withTrashed()->find($id);

        if (!$image) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy ảnh để xóa vĩnh viễn'
            ], 404);
        }

        // Xóa ảnh vật lý trong storage
        Storage::disk('public')->delete($image->image_url);

        // Xóa bản ghi trong database
        $image->forceDelete();

        return response()->json([
            'status' => true,
            'message' => 'Ảnh đã được xóa vĩnh viễn'
        ]);
    }
}
