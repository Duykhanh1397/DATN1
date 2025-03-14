<?php

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\Api\UserController;

// /*
// |--------------------------------------------------------------------------
// | API Routes
// |--------------------------------------------------------------------------
// |
// | Đây là nơi bạn đăng ký các route API cho ứng dụng của mình.
// | Tất cả các route này sẽ được tải bởi RouteServiceProvider trong nhóm middleware "api".
// |
// */

// // Đăng ký và đăng nhập
// Route::post('/auth/register', [AuthController::class, 'RegisterUser']);
// // Route đăng nhập
// Route::post('/auth/login', [AuthController::class, 'loginUser'])->name('auth.login');

// // Route chỉ dành cho Admin
// Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
//     Route::get('/admin/dashboard', function () {
//         return response()->json(['message' => 'Welcome to Admin Dashboard']);
//     })->name('admin.dashboard');
// });

// // Route quên mật khẩu (gửi email reset password)
// Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');

// // Route đặt lại mật khẩu bằng token từ email
// Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

// // Chỉ những người dùng đã đăng nhập (có token) mới có thể đổi mật khẩu
// Route::middleware('auth:sanctum')->post('/auth/change-password', [AuthController::class, 'changePassword']);




// Route::middleware(['auth:sanctum', 'role:Admin'])->group(function () {
//     Route::get('/users', [UserController::class, 'index']); // Lấy danh sách user
//     Route::post('/users', [UserController::class, 'store']); // Tạo user mới
//     Route::get('/users/{id}', [UserController::class, 'show']); // Chi tiết user
//     Route::put('/users/{id}', [UserController::class, 'update']); // Cập nhật user
//     Route::delete('/users/{id}', [UserController::class, 'destroy']); // Xóa user
// });



















// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\Api\UserController;

// /*
// |--------------------------------------------------------------------------
// | API Routes
// |--------------------------------------------------------------------------
// */
// // Route::middleware('auth:sanctum')->post('/auth/change-password', [AuthController::class, 'changePassword']);

// //  **Routes Đăng Ký & Đăng Nhập**
// Route::post('/auth/register', [AuthController::class, 'RegisterUser'])->name('auth.register');
// Route::post('/auth/login', [AuthController::class, 'loginUser'])->name('auth.login');

// //  **Routes Quên Mật Khẩu**
// Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
// Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');




// //  **Routes Yêu Cầu Đăng Nhập**
// Route::middleware(['auth:sanctum'])->group(function () {

//     // Đăng Xuất
//     Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

//     // Đổi Mật Khẩu
//     Route::post('/auth/change-password', [AuthController::class, 'changePassword'])->name('auth.change-password');
  
    

//     // Lấy Thông Tin Người Dùng
//     Route::get('/auth/profile', [AuthController::class, 'profile'])->name('auth.profile');

//     //  **Routes Chỉ Dành Cho ADMIN - Quản Lý Users**
//     Route::middleware(['role:Admin'])->group(function () {
//         Route::get('/users', [UserController::class, 'index'])->name('users.index'); // Danh sách user
//         Route::post('/users', [UserController::class, 'store'])->name('users.store'); // Thêm user mới
//         Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show'); // Xem thông tin user
//         Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update'); // Cập nhật user
//         Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy'); // Xóa user
//     });
// });



// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\AuthController;
// use App\Http\Controllers\Api\UserController;

// /*
// |--------------------------------------------------------------------------
// | API Routes
// |--------------------------------------------------------------------------
// */

// // **AUTH Routes**
// Route::prefix('auth')->controller(AuthController::class)->group(function () {
//     Route::post('/register', 'RegisterUser')->name('auth.register');
//     Route::post('/login', 'loginUser')->name('auth.login');
//     Route::post('/forgot-password', 'forgotPassword')->name('password.email');
//     Route::post('/reset-password', 'resetPassword')->name('password.update');
// });

// // **Protected Routes (Require Auth)**
// Route::middleware(['auth:sanctum'])->group(function () {
    
//     Route::prefix('auth')->controller(AuthController::class)->group(function () {
//         Route::post('/logout', 'logout')->name('auth.logout');
//         Route::post('/change-password', 'changePassword')->name('auth.change-password');
//         Route::get('/profile', 'profile')->name('auth.profile');
//     });

//     // **Admin Routes - User Management**
//     Route::prefix('admin')->middleware(['role:Admin'])->group(function () {
//         Route::apiResource('users', UserController::class); // CRUD users

//         // Các route mở rộng (không có trong apiResource)
//         Route::get('users/deleted', [UserController::class, 'getDeletedUsers'])->name('users.deleted'); // Danh sách user đã xóa mềm
//         Route::post('users/{id}/restore', [UserController::class, 'restore'])->name('users.restore'); // Khôi phục user
//         Route::delete('users/{id}/force-delete', [UserController::class, 'forceDelete'])->name('users.force-delete'); // Xóa vĩnh viễn



        
//     });
// });






use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    UserController,
    CategoryController,
    ProductController,
    ProductVariantController,
    VariantController,
    VariantValueController,
    VariantImageController,
    VoucherController,
    CartController,
    CartItemController,
    OrderController,
    OrderItemController,
    PaymentController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🚀 **Authentication Routes**
Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('register', 'RegisterUser');
    Route::post('login', 'loginUser');
    Route::post('forgot-password', 'forgotPassword')->name('password.email');
    Route::post('reset-password', 'resetPassword')->name('password.update');
});
Route::get('reset-password/{token}', function ($token) {
    return response()->json(['token' => $token]);
})->name('password.reset');

