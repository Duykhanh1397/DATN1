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







// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\{
//     AuthController,
//     UserController,
//     CategoryController,
//     ProductController,
//     ProductVariantController,
//     VariantValueController,
//     VariantImageController,
//     VoucherController,
//     CartController,
//     CartItemController,
//     OrderController,
//     OrderItemController,
//     PaymentController
// };

// /*
// |--------------------------------------------------------------------------
// | API Routes
// |--------------------------------------------------------------------------
// */

// // 🚀 **Authentication Routes**
// Route::prefix('auth')->controller(AuthController::class)->group(function () {
//     Route::post('register', 'RegisterUser');
//     Route::post('login', 'loginUser');
//     Route::post('forgot-password', 'forgotPassword')->name('password.email');  // Đặt tên route này để Laravel nhận diện
//     Route::post('reset-password', 'resetPassword')->name('password.update');  // Đặt tên cho reset-password
// });
// // Định nghĩa route reset mật khẩu của Laravel
// Route::get('reset-password/{token}', function ($token) {
//     return response()->json(['token' => $token]);
// })->name('password.reset');

// // ✅ **Protected Routes (Require Auth)**
// Route::middleware('auth:sanctum')->group(function () {

//     // 🔐 **User Authentication**
//     Route::prefix('auth')->controller(AuthController::class)->group(function () {
//         Route::post('logout', 'logout');
//         Route::post('change-password', 'changePassword');
//         Route::get('profile', 'profile');
//     });

//     // 👤 **User Management (Admin)**
//     Route::middleware('role:Admin')->prefix('admin')->group(function () {
//         Route::apiResource('users', UserController::class);
//         Route::get('users/deleted', [UserController::class, 'getDeletedUsers']);
//         Route::post('users/{id}/restore', [UserController::class, 'restore']);
//         Route::delete('users/{id}/force-delete', [UserController::class, 'forceDelete']);
//     });

//     // 🛒 **Cart & Cart Items**
//     Route::prefix('cart')->group(function () {
//         Route::get('/', [CartItemController::class, 'index']);
//         Route::delete('{cartId}', [CartController::class, 'destroy']);
//         Route::prefix('items')->group(function () {
//             Route::get('/', [CartItemController::class, 'index']);
//             Route::post('/', [CartItemController::class, 'store']);
//             Route::put('{cartItemId}', [CartItemController::class, 'update']);
//             Route::delete('{cartItemId}', [CartItemController::class, 'destroy']);
//         });
//     });

//     // 🎟 **Voucher Routes**
//     Route::post('vouchers/apply', [VoucherController::class, 'applyVoucher']);

//     // 📦 **Order Routes**
//     Route::prefix('orders')->group(function () {
//         Route::post('/', [OrderController::class, 'create']);
//         Route::put('{orderId}/cancel', [OrderController::class, 'cancelOrder']);
//         Route::get('{orderId}', [OrderController::class, 'show']);
//         Route::prefix('{orderId}/items')->group(function () {
//             Route::get('/', [OrderItemController::class, 'index']);
//             Route::post('/', [OrderItemController::class, 'store']);
//         });
//     });

//     Route::prefix('order/item')->group(function () {
//         Route::put('{orderItemId}', [OrderItemController::class, 'update']);
//         Route::delete('{orderItemId}', [OrderItemController::class, 'destroy']);
//     });

//     // 💳 **Payment Routes**
//     Route::prefix('payment')->group(function () {
//         Route::post('{orderId}', [PaymentController::class, 'payment']);
//         Route::get('{orderId}/status', [PaymentController::class, 'paymentResult']);
//     });

//     // 🔥 **Admin Routes**
//     Route::middleware('role:Admin')->prefix('admin')->group(function () {

//         // 📂 **Category Management**
//         Route::apiResource('categories', CategoryController::class);
//         Route::prefix('categories')->group(function () {
//             Route::delete('{category}/soft', [CategoryController::class, 'softDelete']);
//             Route::post('{category}/restore', [CategoryController::class, 'restore']);
//             Route::get('trashed', [CategoryController::class, 'trashed']);
//         });

//         // 🛍 **Product Management**
//         Route::apiResource('products', ProductController::class);
//         Route::prefix('products')->group(function () {
//             Route::delete('{product}/soft', [ProductController::class, 'softDelete']);
//             Route::post('{product}/restore', [ProductController::class, 'restore']);
//             Route::get('trashed', [ProductController::class, 'trashed']);
//         });

//         // 🎨 **Product Variants**
//         Route::apiResource('products/{product}/variants', ProductVariantController::class);
//         Route::prefix('variants')->group(function () {
//             Route::delete('{variant}/soft', [ProductVariantController::class, 'softDelete']);
//             Route::post('{variant}/restore', [ProductVariantController::class, 'restore']);
//             Route::get('{product}/trashed', [ProductVariantController::class, 'trashed']);
//         });

