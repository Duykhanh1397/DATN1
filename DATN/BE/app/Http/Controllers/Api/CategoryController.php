<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::orderBy('created_at', 'desc')->get();

            if ($categories->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có danh mục nào trong hệ thống.',
                    'data' => []
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Danh sách danh mục',
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi lấy danh sách danh mục');
        }
    }






    public function trashed()
    {
        try {
            $trashedCategories = Category::onlyTrashed()->orderBy('deleted_at', 'desc')->get();

            if ($trashedCategories->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Không có danh mục đã bị xóa mềm.',
                    'data' => []
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => 'Danh sách danh mục đã bị xóa mềm',
                'data' => $trashedCategories
            ]);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi lấy danh mục đã xóa mềm');
        }
    }

    public function store(Request $request)
    {
        try {
            // Validate dữ liệu đầu vào với thông báo tùy chỉnh
            $validator = $request->validate([
                'name' => 'required|string|max:255|unique:categories,name',
                'description' => 'nullable|string',
            ], [
                'name.required' => 'Tên danh mục là bắt buộc.',
                'name.unique' => 'Tên danh mục đã tồn tại, vui lòng chọn tên khác.',
                'name.string' => 'Tên danh mục phải là chuỗi ký tự.',
                'name.max' => 'Tên danh mục không được dài quá :max ký tự.',
            ]);

            // Set giá trị mặc định cho status nếu không có
            $data = $request->all();
            $data['status'] = $data['status'] ?? 'Hoạt động';

            // Thêm danh mục mới vào cơ sở dữ liệu
            $category = Category::create($data);

            return response()->json([
                'status' => true,
                'message' => 'Thêm danh mục thành công',
                'data' => $category
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (QueryException $e) {
            if ($e->getCode() == 23000) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tên danh mục đã tồn tại, vui lòng chọn tên khác.',
                    'error' => $e->getMessage(),
                ], 400);
            }
            return response()->json([
                'status' => false,
                'message' => 'Lỗi khi thêm danh mục vào cơ sở dữ liệu',
                'error' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Có lỗi xảy ra khi thêm danh mục',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $category = Category::withTrashed()->findOrFail($id);

            return response()->json([
                'status' => true,
                'message' => 'Chi tiết danh mục',
                'data' => $category
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không tồn tại',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi lấy chi tiết danh mục');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $category = Category::withTrashed()->findOrFail($id);

            // Validate dữ liệu đầu vào
            $request->validate([
                'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $id,
                'description' => 'nullable|string',
                'status' => 'sometimes|required|in:Hoạt động,Ngưng hoạt động'
            ]);

            // Cập nhật thông tin danh mục
            $category->update($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật danh mục thành công',
                'data' => $category
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không tồn tại',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi cập nhật danh mục');
        }
    }

    public function softDelete($id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->delete();

            return response()->json([
                'status' => true,
                'message' => 'Danh mục đã được xóa mềm'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không tồn tại',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi xóa mềm danh mục');
        }
    }

    public function restore($id)
    {
        try {
            $category = Category::onlyTrashed()->findOrFail($id);
            $category->restore();

            return response()->json([
                'status' => true,
                'message' => 'Danh mục đã được khôi phục'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không tồn tại trong danh sách đã xóa mềm',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi khôi phục danh mục');
        }
    }

    public function forceDelete($id)
    {
        try {
            $category = Category::onlyTrashed()->findOrFail($id);
            $category->forceDelete();

            return response()->json([
                'status' => true,
                'message' => 'Danh mục đã bị xóa vĩnh viễn'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Danh mục không tồn tại trong danh sách đã xóa mềm',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return $this->serverError($e, 'Lỗi khi xóa vĩnh viễn danh mục');
        }
    }

    private function serverError($e, $customMessage)
    {
        return response()->json([
            'status' => false,
            'message' => $customMessage,
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
            'trace' => $e->getTrace()
        ], 500);
    }
}
