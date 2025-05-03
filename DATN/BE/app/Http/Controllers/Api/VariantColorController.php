<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VariantColor;
use Illuminate\Http\Request;

class VariantColorController extends Controller
{
    public function index()
    {
        try {
            $colors = VariantColor::all();

            return response()->json([
                'status' => true,
                'message' => 'Danh sách màu sắc',
                'data' => $colors
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống khi lấy danh sách màu',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'value' => 'required|string|unique:variant_color,value,NULL,id,deleted_at,NULL'
            ]);

            $color = VariantColor::create($validated);

            return response()->json([
                'status' => true,
                'message' => 'Thêm màu thành công',
                'data' => $color
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi thêm màu',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $color = VariantColor::find($id);

            if (!$color) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy màu với ID: ' . $id
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Chi tiết màu',
                'data' => $color
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lấy chi tiết màu',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $color = VariantColor::find($id);

            if (!$color) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy màu với ID: ' . $id
                ], 404);
            }

            $validated = $request->validate([
                'value' => 'required|string|unique:variant_color,value,' . $id . ',id,deleted_at,NULL'
            ]);

            $color->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật màu thành công',
                'data' => $color
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi cập nhật màu',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $color = VariantColor::find($id);

            if (!$color) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy màu để xóa với ID: ' . $id
                ], 404);
            }

            $color->delete();

            return response()->json([
                'status' => true,
                'message' => 'Đã xóa mềm màu thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xóa mềm màu',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function restore($id)
    {
        try {
            $color = VariantColor::withTrashed()->find($id);

            if (!$color) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy màu để khôi phục với ID: ' . $id
                ], 404);
            }

            $color->restore();

            return response()->json([
                'status' => true,
                'message' => 'Đã khôi phục màu thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi khôi phục màu',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function trashed()
    {
        try {
            $trashed = VariantColor::onlyTrashed()->get();

            return response()->json([
                'status' => true,
                'message' => 'Danh sách màu đã xóa mềm',
                'data' => $trashed
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lấy danh sách màu đã xóa mềm',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function forceDelete($id)
    {
        try {
            $color = VariantColor::withTrashed()->find($id);

            if (!$color) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy màu để xóa vĩnh viễn với ID: ' . $id
                ], 404);
            }

            $color->forceDelete();

            return response()->json([
                'status' => true,
                'message' => 'Đã xóa vĩnh viễn màu'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xóa vĩnh viễn màu',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}

