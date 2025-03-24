<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * 📌 Lấy danh sách sản phẩm
     */
    public function index()
    {
        try {
            $products = Product::with(['category', 'variants'])  // Lấy danh mục và các biến thể
                ->orderBy('created_at', 'desc')   // Sản phẩm mới nhất lên trước
                ->get();
    
            return response()->json([
                'status' => true,
                'message' => 'Danh sách sản phẩm',
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * 📌 Thêm sản phẩm mới (Hỗ trợ upload ảnh)
     */
    // public function store(Request $request)
    // {
    //     try {
    //         // Xác thực dữ liệu đầu vào
    //         $validatedData = $request->validate([
    //             'name'        => 'required|string|max:255|unique:products,name',
    //             'category_id' => 'required|integer|exists:categories,id',
    //             'description' => 'nullable|string',
    //             'price'       => 'required|numeric|min:0', // Xác thực giá trị sản phẩm
    //             'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096' // Xác thực ảnh
    //         ]);
    
    //         // ✅ Set mặc định status
    //         $validatedData['status'] = 'Hoạt động';
    
    //         // Xử lý upload ảnh
    //         if ($request->hasFile('image')) {
    //             $imagePath = $request->file('image')->store('public/products');  // Lưu ảnh vào thư mục public/products
    //             $validatedData['image'] = Storage::url($imagePath);  // Lưu đường dẫn ảnh vào CSDL
    //         }
    
    //         // Tạo sản phẩm mới trong cơ sở dữ liệu
    //         $product = Product::create($validatedData);
    
    //         // ✅ Lấy tên danh mục
    //         $category = Category::find($validatedData['category_id']);
    
    //         // Trả về phản hồi
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'Thêm sản phẩm thành công',
    //             'data' => [
    //                 'id' => $product->id,
    //                 'name' => $product->name,
    //                 'description' => $product->description,
    //                 'price' => $product->price,  // Trả về giá sản phẩm
    //                 'status' => $product->status,
    //                 'category' => $category ? $category->name : null,  // Trả về tên danh mục
    //                 'image' => $product->image ? asset('storage/' . $product->image) : null, // Trả về URL ảnh
    //                 'created_at' => $product->created_at
    //             ]
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Lỗi khi thêm sản phẩm',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

//     public function store(Request $request)
// {
//     try {
//         // Validate dữ liệu đầu vào
//         $validatedData = $request->validate([
//             'name'        => 'required|string|max:255|unique:products,name',
//             'category_id' => 'required|integer|exists:categories,id',
//             'description' => 'nullable|string',
//             'price'       => 'required|numeric|min:0',
//             'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
//             'variants'    => 'required|array',
//             'variants.*.color_id' => 'required|exists:variant_color,id',
//             'variants.*.storage_id' => 'required|exists:variant_storage,id',
//             'variants.*.price' => 'required|numeric|min:0',
//             'variants.*.stock' => 'required|integer|min:0',
//         ]);

//         // Xử lý upload ảnh
//         if ($request->hasFile('image')) {
//                 $imagePath = $request->file('image')->store('public/products');  // Lưu ảnh vào thư mục public/products
//                 $validatedData['image'] = Storage::url($imagePath);  // Lưu đường dẫn ảnh vào CSDL
//             }

//         // Tạo sản phẩm
//         $product = Product::create([
//             'name' => $validatedData['name'],
//             'category_id' => $validatedData['category_id'],
//             'description' => $validatedData['description'],
//             'status' => 'Hoạt động',
//             'price' => $validatedData['price'],
//             'image' => $imagePath,
//         ]);

//         // Lấy tên danh mục
//         $category = Category::find($validatedData['category_id']);

//         // Tạo các biến thể
//         foreach ($validatedData['variants'] as $variant) {
//             ProductVariant::create([
//                 'product_id' => $product->id,
//                 'color_id' => $variant['color_id'],
//                 'storage_id' => $variant['storage_id'],
//                 'price' => $variant['price'],
//                 'stock' => $variant['stock'],
//             ]);
//         }

//         // Trả về response
//         return response()->json([
//             'status' => true,
//             'message' => 'Thêm sản phẩm thành công',
//             'data' => [
//                 'id' => $product->id,
//                 'name' => $product->name,
//                 'description' => $product->description,
//                 'price' => $product->price,
//                 'status' => $product->status,
//                 'category' => $category ? $category->name : null,
//                 'image' => $product->image ? asset('storage/' . $product->image) : null,
//                 'created_at' => $product->created_at,
//                 'variants' => $product->variants()->with(['color', 'storage'])->get(),
//             ]
//         ], 201);
//     } catch (\Exception $e) {
//         \Log::error('Lỗi thêm sản phẩm: ' . $e->getMessage());
//         return response()->json([
//             'status' => false,
//             'message' => 'Lỗi khi thêm sản phẩm',
//             'error' => $e->getMessage(),
//         ], 500);
//     }
// }

public function store(Request $request)
{
    try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
            'variants' => 'required|array|min:1',
            'variants.*.color_id' => 'required|exists:variant_color,id',
            'variants.*.storage_id' => 'required|exists:variant_storage,id',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.images' => 'nullable|array',
            'variants.*.images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
        ]);

        // Kiểm tra xem sản phẩm có tồn tại không
        $product = Product::where('name', $validatedData['name'])->first();

        if (!$product) {
            // Nếu sản phẩm chưa tồn tại, tạo sản phẩm mới
            // Upload ảnh sản phẩm chính
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('public/products');
                $validatedData['image'] = str_replace('public/', '', $imagePath);
            }

            // Tạo sản phẩm mới
            $product = Product::create([
                'name' => $validatedData['name'],
                'category_id' => $validatedData['category_id'],
                'price' => $validatedData['price'],
                'description' => $validatedData['description'] ?? '',
                'image' => $validatedData['image'] ?? null,
            ]);
        }

        // Thêm biến thể vào sản phẩm
        foreach ($validatedData['variants'] as $variantData) {
            // Kiểm tra biến thể đã tồn tại chưa (cùng màu và dung lượng)
            $exists = ProductVariant::where('product_id', $product->id)
                ->where('color_id', $variantData['color_id'])
                ->where('storage_id', $variantData['storage_id'])
                ->exists();

            if ($exists) {
                return response()->json([
                    'status' => false,
                    'message' => 'Biến thể này đã tồn tại cho sản phẩm này!'
                ], 400);
            }

            // Tạo mới biến thể cho sản phẩm
            $variant = ProductVariant::create([
                'product_id' => $product->id,
                'color_id' => $variantData['color_id'],
                'storage_id' => $variantData['storage_id'],
                'price' => $variantData['price'],
                'stock' => $variantData['stock'],
            ]);

            // Lưu ảnh biến thể nếu có
            if (!empty($variantData['images'])) {
                foreach ($variantData['images'] as $imageFile) {
                    $variantImagePath = $imageFile->store('public/variant_images');
                    $imageUrl = str_replace('public/', '', $variantImagePath);

                    // Lưu ảnh biến thể vào bảng `variant_images`
                    DB::table('variant_images')->insert([
                        'product_variant_id' => $variant->id,
                        'image_url' => $imageUrl,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Trả về dữ liệu cho sản phẩm và biến thể, bao gồm URL ảnh
        return response()->json([
            'status' => true,
            'message' => 'Thêm sản phẩm và biến thể thành công!',
            'data' => $product->load('variants.images'), // Tải dữ liệu liên quan đến biến thể và ảnh
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Lỗi khi thêm sản phẩm hoặc biến thể',
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile()
        ], 500);
    }
}








    

    /**
     * 📌 Hiển thị chi tiết một sản phẩm
     */
    public function show($id)
{
    try {
        $product = Product::with([
            'category',               // Load danh mục của sản phẩm
            'variants.color',         // Load màu sắc của các biến thể
            'variants.storage',       // Load dung lượng của các biến thể
            'variants.images'         // Load ảnh của các biến thể (nếu có)
        ])->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        // Chuyển đổi các liên kết ảnh biến thể nếu có
        $product->variants->map(function ($variant) {
            // Cập nhật giá trị 'images' cho từng biến thể sản phẩm
            $variant->images->map(function ($image) {
                $image->image_url = asset('storage/' . $image->image_url); // Đảm bảo ảnh có URL đầy đủ
            });
            return $variant;
        });

        // Cập nhật thông tin ảnh cho sản phẩm
        if ($product->image) {
            $product->image = asset('storage/' . $product->image); // Đảm bảo sản phẩm có ảnh đầy đủ URL
        }

        return response()->json([
            'status' => true,
            'message' => 'Thông tin sản phẩm',
            'data' => $product
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Lỗi khi lấy sản phẩm',
            'error' => $e->getMessage()
        ], 500);
    }
}

    

    /**
     * 📌 Cập nhật thông tin sản phẩm (Hỗ trợ upload ảnh)
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
    
        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => "Không tìm thấy sản phẩm với ID: $id"
            ], 404);
        }
    
        // Validate the main product data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|in:Hoạt động,Ngưng hoạt động',
        ]);
    
        // Update the main product
        $product->update($validatedData);
    
        // Handle product variants (if any)
        if ($request->has('variants')) {
            foreach ($request->variants as $variantData) {
                // Check if the variant exists, then update or create a new variant
                $variant = ProductVariant::find($variantData['id']);
    
                if ($variant) {
                    // Update existing variant
                    $variant->update([
                        'color_id' => $variantData['color_id'],
                        'storage_id' => $variantData['storage_id'],
                        'price' => $variantData['price'],
                        'stock' => $variantData['stock'],
                    ]);
                } else {
                    // Create new variant if not found
                    $product->variants()->create([
                        'color_id' => $variantData['color_id'],
                        'storage_id' => $variantData['storage_id'],
                        'price' => $variantData['price'],
                        'stock' => $variantData['stock'],
                    ]);
                }
            }
        }
    
        return response()->json([
            'status' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'data' => $product
        ]);
    }
    



    

    /**
     * 📌 Xóa mềm sản phẩm
     */
    public function softDelete($id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy sản phẩm'
                ], 404);
            }

            $product->delete();

            return response()->json([
                'status' => true,
                'message' => 'Sản phẩm đã được xóa mềm'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xóa mềm sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 📌 Khôi phục sản phẩm đã xóa mềm
     */
    public function restore($id)
    {
        try {
            $product = Product::withTrashed()->find($id);

            if (!$product) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy sản phẩm để khôi phục'
                ], 404);
            }

            $product->restore();

            return response()->json([
                'status' => true,
                'message' => 'Sản phẩm đã được khôi phục'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi khôi phục sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 📌 Lấy danh sách sản phẩm đã xóa mềm
     */
    public function trashed()
    {
        try {
            $trashedProducts = Product::onlyTrashed()->get();

            return response()->json([
                'status' => true,
                'message' => 'Danh sách sản phẩm đã bị xóa mềm',
                'data' => $trashedProducts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lấy danh sách sản phẩm đã xóa mềm',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * 📌 Xóa vĩnh viễn sản phẩm (Xóa luôn ảnh nếu có)
     */
    public function forceDelete($id)
    {
        try {
            $product = Product::withTrashed()->find($id);

            if (!$product) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy sản phẩm'
                ], 404);
            }

            // Xóa ảnh nếu có
            if ($product->image) {
                Storage::delete('public/products/' . basename($product->image));
            }

            $product->forceDelete();

            return response()->json([
                'status' => true,
                'message' => 'Sản phẩm đã bị xóa vĩnh viễn'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xóa vĩnh viễn sản phẩm',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

