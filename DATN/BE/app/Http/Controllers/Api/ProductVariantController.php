<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\VariantValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductVariantController extends Controller
{
    /**
     * 📌 Lấy danh sách biến thể theo sản phẩm
     */
    public function index($product_id)
    {
        $variants = ProductVariant::where('product_id', $product_id)->get();
    
        // ✅ Chuyển `variant_value_ids` từ JSON thành mảng giá trị thực
        $variants->transform(function ($variant) {
            return [
                'id' => $variant->id,
                'product_id' => $variant->product_id,
                'variant_values' => VariantValue::whereIn('id', json_decode($variant->variant_value_ids, true))->pluck('value'),
                'price' => $variant->price,
                'stock' => $variant->stock,
                'image' => $variant->image ? asset('storage/' . $variant->image) : null,
            ];
        });
    
        return response()->json([
            'status'  => true,
            'message' => 'Danh sách biến thể của sản phẩm',
            'data'    => $variants
        ]);
    }
    
    

    

    /**
     * 📌 Thêm biến thể mới (Hỗ trợ upload ảnh)
     */
    // public function store(Request $request, $product_id)
    // {
    //     $validatedData = $request->validate([
    //         'variant_value_id' => 'required|exists:variant_values,id',
    //         'price'            => 'required|numeric|min:0',
    //         'stock'            => 'required|integer|min:0',
    //         'image'            => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096'
    //     ]);

    //     // ✅ Xử lý upload ảnh nếu có
    //     $imagePath = null;
    //     if ($request->hasFile('image')) {
    //         $imagePath = $request->file('image')->store('product_variants', 'public');
    //     }

    //     // ✅ Tạo biến thể sản phẩm
    //     $variant = ProductVariant::create([
    //         'product_id'       => $product_id,
    //         'variant_value_id' => $validatedData['variant_value_id'],
    //         'price'            => $validatedData['price'],
    //         'stock'            => $validatedData['stock'],
    //         'image'            => $imagePath,
    //     ]);

    //     return response()->json([
    //         'status'  => true,
    //         'message' => 'Thêm biến thể thành công',
    //         'data'    => $this->formatVariant($variant)
    //     ], 201);
    // }






        public function store(Request $request, $product_id)
        {
            $validatedData = $request->validate([
                'variant_value_ids' => 'required|array|min:2', // Cần ít nhất 2 giá trị biến thể
                'variant_value_ids.*' => 'exists:variant_values,id', // Kiểm tra ID có hợp lệ không
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096'
            ]);
    
            // ✅ Kiểm tra nếu có nhiều giá trị từ cùng một `variant_id`
            $variantGroups = DB::table('variant_values')
                ->whereIn('id', $validatedData['variant_value_ids'])
                ->pluck('variant_id', 'id'); // Lấy danh sách variant_id tương ứng với từng variant_value_id
        
            // Nhóm lại theo variant_id để kiểm tra trùng lặp
            $groupedVariants = collect($variantGroups)->countBy(); 
        
            // Nếu có bất kỳ variant_id nào có hơn 1 giá trị được chọn -> báo lỗi
            foreach ($groupedVariants as $variant_id => $count) {
                if ($count > 1) {
                    return response()->json([
                        'status' => false,
                        'message' => "Chỉ được chọn một giá trị cho mỗi biến thể (Lỗi: Variant ID $variant_id có nhiều giá trị)."
                    ], 400);
                }
            }
        
            // ✅ Kiểm tra nếu biến thể đã tồn tại (cùng tập hợp `variant_value_ids`)
            $existingVariants = ProductVariant::where('product_id', $product_id)->get();
            
            foreach ($existingVariants as $variant) {
                $existingValues = json_decode($variant->variant_value_ids, true);
                sort($existingValues);
                $newValues = $validatedData['variant_value_ids'];
                sort($newValues);
        
                if ($existingValues === $newValues) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Biến thể này đã tồn tại, vui lòng chọn biến thể khác!'
                    ], 400);
                }
            }
        
            // ✅ Xử lý upload ảnh nếu có
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('product_variants', 'public');
            }
        
            // ✅ Tạo biến thể sản phẩm
            $variant = ProductVariant::create([
                'product_id' => $product_id,
                'variant_value_ids' => json_encode($validatedData['variant_value_ids']), // Lưu danh sách biến thể
                'price' => $validatedData['price'],
                'stock' => $validatedData['stock'],
                'image' => $imagePath,
            ]);
        
            return response()->json([
                'status' => true,
                'message' => 'Thêm biến thể thành công',
                'data' => $this->formatVariant($variant)
            ], 201);
        }
    
    
    


    /**
     * 📌 Hiển thị chi tiết một biến thể
     */
    public function show($product_id, $variant_id)
    {
        // ✅ Tìm biến thể theo ID và kiểm tra product_id
        $variant = ProductVariant::where('id', $variant_id)
            ->where('product_id', $product_id)
            ->first();
    
        // ✅ Nếu không tìm thấy biến thể thuộc sản phẩm này, trả về lỗi 404
        if (!$variant) {
            return response()->json([
                'status'  => false,
                'message' => "Không tìm thấy biến thể ID: $variant_id thuộc sản phẩm ID: $product_id"
            ], 404);
        }
    
        // ✅ Giải mã JSON thành mảng (nếu có)
        $variant_value_ids = $variant->variant_value_ids ? json_decode($variant->variant_value_ids, true) : [];
    
        return response()->json([
            'status'  => true,
            'message' => 'Chi tiết biến thể',
            'data'    => [
                'id'    => $variant->id,
                'product_id' => $variant->product_id,
                'variant_value_ids' => $variant_value_ids,
                'price' => $variant->price,
                'stock' => $variant->stock,
                'image' => $variant->image ? asset('storage/' . $variant->image) : null
            ]
        ]);
    }
    
    
    
    
    

    /**
     * 📌 Cập nhật biến thể (Hỗ trợ cập nhật ảnh)
     */
    public function update(Request $request, $product_id, $variant_id) // Sửa lại để đảm bảo đúng ID biến thể
{
    // ✅ Kiểm tra xem biến thể có tồn tại không, và có đúng product_id không
    $variant = ProductVariant::where('id', $variant_id)
                             ->where('product_id', $product_id)
                             ->first();

    if (!$variant) {
        return response()->json([
            'status'  => false,
            'message' => "Không tìm thấy biến thể với ID: $variant_id của sản phẩm ID: $product_id"
        ], 404);
    }

    // ✅ Validate dữ liệu đầu vào
    $validatedData = $request->validate([
        'variant_value_ids'   => 'sometimes|array|min:2',
        'variant_value_ids.*' => 'exists:variant_values,id',
        'price'               => 'sometimes|numeric|min:0',
        'stock'               => 'sometimes|integer|min:0',
        'image'               => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096'
    ]);

    // ✅ Nếu có ảnh mới, xóa ảnh cũ và lưu ảnh mới
    if ($request->hasFile('image')) {
        if ($variant->image) {
            Storage::disk('public')->delete($variant->image);
        }
        $validatedData['image'] = $request->file('image')->store('product_variants', 'public');
    }

    // ✅ Cập nhật dữ liệu biến thể
    $variant->update($validatedData);

    return response()->json([
        'status'  => true,
        'message' => 'Cập nhật biến thể thành công',
        'data'    => [
            'id'    => $variant->id,
            'product_id' => $variant->product_id,
            'variant_value_ids' => $variant->variant_value_ids,
            'price' => $variant->price,
            'stock' => $variant->stock,
            'image' => $variant->image ? asset('storage/' . $variant->image) : null
        ]
    ]);
}

    /**
     * 📌 Xóa mềm biến thể (Không xóa ảnh)
     */
    public function softDelete($id)
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->delete();

        return response()->json([
            'status'  => true,
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
            'status'  => true,
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
            'status'  => true,
            'message' => 'Danh sách biến thể đã xóa mềm',
            'data'    => $trashedVariants
        ]);
    }

    /**
     * 📌 Xóa vĩnh viễn biến thể (Xóa luôn ảnh)
     */
    public function forceDelete($id)
    {
        $variant = ProductVariant::withTrashed()->findOrFail($id);

        // ✅ Xóa ảnh khỏi storage nếu có
        if ($variant->image) {
            Storage::disk('public')->delete($variant->image);
        }

        $variant->forceDelete();

        return response()->json([
            'status'  => true,
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


