<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductVariantController extends Controller
{
    public function index($product_id)
    {
        return response()->json(ProductVariant::where('product_id', $product_id)->get());
    }

    public function store(Request $request, $product_id)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $variant = ProductVariant::create([
            'product_id' => $product_id,
            'name' => $request->name
        ]);
        return response()->json($variant, 201);
    }
    
    public function show($id)
    {
        return response()->json(ProductVariant::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->update($request->all());
        return response()->json($variant);
    }

    public function softDelete($id)
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->delete();
        return response()->json(['message' => 'Variant soft deleted']);
    }

    public function restore($id)
    {
        $variant = ProductVariant::withTrashed()->findOrFail($id);
        $variant->restore();
        return response()->json(['message' => 'Variant restored']);
    }

    public function trashed()
    {
        return response()->json(ProductVariant::onlyTrashed()->get());
    }
}