// ✅ **Protected Routes (Require Auth)**
Route::middleware('auth:sanctum')->group(function () {

    // 🔐 **User Authentication**
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::post('logout', 'logout');
        Route::post('change-password', 'changePassword');
        Route::get('profile', 'profile');
    });

    // 👤 **User Management (Admin)**
    Route::middleware('role:Admin')->prefix('admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::get('users/deleted', [UserController::class, 'getDeletedUsers']);
        Route::post('users/{id}/restore', [UserController::class, 'restore']);
        Route::delete('users/{id}/force-delete', [UserController::class, 'forceDelete']);
    });

    // 🛒 **Cart & Cart Items**
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartItemController::class, 'index']);
        Route::delete('{cartId}', [CartController::class, 'destroy']);
        Route::prefix('items')->group(function () {
            Route::get('/', [CartItemController::class, 'index']);
            Route::post('/', [CartItemController::class, 'store']);
            Route::put('{cartItemId}', [CartItemController::class, 'update']);
            Route::delete('{cartItemId}', [CartItemController::class, 'destroy']);
        });
    });

    // 🎟 **Voucher Routes**
    Route::post('vouchers/apply', [VoucherController::class, 'applyVoucher']);

    // 📦 **Order Routes**
    Route::prefix('orders')->group(function () {
        Route::post('/', [OrderController::class, 'create']);
        Route::put('{orderId}/cancel', [OrderController::class, 'cancelOrder']);
        Route::get('{orderId}', [OrderController::class, 'show']);
        Route::prefix('{orderId}/items')->group(function () {
            Route::get('/', [OrderItemController::class, 'index']);
            Route::post('/', [OrderItemController::class, 'store']);
        });

       
       
    });

    Route::prefix('order/item')->group(function () {
        Route::put('{orderItemId}', [OrderItemController::class, 'update']);
        Route::delete('{orderItemId}', [OrderItemController::class, 'destroy']);
    });



    // 💳 **Payment Routes (VNPay + COD)**
    Route::prefix('payment')->group(function () {
        Route::post('{orderId}', [PaymentController::class, 'payment']);
        Route::get('{orderId}/status', [PaymentController::class, 'paymentResult']);
    });

    // 🔥 **Admin Routes**
    Route::middleware('role:Admin')->prefix('admin')->group(function () {

        // 📂 **Category Management**
        Route::apiResource('categories', CategoryController::class);
        Route::prefix('categories')->group(function () {
            Route::delete('{category}/soft', [CategoryController::class, 'softDelete']);
            Route::post('{category}/restore', [CategoryController::class, 'restore']);
            Route::get('trashed', [CategoryController::class, 'trashed']);
        });

        // 🛍 **Product Management**
        Route::apiResource('products', ProductController::class);
        Route::prefix('products')->group(function () {
            Route::delete('{product}/soft', [ProductController::class, 'softDelete']);
            Route::post('{product}/restore', [ProductController::class, 'restore']);
            Route::get('trashed', [ProductController::class, 'trashed']);
        });

        // 🎨 **Product Variants**
        Route::apiResource('products/{product}/productvariants', ProductVariantController::class);
        Route::prefix('productvariants')->group(function () {
            Route::delete('{productvariant}/soft', [ProductVariantController::class, 'softDelete']);
            Route::post('{productvariant}/restore', [ProductVariantController::class, 'restore']);
            Route::get('{product}/trashed', [ProductVariantController::class, 'trashed']);
        });


        // 🎭 **Variant Types**
        Route::apiResource('variants', VariantController::class);
        Route::prefix('variants')->group(function () {
            Route::delete('{variant}/soft', [VariantController::class, 'softDelete']);
            Route::post('{variant}/restore', [VariantController::class, 'restore']);
            Route::get('trashed', [VariantController::class, 'trashed']);
        });

        // 🎭 **Variant Values**
        Route::apiResource('variants/{variant}/values', VariantValueController::class);
        Route::prefix('values')->group(function () {
            Route::delete('{value}/soft', [VariantValueController::class, 'softDelete']);
            Route::post('{value}/restore', [VariantValueController::class, 'restore']);
            Route::get('{variant}/trashed', [VariantValueController::class, 'trashed']);
        });

        // 📸 **Product Images**
        Route::apiResource('products/{product}/images', VariantImageController::class);
        Route::prefix('images')->group(function () {
            Route::delete('{image}/soft', [VariantImageController::class, 'softDelete']);
            Route::post('{image}/restore', [VariantImageController::class, 'restore']);
            Route::get('trashed', [VariantImageController::class, 'trashed']);
        });

        // 🎟 **Voucher Management**
        Route::apiResource('vouchers', VoucherController::class);
        Route::prefix('vouchers')->group(function () {
            Route::delete('{id}/soft', [VoucherController::class, 'softDelete']);
            Route::post('{id}/restore', [VoucherController::class, 'restore']);
            Route::get('trashed', [VoucherController::class, 'trashed']);
        });

        // 📦 **Admin Order Management**
        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index']);
            Route::put('{orderId}/update-status', [OrderController::class, 'updateStatus']);
        });
    });
});
