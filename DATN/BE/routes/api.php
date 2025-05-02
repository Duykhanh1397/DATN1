<?php

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
    PaymentController,
    ReportController
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
// 📌 Người dùng có thể xem danh sách sản phẩm
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
// 📌 Người dùng có thể xem danh mục
Route::get('/categories', [CategoryController::class, 'index']);
Route::apiResource('users', UserController::class);
// ✅ Protected Routes (Auth + Role)
Route::middleware('auth:sanctum')->group(function () {

    // ✅ User Profile + Auth
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::post('logout', 'logout');
        Route::post('change-password', 'changePassword');
        Route::put('profile', 'profile');
    });

    // ✅ Cart
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartItemController::class, 'index']);
        Route::delete('{cartId}', [CartController::class, 'destroy']);
        Route::delete('/remove-items/{orderId}', [CartItemController::class, 'removeItemsByOrder']); // ✅ Di chuyển ra ngoài "items"
        Route::post('/remove-items/remove-selected', [CartItemController::class, 'removeSelectedItems']);

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
        Route::put('/{id}', [OrderController::class, 'update']);
        Route::delete('/{orderId}', [OrderController::class, 'delete']);
        Route::put('{orderId}/update-status', [OrderController::class, 'updateStatus']);
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
        Route::get('variant/{productVariantId}', [ReviewController::class, 'index']);
        Route::post('variant/{productVariantId}', [ReviewController::class, 'store']);
        Route::put('{reviewId}', [ReviewController::class, 'update']);
        Route::delete('{reviewId}', [ReviewController::class, 'destroy']);
        Route::get('variant/{productVariantId}/reviewable-orders', [ReviewController::class, 'getReviewableOrders']);
        // Route::post('product/{productId}/storeWithoutOrder', [ReviewController::class, 'storeWithoutOrder']);

    });

    // ✅ Payment (VNPay / COD)
    Route::post('/vnpay/payment', [PaymentController::class, 'vnpay_payment']);
    Route::post('/payments/{orderId}', [PaymentController::class, 'vnpay_payment']);
    Route::post('/vnpay-return', [PaymentController::class, 'vnpayReturn']);
    Route::post('/payments', [PaymentController::class, 'store']);

    // ✅ Admin Only
    Route::middleware('role:Admin')->prefix('admin')->group(function () {

        // ✅ Reports
        Route::prefix('reports')->group(function () {
            Route::get('revenue/day', [ReportController::class, 'revenueByDay']);
            Route::get('revenue/week', [ReportController::class, 'revenueByWeek']);
            Route::get('revenue/month', [ReportController::class, 'revenueByMonth']);
            Route::get('revenue/custom-period', [ReportController::class, 'revenueByCustomPeriod']);
            Route::get('customers/top5', [ReportController::class, 'top5Customers']);
            Route::get('products/top5-best-selling', [ReportController::class, 'top5BestSellingProducts']);
            Route::get('products/top5-slow-selling', [ReportController::class, 'top5SlowSellingProducts']);
            Route::get('orders/status-report', [ReportController::class, 'orderStatusReport']);
            Route::get('orders/count', [ReportController::class, 'orderCount']);
            Route::get('vouchers/usage-count', [ReportController::class, 'voucherUsageCount']);
            Route::get('overview', [ReportController::class, 'overviewReport']);
        });




        // ✅ Users Management
        Route::prefix('users')->group(function () {
            Route::get('trashed', [UserController::class, 'trashed']);
            Route::delete('{id}/soft', [UserController::class, 'softDelete']);
            Route::put('{id}/restore', [UserController::class, 'restore']);
            Route::delete('{id}/force-delete', [UserController::class, 'forceDelete']);
        });
        Route::apiResource('users', UserController::class);

        // ✅ Category Management
        Route::prefix('categories')->group(function () {
            Route::get('trashed', [CategoryController::class, 'trashed']);
            Route::delete('{id}/force-delete', [CategoryController::class, 'forceDelete']);
            Route::delete('{category}/soft', [CategoryController::class, 'softDelete']);
            Route::put('{category}/restore', [CategoryController::class, 'restore']);
            Route::get('check-name', [CategoryController::class, 'checkName']);
        });
        Route::apiResource('categories', CategoryController::class);

        // ✅ Product Management

        Route::prefix('products')->group(function () {
            Route::delete('{product}/soft', [ProductController::class, 'softDelete']);
            Route::put('{product}/restore', [ProductController::class, 'restore']);
            Route::get('trashed', [ProductController::class, 'trashed']);
            Route::delete('{id}/force-delete', [ProductController::class, 'forceDelete']);
            Route::put('/products/{id}', [ProductController::class, 'update']);
            Route::get('check-name', [ProductController::class, 'checkProductName']);
        });
        Route::apiResource('products', ProductController::class);

        // ✅ Product Variant Management (Color + Storage)
        Route::prefix('productvariants')->group(function () {
            Route::get('/', [ProductVariantController::class, 'getAllProductVariants']);
            Route::get('{variant}/product', [ProductVariantController::class, 'getProductByVariant']);
            Route::delete('{variant}/soft', [ProductVariantController::class, 'softDelete']);
            Route::put('{variant}/restore', [ProductVariantController::class, 'restore']);
            Route::get('trashed', [ProductVariantController::class, 'trashed']);
            Route::delete('{productvariant}/force-delete', [ProductVariantController::class, 'forceDelete']);
            Route::get('{id}', [ProductVariantController::class, 'show'])->name('productvariants.show');
            Route::put('{variant}', [ProductVariantController::class, 'update']);
        });
        Route::apiResource('products/{product}/productvariants', ProductVariantController::class);


        // ✅ Variant Color Management
        Route::apiResource('variantcolor', VariantColorController::class);
        Route::prefix('variantcolor')->group(function () {
            Route::post('/', [VariantColorController::class, 'store']);
            Route::put('{id}', [VariantColorController::class, 'update']);
            Route::delete('{id}/soft', [VariantColorController::class, 'destroy']);
            Route::post('{id}/restore', [VariantColorController::class, 'restore']);
            Route::get('trashed', [VariantColorController::class, 'trashed']);
            Route::delete('{id}/force-delete', [VariantColorController::class, 'forceDelete']);
        });

        // ✅ Variant Storage Management
        Route::apiResource('variantstorage', VariantStorageController::class);
        Route::prefix('variantstorage')->group(function () {
            Route::post('/', [VariantStorageController::class, 'store']);
            Route::put('{id}', [VariantStorageController::class, 'update']);
            Route::delete('{id}/soft', [VariantStorageController::class, 'destroy']);
            Route::put('{id}/restore', [VariantStorageController::class, 'restore']);
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
        Route::prefix('vouchers')->group(function () {
            Route::post('/', [VoucherController::class, 'store']);
            Route::delete('{id}/soft', [VoucherController::class, 'softDelete']);
            Route::put('{id}/restore', [VoucherController::class, 'restore']);
            Route::get('trashed', [VoucherController::class, 'trashed']);
            Route::delete('{id}/force-delete', [VoucherController::class, 'forceDelete']);
            Route::get('check-code', [VoucherController::class, 'checkCode']);
        });
        Route::apiResource('vouchers', VoucherController::class);

        // ✅ Admin Order Management
        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index']);
            Route::put('{orderId}/update-status', [OrderController::class, 'updateStatus']);
        });

        Route::prefix('reviews')->group(function () {
            Route::get('/', [ReviewController::class, 'allReviews']);
            Route::put('/{id}/toggle-status', [ReviewController::class, 'toggleStatus']);
        });
    });
});
