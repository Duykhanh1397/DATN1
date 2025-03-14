<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * 📌 Lấy danh sách tất cả sản phẩm
     */
    public function index()
    {
        $products = Product::with([
            'category',
            'variants.variantValue.variant',
            'images'
        ])->get();

        return response()->json([
            'status'  => true,
            'message' => 'Danh sách sản phẩm',
            'data'    => $products
        ]);
    }

    /**
     * 📌 Thêm sản phẩm mới
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'        => 'required|string|max:255|unique:products,name',
            'category_id' => 'required|integer|exists:categories,id',
            'description' => 'nullable|string',
            'status'      => 'required|in:Hoạt động,Ngừng hoạt động'
        ]);

        $product = Product::create($validatedData);

        return response()->json([
            'status'  => true,
            'message' => 'Thêm sản phẩm thành công',
            'data'    => $product
        ], 201);
    }

    /**
     * 📌 Lấy thông tin chi tiết một sản phẩm
     */
    public function show($id)
    {
        $product = Product::with([
            'category',
            'variants.variantValue.variant',
            'images'
        ])->find($id);

        if (!$product) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Thông tin sản phẩm',
            'data'    => $product
        ]);
    }

    /**
     * 📌 Cập nhật sản phẩm
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $validatedData = $request->validate([
            'name'        => 'sometimes|string|max:255|unique:products,name,' . $id,
            'category_id' => 'sometimes|integer|exists:categories,id',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:Hoạt động,Ngừng hoạt động'
        ]);

        $product->update($validatedData);

        return response()->json([
            'status'  => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'data'    => $product
        ]);
    }

    /**
     * 📌 Xóa mềm sản phẩm
     */
    public function softDelete($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Sản phẩm đã được xóa mềm'
        ]);
    }

    /**
     * 📌 Khôi phục sản phẩm đã bị xóa mềm
     */
    public function restore($id)
    {
        $product = Product::withTrashed()->find($id);

        if (!$product) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy sản phẩm để khôi phục'
            ], 404);
        }

        $product->restore();

        return response()->json([
            'status'  => true,
            'message' => 'Sản phẩm đã được khôi phục'
        ]);
    }

    /**
     * 📌 Lấy danh sách sản phẩm đã bị xóa mềm
     */
    public function trashed()
    {
        $trashedProducts = Product::onlyTrashed()->get();

        return response()->json([
            'status'  => true,
            'message' => 'Danh sách sản phẩm đã bị xóa mềm',
            'data'    => $trashedProducts
        ]);
    }

    /**
     * 📌 Xóa vĩnh viễn sản phẩm
     */
    public function forceDelete($id)
    {
        $product = Product::withTrashed()->find($id);

        if (!$product) {
            return response()->json([
                'status'  => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 404);
        }

        $product->forceDelete();

        return response()->json([
            'status'  => true,
            'message' => 'Sản phẩm đã bị xóa vĩnh viễn'
        ]);
    }
}