//         // 🎭 **Variant Values**
//         Route::apiResource('variants/{variant}/values', VariantValueController::class);
//         Route::prefix('values')->group(function () {
//             Route::delete('{value}/soft', [VariantValueController::class, 'softDelete']);
//             Route::post('{value}/restore', [VariantValueController::class, 'restore']);
//             Route::get('{variant}/trashed', [VariantValueController::class, 'trashed']);
//         });

//         // 📸 **Product Images**
//         Route::apiResource('products/{product}/images', VariantImageController::class);
//         Route::prefix('images')->group(function () {
//             Route::delete('{image}/soft', [VariantImageController::class, 'softDelete']);
//             Route::post('{image}/restore', [VariantImageController::class, 'restore']);
//             Route::get('trashed', [VariantImageController::class, 'trashed']);
//         });

//         // 🎟 **Voucher Management**
//         Route::apiResource('vouchers', VoucherController::class);
//         Route::prefix('vouchers')->group(function () {
//             Route::delete('{id}/soft', [VoucherController::class, 'softDelete']);
//             Route::post('{id}/restore', [VoucherController::class, 'restore']);
//             Route::get('trashed', [VoucherController::class, 'trashed']);
//         });

//         // 📦 **Admin Order Management**
//         Route::prefix('orders')->group(function () {
//             Route::get('/', [OrderController::class, 'index']);
//             Route::put('{orderId}/update-status', [OrderController::class, 'updateStatus']);
//         });
//     });
// });










use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
    AuthController,
    UserController,
    CategoryController,
    ProductController,
    ProductVariantController,
    VariantColorController,
    VariantStorageController,
    VariantImageController,
    VoucherController,
    CartController,
    CartItemController,
    OrderController,
    OrderItemController,
    OrderStatusHistoryController,
    ReviewController,
    PaymentController
};

// ✅ Authentication
Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('register', 'RegisterUser');
    Route::post('login', 'loginUser');
    Route::post('forgot-password', 'forgotPassword')->name('password.email');
    Route::post('reset-password', 'resetPassword')->name('password.update');
});
Route::get('reset-password/{token}', fn($token) => response()->json(['token' => $token]))->name('password.reset');

// ✅ Guest - Check đơn hàng không cần đăng nhập
Route::get('orders/guest/check', [OrderController::class, 'guestCheckOrder']); // ✅ Tra cứu đơn hàng cho khách vãng lai

