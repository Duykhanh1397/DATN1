<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VariantValue;
use Illuminate\Http\Request;

class VariantValueController extends Controller
{
    public function index($variant_id)
    {
        return response()->json(VariantValue::where('variant_id', $variant_id)->get());
    }

    public function store(Request $request, $variant_id)
    {
        $request->validate(['price' => 'required|numeric', 'stock' => 'required|integer']);
        $value = VariantValue::create([
            'variant_id' => $variant_id,
            'price' => $request->price,
            'stock' => $request->stock,
            'color_name' => $request->color_name,
            'storage_size' => $request->storage_size
        ]);
        return response()->json($value, 201);
    }

    public function show($id)
    {
        return response()->json(VariantValue::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $value = VariantValue::findOrFail($id);
        $value->update($request->all());
        return response()->json($value);
    }

    public function softDelete($id)
    {
        $value = VariantValue::findOrFail($id);
        $value->delete();
        return response()->json(['message' => 'Variant value soft deleted']);
    }

    public function restore($id)
    {
        $value = VariantValue::withTrashed()->findOrFail($id);
        $value->restore();
        return response()->json(['message' => 'Variant value restored']);
    }
    
    public function trashed()
    {
        return response()->json(VariantValue::onlyTrashed()->get());
    }
}

