<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('category', 'variants.values', 'images')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255', 'category_id' => 'required|integer']);
        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    public function show($id)
    {
        return response()->json(Product::with('category', 'variants.values', 'images')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json($product);
    }

    public function softDelete($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product soft deleted']);
    }

    public function restore($id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $product->restore();
        return response()->json(['message' => 'Product restored']);
    }

    public function trashed()
    {
        return response()->json(Product::onlyTrashed()->get());
    }
}

