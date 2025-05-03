<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Lấy danh sách tất cả users
    public function index()
    {
        try {
            $users = User::whereNull('deleted_at')->get();
    
            return response()->json([
                'status' => true,
                'message' => 'Tải danh sách users thành công',
                'data' => $users
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'error_message' => $th->getMessage(),
                'error_line' => $th->getLine()
            ], 500);
        }
    }
    
    

    // Thêm user mới
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:Admin,Customer'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role
        ]);

        return response()->json(['message' => 'Tạo tài khoản thành công', 'user' => $user], 201);
    }

    // Xem thông tin chi tiết user
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }
        return response()->json($user, 200);
    }

    // Cập nhật user
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|min:6',
            'role' => 'sometimes|in:Admin,Customer',
            'status' => 'sometimes|required|in:Hoạt động,Ngưng hoạt động' 
        ]); 

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->update([
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
            'role' => $request->role ?? $user->role,
            'status' => $request->status ?? $user->status,
        ]);

        return response()->json(['message' => 'Cập nhật tài khoản thành công ', 'user' => $user], 200);
    }

    // Xóa mềm user
    public function softDelete($id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
    }

    $user->delete(); // Xóa mềm (đánh dấu deleted_at)
    return response()->json(['message' => 'Xóa tài khoản thành công'], 200);
}

public function trashed()
{
    try {
        // Lấy danh sách users đã bị xóa mềm (có `deleted_at` không null)
        $deletedUsers = User::onlyTrashed()->get();

        return response()->json([
            'status' => true,
            'message' => 'Tải danh sách users đã bị xóa mềm thành công',
            'data' => $deletedUsers
        ], 200);
        
    } catch (\Throwable $th) {
        return response()->json([
            'status' => false,
            'error_message' => $th->getMessage(),
            'error_line' => $th->getLine()
        ], 500);
    }
}

public function restore($id)
{
    $user = User::withTrashed()->find($id);
    if (!$user) {
        return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
    }

    if (!$user->trashed()) {
        return response()->json(['message' => 'Tài khoản chưa bị xóa'], 400);
    }

    $user->restore(); // Khôi phục tài khoản
    return response()->json(['message' => 'Khôi phục tài khoản thành công', 'user' => $user], 200);
}
   


public function forceDelete($id)
{
    $user = User::withTrashed()->find($id);
    if (!$user) {
        return response()->json(['message' => 'Không tìm thấy tài khoản'], 404);
    }

    $user->forceDelete(); // Xóa vĩnh viễn
    return response()->json(['message' => 'Tài khoản đã bị xóa vĩnh viễn'], 200);
}

}