// ✅ Protected Routes (Auth + Role)
Route::middleware('auth:sanctum')->group(function () {

    // ✅ User Profile + Auth
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::post('logout', 'logout');
        Route::post('change-password', 'changePassword');
        Route::get('profile', 'profile');
    });

    // ✅ Cart 
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartItemController::class, 'index']);
        Route::delete('{cartId}', [CartController::class, 'destroy']);

        Route::prefix('items')->group(function () {
            Route::get('/', [CartItemController::class, 'index']);
            Route::post('/', [CartItemController::class, 'store']);
            Route::put('{cartItemId}', [CartItemController::class, 'update']);
            Route::delete('{cartItemId}', [CartItemController::class, 'destroy']);

            // ✅ Thêm route tăng/giảm số lượng sản phẩm
            Route::put('{cartItemId}/increase', [CartItemController::class, 'increase']);
            Route::put('{cartItemId}/decrease', [CartItemController::class, 'decrease']);
        });
    });

    // ✅ Voucher
    Route::post('vouchers/apply', [VoucherController::class, 'applyVoucher']);

    // ✅ Orders 
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'userOrders']);
        Route::post('/', [OrderController::class, 'create']);   // ✅ Đặt hàng
        Route::put('{orderId}/cancel', [OrderController::class, 'cancelOrder']);
        Route::get('{orderId}', [OrderController::class, 'show']); // ✅ Xem chi tiết đơn hàng của mình

        Route::prefix('{orderId}/items')->group(function () {
            Route::get('/', [OrderItemController::class, 'index']);
            Route::post('/', [OrderItemController::class, 'store']);
        });
        Route::get('{orderId}/status-history', [OrderStatusHistoryController::class, 'index']);
    });

    Route::prefix('order/item')->group(function () {
        Route::put('{orderItemId}', [OrderItemController::class, 'update']);
        Route::delete('{orderItemId}', [OrderItemController::class, 'destroy']);
    });

    // ✅ Reviews
    Route::prefix('reviews')->group(function () {
        Route::get('product/{productId}', [ReviewController::class, 'index']);
        Route::post('product/{productId}', [ReviewController::class, 'store']);
        Route::put('{reviewId}', [ReviewController::class, 'update']);
        Route::delete('{reviewId}', [ReviewController::class, 'destroy']);
    });

    // ✅ Payment (VNPay / COD)
    Route::prefix('payment')->group(function () {
        Route::post('{orderId}', [PaymentController::class, 'payment']);
        Route::get('{orderId}/status', [PaymentController::class, 'paymentResult']);
    });

    // ✅ Admin Only
    Route::middleware('role:Admin')->prefix('admin')->group(function () {

        // ✅ Users Management
        Route::apiResource('users', UserController::class);
        Route::get('users/deleted', [UserController::class, 'getDeletedUsers']);
        Route::post('users/{id}/restore', [UserController::class, 'restore']);
        Route::delete('users/{id}/force-delete', [UserController::class, 'forceDelete']);

        // ✅ Category Management
        Route::apiResource('categories', CategoryController::class);
        Route::prefix('categories')->group(function () {
            Route::delete('{category}/soft', [CategoryController::class, 'softDelete']);
            Route::post('{category}/restore', [CategoryController::class, 'restore']);
            Route::get('trashed', [CategoryController::class, 'trashed']);
        });

        // ✅ Product Management
        Route::apiResource('products', ProductController::class);
        Route::prefix('products')->group(function () {
            Route::delete('{product}/soft', [ProductController::class, 'softDelete']);
            Route::post('{product}/restore', [ProductController::class, 'restore']);
            Route::get('trashed', [ProductController::class, 'trashed']);
            Route::put('/products/{id}', [ProductController::class, 'update']);

        });

        // ✅ Product Variant Management (Color + Storage)
        Route::apiResource('products/{product}/productvariants', ProductVariantController::class);
        Route::prefix('productvariants')->group(function () {
            Route::get('/', [ProductVariantController::class, 'getAllProductVariants']);
            Route::get('{variant}/product', [ProductVariantController::class, 'getProductByVariant']);
            Route::delete('{productvariant}/soft', [ProductVariantController::class, 'softDelete']);
            Route::post('{productvariant}/restore', [ProductVariantController::class, 'restore']);
            Route::get('{product}/trashed', [ProductVariantController::class, 'trashed']);
            Route::delete('{productvariant}/force-delete', [ProductVariantController::class, 'forceDelete']);
            Route::get('{id}', [ProductVariantController::class, 'show'])->name('productvariants.show');
            Route::put('{variant}', [ProductVariantController::class, 'update']);
        });
 

        // ✅ Variant Color Management
        Route::apiResource('variantcolor', VariantColorController::class);
        Route::prefix('variantcolor')->group(function () {
            Route::delete('{id}/soft', [VariantColorController::class, 'destroy']);
            Route::post('{id}/restore', [VariantColorController::class, 'restore']);
            Route::get('trashed', [VariantColorController::class, 'trashed']);
            Route::delete('{id}/force-delete', [VariantColorController::class, 'forceDelete']);
        });

        // ✅ Variant Storage Management
        Route::apiResource('variantstorage', VariantStorageController::class);
        Route::prefix('variantstorage')->group(function () {
            Route::delete('{id}/soft', [VariantStorageController::class, 'destroy']);
            Route::post('{id}/restore', [VariantStorageController::class, 'restore']);
            Route::get('trashed', [VariantStorageController::class, 'trashed']);
            Route::delete('{id}/force-delete', [VariantStorageController::class, 'forceDelete']);
        });

        // ✅ Product Variant Images
        Route::apiResource('productvariants/{product_variant}/images', VariantImageController::class); // Sử dụng mối quan hệ product_variant
        Route::prefix('productvariants/{product_variant}/images')->group(function () {
            Route::delete('{image}/soft', [VariantImageController::class, 'softDelete']);
            Route::post('{image}/restore', [VariantImageController::class, 'restore']);
            Route::get('trashed', [VariantImageController::class, 'trashed']);
        });

        // ✅ Voucher Management
        Route::apiResource('vouchers', VoucherController::class);
        Route::prefix('vouchers')->group(function () {
            Route::delete('{id}/soft', [VoucherController::class, 'softDelete']);
            Route::post('{id}/restore', [VoucherController::class, 'restore']);
            Route::get('trashed', [VoucherController::class, 'trashed']);
        });

        // ✅ Admin Order Management
        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index']);
            Route::put('{orderId}/update-status', [OrderController::class, 'updateStatus']);
        });
    });


    // 📌 API dành cho user (không yêu cầu role admin)
Route::middleware('auth:sanctum')->group(function () {
    // 📌 Người dùng có thể xem danh sách sản phẩm
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);

    // 📌 Người dùng có thể xem danh mục
    Route::get('/categories', [CategoryController::class, 'index']);

});

});