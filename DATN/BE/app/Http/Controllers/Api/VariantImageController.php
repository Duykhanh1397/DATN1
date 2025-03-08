<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VariantImage;
use Illuminate\Http\Request;

class VariantImageController extends Controller
{
    public function index($product_id)
    {
        return response()->json(VariantImage::where('product_id', $product_id)->get());
    }

    public function store(Request $request, $product_id)
    {
        $request->validate(['image_url' => 'required|string']);

        $image = VariantImage::create([
            'product_id' => $product_id,
            'image_url' => $request->image_url
        ]);

        return response()->json($image, 201);
    }
    
    public function show($id)
    {
        return response()->json(VariantImage::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $image = VariantImage::findOrFail($id);
        $image->update($request->all());
        return response()->json($image);
    }

    public function softDelete($id)
    {
        $image = VariantImage::findOrFail($id);
        $image->delete();
        return response()->json(['message' => 'Image soft deleted']);
    }

    public function restore($id)
    {
        $image = VariantImage::withTrashed()->findOrFail($id);
        $image->restore();
        return response()->json(['message' => 'Image restored']);
    }

    public function trashed()
    {
        return response()->json(VariantImage::onlyTrashed()->get());
    }
}
    