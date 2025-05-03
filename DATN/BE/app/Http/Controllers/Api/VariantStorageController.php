<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VariantStorage;
use Illuminate\Http\Request;

class VariantStorageController extends Controller
{
    public function index()
    {
        try {
            $storages = VariantStorage::all();

            return response()->json([
                'status' => true,
                'message' => 'Danh sách dung lượng',
                'data' => $storages
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi hệ thống khi lấy danh sách dung lượng',
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
                'value' => 'required|string|unique:variant_storage,value,NULL,id,deleted_at,NULL'
            ]);

            $storage = VariantStorage::create($validated);

            return response()->json([
                'status' => true,
                'message' => 'Thêm dung lượng thành công',
                'data' => $storage
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi thêm dung lượng',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $storage = VariantStorage::find($id);

            if (!$storage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy dung lượng với ID: ' . $id
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Chi tiết dung lượng',
                'data' => $storage
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lấy chi tiết dung lượng',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $storage = VariantStorage::find($id);

            if (!$storage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy dung lượng với ID: ' . $id
                ], 404);
            }

            $validated = $request->validate([
                'value' => 'required|string|unique:variant_storage,value,' . $id . ',id,deleted_at,NULL'
            ]);

            $storage->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật dung lượng thành công',
                'data' => $storage
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi cập nhật dung lượng',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $storage = VariantStorage::find($id);

            if (!$storage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy dung lượng để xóa với ID: ' . $id
                ], 404);
            }

            $storage->delete();

            return response()->json([
                'status' => true,
                'message' => 'Đã xóa mềm dung lượng thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xóa mềm dung lượng',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function restore($id)
    {
        try {
            $storage = VariantStorage::withTrashed()->find($id);

            if (!$storage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy dung lượng để khôi phục với ID: ' . $id
                ], 404);
            }

            $storage->restore();

            return response()->json([
                'status' => true,
                'message' => 'Đã khôi phục dung lượng thành công'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi khôi phục dung lượng',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function trashed()
    {
        try {
            $trashed = VariantStorage::onlyTrashed()->get();

            return response()->json([
                'status' => true,
                'message' => 'Danh sách dung lượng đã xóa mềm',
                'data' => $trashed
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi lấy danh sách dung lượng đã xóa mềm',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }

    public function forceDelete($id)
    {
        try {
            $storage = VariantStorage::withTrashed()->find($id);

            if (!$storage) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không tìm thấy dung lượng để xóa vĩnh viễn với ID: ' . $id
                ], 404);
            }

            $storage->forceDelete();

            return response()->json([
                'status' => true,
                'message' => 'Đã xóa vĩnh viễn dung lượng'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi xóa vĩnh viễn dung lượng',
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}
