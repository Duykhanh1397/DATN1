<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|boolean'
        ]);

        $category = Category::create($request->all());
        return response()->json($category, 201);
    }

    public function index()
    {
        return response()->json(Category::all());
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|boolean'
        ]);

        $category = Category::findOrFail($id);
        $category->update($request->all());
        return response()->json($category);
    }

    public function softDelete($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category has been soft deleted.']);
    }

    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();
        return response()->json(['message' => 'Category has been restored.']);
    }

    public function trashed()
    {
        return response()->json(Category::onlyTrashed()->get());
    }
}