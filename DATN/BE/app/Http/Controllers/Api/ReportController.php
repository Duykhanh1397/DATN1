<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{

    /**
     * Tính doanh thu theo ngày.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function revenueByDay(Request $request)
    {
        try {
            // Nhận ngày cụ thể từ request hoặc mặc định là hôm nay
            $dayInput = $request->get('day', Carbon::now());

            // Kiểm tra nếu ngày không hợp lệ
            if (!Carbon::canBeCreatedFromFormat($dayInput, 'Y-m-d') && !($dayInput instanceof Carbon)) {
                Log::warning("Ngày nhập vào không hợp lệ: $dayInput");
                return response()->json([
                    'error' => 'Ngày không hợp lệ hoặc không được cung cấp.',
                ], 400);
            }

            $day = Carbon::parse($dayInput);
            $startDate = (clone $day)->startOfDay();
            $endDate = (clone $day)->endOfDay();


            // Tính doanh thu trong ngày
            $revenue = Order::where('status', 'Giao hàng thành công')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_amount');

            // Nếu không có doanh thu
            if ($revenue == 0) {
                Log::info("Không tìm thấy doanh thu trong ngày: $dayInput");
                return response()->json([
                    'message' => 'Không có doanh thu trong ngày này.',
                    'start_date' => $startDate->toDateTimeString(),
                    'end_date' => $endDate->toDateTimeString(),
                ]);
            }
            $chart = Order::where('status', 'Giao hàng thành công')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    return [
                        'label' => Carbon::parse($item->date)->format('d/m'),
                        'value' => (float) $item->total,
                    ];
                });
            Log::info("Doanh thu trong ngày $dayInput: $revenue");
            return response()->json([
                'revenue' => $revenue,
                'start_date' => $startDate->toDateTimeString(),
                'end_date' => $endDate->toDateTimeString(),
                'chart' => $chart,
            ]);
        } catch (\Exception $e) {
            $errorMessage = "Lỗi khi tính doanh thu theo ngày: " . $e->getMessage();
            Log::error($errorMessage);
            return response()->json([
                'error' => 'Có lỗi xảy ra khi tính doanh thu theo ngày. Chi tiết: ' . $errorMessage,
            ], 500);
        }
    }

    /**
     * Tính doanh thu theo tuần.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function revenueByWeek(Request $request)
    {
        try {
            // Nhận ngày bắt đầu tuần từ request hoặc mặc định là đầu tuần hiện tại
            $weekStartInput = $request->get('week_start', Carbon::now()->startOfWeek()->toDateString());

            // Kiểm tra xem đầu vào có hợp lệ không
            if (!Carbon::canBeCreatedFromFormat($weekStartInput, 'Y-m-d')) {
                Log::warning("Ngày bắt đầu tuần không hợp lệ: $weekStartInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu tuần không hợp lệ hoặc không được cung cấp.',
                ], 400);
            }

            // Chuyển đổi tuần bắt đầu và tính tuần kết thúc
            $weekStart = Carbon::parse($weekStartInput)->startOfWeek();
            $weekEnd = (clone $weekStart)->endOfWeek();


            // Tính doanh thu trong tuần
            $revenue = Order::where('status', 'Giao hàng thành công')
                ->whereBetween('created_at', [$weekStart, $weekEnd])
                ->sum('total_amount');

            // Nếu không có doanh thu
            if ($revenue == 0) {
                Log::info("Không có doanh thu nào trong tuần bắt đầu từ $weekStartInput");
                return response()->json([
                    'message' => 'Không có doanh thu trong tuần này.',
                    'start_date' => $weekStart->toDateTimeString(),
                    'end_date' => $weekEnd->toDateTimeString(),
                ]);
            }

            $chart = Order::where('status', 'Giao hàng thành công')
                ->whereBetween('created_at', [$weekStart, $weekEnd])
                ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    return [
                        'label' => Carbon::parse($item->date)->format('d/m'),
                        'value' => (float) $item->total,
                    ];
                });

            Log::info("Doanh thu trong tuần bắt đầu từ $weekStartInput: $revenue");
            return response()->json([
                'revenue' => $revenue,
                'start_date' => $weekStart->toDateTimeString(),
                'end_date' => $weekEnd->toDateTimeString(),
                'chart' => $chart,
            ]);
        } catch (\Exception $e) {
            $errorMessage = "Lỗi khi tính doanh thu theo tuần: " . $e->getMessage();
            Log::error($errorMessage);
            return response()->json([
                'error' => 'Có lỗi xảy ra khi tính doanh thu theo tuần. Chi tiết: ' . $errorMessage,
            ], 500);
        }
    }

    /**
     * Tính doanh thu theo tháng.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function revenueByMonth(Request $request)
    {
        try {
            // Nhận tháng cụ thể từ request hoặc mặc định là tháng hiện tại
            $monthStartInput = $request->get('month_start', Carbon::now()->startOfMonth()->toDateString());

            // Kiểm tra đầu vào
            if (!Carbon::canBeCreatedFromFormat($monthStartInput, 'Y-m-d')) {
                Log::warning("Tháng bắt đầu không hợp lệ: $monthStartInput");
                return response()->json([
                    'error' => 'Tháng bắt đầu không hợp lệ hoặc không được cung cấp.',
                ], 400);
            }

            // Tính khoảng thời gian đầu tháng và cuối tháng
            $monthStart = Carbon::createFromFormat('Y-m-d', $monthStartInput)->startOfMonth();
            $monthEnd = $monthStart->copy()->endOfMonth();

            // Tính doanh thu trong tháng
            $revenue = Order::where('status', 'Giao hàng thành công')
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->sum('total_amount');

            // Nếu không có doanh thu
            if ($revenue == 0) {
                Log::info("Không có doanh thu nào trong tháng bắt đầu từ $monthStartInput");
                return response()->json([
                    'message' => 'Không có doanh thu trong tháng này.',
                    'start_date' => $monthStart->toDateTimeString(),
                    'end_date' => $monthEnd->toDateTimeString(),
                ]);
            }

            // Sau đoạn tính $revenue
            $chart = Order::where('status', 'Giao hàng thành công')
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    return [
                        'label' => Carbon::parse($item->date)->format('d/m'),
                        'value' => (float) $item->total,
                    ];
                });

            Log::info("Doanh thu trong tháng bắt đầu từ $monthStartInput: $revenue");
            return response()->json([
                'revenue' => $revenue,
                'start_date' => $monthStart->toDateTimeString(),
                'end_date' => $monthEnd->toDateTimeString(),
                'chart' => $chart,
            ]);
        } catch (\Exception $e) {
            $errorMessage = "Lỗi khi tính doanh thu theo tháng: " . $e->getMessage();
            Log::error($errorMessage);
            return response()->json([
                'error' => 'Có lỗi xảy ra khi tính doanh thu theo tháng. Chi tiết: ' . $errorMessage,
            ], 500);
        }
    }

    /**
     * Tính doanh thu theo khoảng thời gian tùy chỉnh.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function revenueByCustomPeriod(Request $request)
    {
        try {
            // Nhận ngày bắt đầu và kết thúc từ request
            $startDateInput = $request->get('start_date');
            $endDateInput = $request->get('end_date');

            // Nếu không có đầu vào, mặc định là đầu tháng và hiện tại
            $startDate = $startDateInput ? Carbon::parse($startDateInput) : Carbon::now()->startOfMonth();
            $endDate = $endDateInput ? Carbon::parse($endDateInput) : Carbon::now();

            // Kiểm tra tính hợp lệ của ngày
            if (!$startDateInput && !$endDateInput) {
                Log::info("Không nhận được ngày bắt đầu và ngày kết thúc từ request, sử dụng giá trị mặc định.");
            }

            if (!$startDate || !$endDate) {
                Log::warning("Ngày nhập không hợp lệ: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.',
                ], 400);
            }

            if (!$startDate->isBefore($endDate)) {
                Log::warning("Ngày bắt đầu phải xảy ra trước ngày kết thúc: start_date = $startDate, end_date = $endDate");
                return response()->json([
                    'error' => 'Ngày bắt đầu phải xảy ra trước ngày kết thúc.',
                ], 400);
            }

            // Tính doanh thu trong khoảng thời gian
            $revenue = Order::where('status', 'Giao hàng thành công')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('total_amount');

            // Nếu không có doanh thu
            if ($revenue == 0) {
                Log::info("Không có doanh thu trong khoảng thời gian từ $startDate đến $endDate");
                return response()->json([
                    'message' => 'Không có doanh thu trong khoảng thời gian này.',
                    'start_date' => $startDate->toDateTimeString(),
                    'end_date' => $endDate->toDateTimeString(),
                ]);
            }

            // Tính chart doanh thu cho từng ngày trong khoảng thời gian
            $chart = Order::where('status', 'Giao hàng thành công')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, SUM(total_amount) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    return [
                        'label' => Carbon::parse($item->date)->format('d/m'),
                        'value' => (float) $item->total,
                    ];
                });

            // Log và phản hồi doanh thu
            Log::info("Doanh thu trong khoảng từ $startDate đến $endDate là: $revenue");

            return response()->json([
                'revenue' => $revenue,
                'start_date' => $startDate->toDateTimeString(),
                'end_date' => $endDate->toDateTimeString(),
                'chart' => $chart,  // Trả về chart
            ]);

        } catch (\Exception $e) {
            $errorMessage = "Lỗi khi tính doanh thu: " . $e->getMessage();
            Log::error($errorMessage);
            return response()->json([
                'error' => 'Có lỗi xảy ra khi tính doanh thu. Chi tiết: ' . $errorMessage,
            ], 500);
        }
    }



    /**
     * Thống kê 5 khách hàng đặt hàng nhiều nhất và chi tiêu nhiều nhất.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function top5Customers(Request $request)
    {
        try {
            // Nhận ngày bắt đầu và kết thúc từ request
            $startDateInput = $request->get('start_date', Carbon::now()->startOfMonth()->toDateString());
            $endDateInput = $request->get('end_date', Carbon::now()->toDateString());

            // Kiểm tra ngày tháng hợp lệ
            if (
                !Carbon::canBeCreatedFromFormat($startDateInput, 'Y-m-d') ||
                !Carbon::canBeCreatedFromFormat($endDateInput, 'Y-m-d')
            ) {
                Log::warning("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.',
                ], 400);
            }

            $startDate = Carbon::parse($startDateInput);
            $endDate = Carbon::parse($endDateInput);

            if (!$startDate->isBefore($endDate)) {
                Log::warning("Ngày bắt đầu phải trước ngày kết thúc: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu phải trước ngày kết thúc.',
                ], 400);
            }

            // Tìm 5 khách hàng hàng đầu
            $topCustomers = Order::select(
                'user_id',
                DB::raw('COUNT(*) as order_count'),
                DB::raw('SUM(total_amount) as total_spent')
            )
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('user_id')
                ->orderByDesc('total_spent')
                ->limit(5)
                ->get()
                ->map(function ($order) {
                    // Lấy thông tin người dùng
                    $order->user = User::find($order->user_id);
                    return $order;
                });

            // Nếu không có khách hàng nào trong danh sách
            if ($topCustomers->isEmpty()) {
                Log::info("Không tìm thấy khách hàng nào trong khoảng thời gian từ $startDateInput đến $endDateInput");
                return response()->json([
                    'message' => 'Không tìm thấy khách hàng nào trong khoảng thời gian này.',
                    'start_date' => $startDate->toDateTimeString(),
                    'end_date' => $endDate->toDateTimeString(),
                ]);
            }

            Log::info("Lấy danh sách 5 khách hàng hàng đầu trong khoảng thời gian từ $startDateInput đến $endDateInput");
            return response()->json($topCustomers);
        } catch (\Exception $e) {
            $errorMessage = "Lỗi khi lấy danh sách khách hàng hàng đầu: " . $e->getMessage();
            Log::error($errorMessage);
            return response()->json([
                'error' => 'Có lỗi xảy ra khi lấy thông tin khách hàng. Chi tiết: ' . $errorMessage,
            ], 500);
        }
    }






    /**
     * Thống kê 5 biến thể sản phẩm bán chạy nhất.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function top5BestSellingProducts(Request $request)
    {
        try {
            // Nhận ngày bắt đầu và kết thúc từ request
            $startDateInput = $request->get('start_date', Carbon::now()->startOfMonth()->toDateString());
            $endDateInput = $request->get('end_date', Carbon::now()->toDateString());

            // Kiểm tra tính hợp lệ của ngày tháng
            if (
                !Carbon::canBeCreatedFromFormat($startDateInput, 'Y-m-d') ||
                !Carbon::canBeCreatedFromFormat($endDateInput, 'Y-m-d')
            ) {
                Log::warning("Ngày không hợp lệ: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu hoặc ngày kết thúc không đúng định dạng. Vui lòng kiểm tra lại.',
                ], 400);
            }

            $startDate = Carbon::parse($startDateInput);
            $endDate = Carbon::parse($endDateInput);

            if (!$startDate->isBefore($endDate)) {
                Log::warning("Ngày bắt đầu không trước ngày kết thúc: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc. Vui lòng kiểm tra lại.',
                ], 400);
            }

            // Bật ghi log truy vấn SQL để debug
            DB::enableQueryLog();

            // Tìm 5 biến thể sản phẩm bán chạy nhất
            $topVariants = ProductVariant::select(
                'product_variants.id as variant_id',
                'products.name as product_name',
                'variant_color.value as color_value', // Sử dụng trường value thay vì name
                'variant_storage.value as storage_value', // Sử dụng trường value thay vì name
                DB::raw('CONCAT(products.name, " (", variant_color.value, ", ", variant_storage.value, ")") as variant_name'),
                DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_sold')
            )
                ->join('products', 'product_variants.product_id', '=', 'products.id')
                ->join('variant_color', 'product_variants.color_id', '=', 'variant_color.id')
                ->join('variant_storage', 'product_variants.storage_id', '=', 'variant_storage.id')
                ->leftJoin('order_items', 'order_items.product_variant_id', '=', 'product_variants.id')
                ->leftJoin('orders', 'orders.id', '=', 'order_items.order_id')
                ->where('orders.status', 'Giao hàng thành công')
                ->whereBetween('orders.created_at', [$startDate, $endDate])
                ->whereNull('variant_color.deleted_at') // Chỉ lấy bản ghi chưa bị xóa mềm
                ->whereNull('variant_storage.deleted_at') // Chỉ lấy bản ghi chưa bị xóa mềm
                ->groupBy('product_variants.id', 'products.name', 'variant_color.value', 'variant_storage.value')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get();

            // Nếu không có biến thể nào
            if ($topVariants->isEmpty()) {
                Log::info("Không tìm thấy biến thể sản phẩm trong khoảng thời gian: start_date = $startDateInput, end_date = $endDateInput", [
                    'sql_query' => DB::getQueryLog()
                ]);
                return response()->json([
                    'message' => 'Không có biến thể sản phẩm nào được tìm thấy trong khoảng thời gian này.',
                    'start_date' => $startDate->toDateTimeString(),
                    'end_date' => $endDate->toDateTimeString(),
                ], 200);
            }

            // Lưu danh sách variant_id để loại trừ
            $topVariantIds = $topVariants->pluck('variant_id')->toArray();

            // Trả về kết quả
            Log::info("Lấy thành công 5 biến thể sản phẩm bán chạy nhất: start_date = $startDateInput, end_date = $endDateInput", [
                'variants' => $topVariants->toArray(),
                'sql_query' => DB::getQueryLog()
            ]);
            return response()->json([
                'data' => $topVariants,
                'excluded_ids' => $topVariantIds
            ], 200);
        } catch (\Exception $e) {
            $errorMessage = "Lỗi khi lấy danh sách biến thể bán chạy: " . $e->getMessage();
            Log::error($errorMessage, [
                'exception' => $e,
                'stack_trace' => $e->getTraceAsString(),
                'start_date' => $startDateInput,
                'end_date' => $endDateInput,
                'sql_query' => DB::getQueryLog()
            ]);
            return response()->json([
                'error' => 'Đã xảy ra lỗi khi lấy thông tin biến thể sản phẩm bán chạy. Vui lòng thử lại sau.',
            ], 500);
        } finally {
            // Tắt ghi log truy vấn SQL
            DB::disableQueryLog();
        }
    }

    /**
     * Thống kê 5 biến thể sản phẩm bán ế nhất.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function top5SlowSellingProducts(Request $request)
    {
        try {
            // Nhận ngày bắt đầu và kết thúc từ request
            $startDateInput = $request->get('start_date', Carbon::now()->startOfMonth()->toDateString());
            $endDateInput = $request->get('end_date', Carbon::now()->toDateString());

            // Kiểm tra tính hợp lệ của ngày tháng
            if (
                !Carbon::canBeCreatedFromFormat($startDateInput, 'Y-m-d') ||
                !Carbon::canBeCreatedFromFormat($endDateInput, 'Y-m-d')
            ) {
                Log::warning("Ngày không hợp lệ: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu hoặc ngày kết thúc không đúng định dạng. Vui lòng kiểm tra lại.',
                ], 400);
            }

            $startDate = Carbon::parse($startDateInput);
            $endDate = Carbon::parse($endDateInput);

            if (!$startDate->isBefore($endDate)) {
                Log::warning("Ngày bắt đầu không trước ngày kết thúc: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc. Vui lòng kiểm tra lại.',
                ], 400);
            }

            // Bật ghi log truy vấn SQL để debug
            DB::enableQueryLog();

            // Lấy danh sách variant_id của các biến thể bán chạy nhất để loại trừ
            $topVariants = ProductVariant::select('product_variants.id')
                ->join('products', 'product_variants.product_id', '=', 'products.id')
                ->leftJoin('order_items', 'order_items.product_variant_id', '=', 'product_variants.id')
                ->leftJoin('orders', 'orders.id', '=', 'order_items.order_id')
                ->where('orders.status', 'Giao hàng thành công')
                ->whereBetween('orders.created_at', [$startDate, $endDate])
                ->groupBy('product_variants.id')
                ->orderByDesc(DB::raw('COALESCE(SUM(order_items.quantity), 0)'))
                ->limit(5)
                ->get();

            $excludedVariantIds = $topVariants->pluck('id')->toArray();

            // Tìm 5 biến thể sản phẩm bán chậm nhất
            $slowVariants = ProductVariant::select(
                'product_variants.id as variant_id',
                'products.name as product_name',
                'variant_color.value as color_value', // Sử dụng trường value thay vì name
                'variant_storage.value as storage_value', // Sử dụng trường value thay vì name
                DB::raw('CONCAT(products.name, " (", variant_color.value, ", ", variant_storage.value, ")") as variant_name'),
                DB::raw('COALESCE(SUM(order_items.quantity), 0) as total_sold')
            )
                ->join('products', 'product_variants.product_id', '=', 'products.id')
                ->join('variant_color', 'product_variants.color_id', '=', 'variant_color.id')
                ->join('variant_storage', 'product_variants.storage_id', '=', 'variant_storage.id')
                ->leftJoin('order_items', 'order_items.product_variant_id', '=', 'product_variants.id')
                ->leftJoin('orders', 'orders.id', '=', 'order_items.order_id')
                ->where('orders.status', 'Giao hàng thành công')
                ->whereBetween('orders.created_at', [$startDate, $endDate])
                ->whereNull('variant_color.deleted_at') // Chỉ lấy bản ghi chưa bị xóa mềm
                ->whereNull('variant_storage.deleted_at') // Chỉ lấy bản ghi chưa bị xóa mềm
                ->whereNotIn('product_variants.id', $excludedVariantIds)
                ->groupBy('product_variants.id', 'products.name', 'variant_color.value', 'variant_storage.value')
                ->orderBy('total_sold', 'asc')
                ->limit(5)
                ->get();

            // Nếu không có biến thể nào
            if ($slowVariants->isEmpty()) {
                Log::info("Không tìm thấy biến thể sản phẩm trong khoảng thời gian: start_date = $startDateInput, end_date = $endDateInput", [
                    'sql_query' => DB::getQueryLog()
                ]);
                return response()->json([
                    'message' => 'Không có biến thể sản phẩm nào được tìm thấy trong khoảng thời gian này.',
                    'start_date' => $startDate->toDateTimeString(),
                    'end_date' => $endDate->toDateTimeString(),
                ], 200);
            }

            // Trả về kết quả
            Log::info("Lấy thành công 5 biến thể sản phẩm bán chậm nhất: start_date = $startDateInput, end_date = $endDateInput", [
                'variants' => $slowVariants->toArray(),
                'sql_query' => DB::getQueryLog()
            ]);
            return response()->json($slowVariants, 200);
        } catch (\Exception $e) {
            $errorMessage = "Lỗi khi lấy danh sách biến thể bán chậm: " . $e->getMessage();
            Log::error($errorMessage, [
                'exception' => $e,
                'stack_trace' => $e->getTraceAsString(),
                'start_date' => $startDateInput,
                'end_date' => $endDateInput,
                'sql_query' => DB::getQueryLog()
            ]);
            return response()->json([
                'error' => 'Đã xảy ra lỗi khi lấy thông tin biến thể sản phẩm bán chậm. Vui lòng thử lại sau.',
            ], 500);
        } finally {
            // Tắt ghi log truy vấn SQL
            DB::disableQueryLog();
        }
    }





    /**
     * Đếm số lượng đơn hàng trong khoảng thời gian.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */

    public function orderCount(Request $request)
    {
        try {
            // Nhận ngày bắt đầu và kết thúc từ request
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            // Nếu không có giá trị, sử dụng giá trị mặc định
            if (!$startDate) {
                $startDate = Carbon::now()->startOfMonth();
                Log::info("Không nhận được start_date từ request, sử dụng mặc định: $startDate");
            } else {
                $startDate = Carbon::parse($startDate);
            }

            if (!$endDate) {
                $endDate = Carbon::now();
                Log::info("Không nhận được end_date từ request, sử dụng mặc định: $endDate");
            } else {
                $endDate = Carbon::parse($endDate);
            }

            // Kiểm tra tính hợp lệ của ngày
            if (!$startDate || !$endDate || !$startDate->isBefore($endDate)) {
                $errorMessage = "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ. start_date: $startDate, end_date: $endDate";
                Log::warning($errorMessage);
                return response()->json([
                    'error' => $errorMessage,
                ], 400);
            }

            // Đếm số lượng đơn hàng trong khoảng thời gian
            $orderCount = Order::whereBetween('created_at', [$startDate, $endDate])->count();

            // Nếu không có đơn hàng
            if ($orderCount === 0) {
                Log::info("Không tìm thấy đơn hàng trong khoảng thời gian từ $startDate đến $endDate.");
                return response()->json([
                    'message' => 'Không có đơn hàng trong khoảng thời gian này.',
                    'order_count' => 0,
                    'start_date' => $startDate->toDateString(),
                    'end_date' => $endDate->toDateString(),
                ]);
            }

            // Trả về kết quả nếu có đơn hàng
            Log::info("Số lượng đơn hàng trong khoảng từ $startDate đến $endDate là $orderCount.");
            return response()->json([
                'order_count' => $orderCount,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ]);
        } catch (\Exception $e) {
            $errorMessage = "Có lỗi xảy ra khi đếm số lượng đơn hàng: " . $e->getMessage();
            Log::error($errorMessage);
            return response()->json([
                'error' => $errorMessage,
            ], 500);
        }
    }




    /**
     * Thống kê tình trạng đơn hàng.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function orderStatusReport(Request $request)
    {
        try {
            // Nhận ngày bắt đầu và kết thúc từ request hoặc dùng giá trị mặc định
            $startDateInput = $request->get('start_date', Carbon::now()->startOfMonth()->toDateString());
            $endDateInput = $request->get('end_date', Carbon::now()->toDateString());

            // Kiểm tra tính hợp lệ của ngày tháng
            if (
                !Carbon::canBeCreatedFromFormat($startDateInput, 'Y-m-d') ||
                !Carbon::canBeCreatedFromFormat($endDateInput, 'Y-m-d')
            ) {
                Log::warning("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.',
                ], 400);
            }

            $startDate = Carbon::parse($startDateInput);
            $endDate = Carbon::parse($endDateInput);

            if (!$startDate->isBefore($endDate)) {
                Log::warning("Ngày bắt đầu phải xảy ra trước ngày kết thúc: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu phải xảy ra trước ngày kết thúc.',
                ], 400);
            }

            // Lấy thống kê tình trạng đơn hàng
            $statusCounts = Order::select('status', DB::raw('COUNT(*) as count'))
                ->whereBetween('created_at', [$startDate, $endDate])
                ->groupBy('status')
                ->get();

            if ($statusCounts->isEmpty()) {
                Log::info("Không có đơn hàng nào trong khoảng thời gian từ $startDateInput đến $endDateInput");
                return response()->json([
                    'message' => 'Không có đơn hàng trong khoảng thời gian này.',
                    'start_date' => $startDate->toDateTimeString(),
                    'end_date' => $endDate->toDateTimeString(),
                ]);
            }

            Log::info("Lấy danh sách tình trạng đơn hàng trong khoảng thời gian từ $startDateInput đến $endDateInput");
            return response()->json($statusCounts);
        } catch (\Exception $e) {
            $errorMessage = "Lỗi khi lấy danh sách tình trạng đơn hàng: " . $e->getMessage();
            Log::error($errorMessage);
            return response()->json([
                'error' => 'Có lỗi xảy ra khi lấy thông tin tình trạng đơn hàng. Chi tiết: ' . $errorMessage,
            ], 500);
        }
    }

    /**
     * Đếm số lượng mã giảm giá được sử dụng trong khoảng thời gian.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function voucherUsageCount(Request $request)
    {
        try {
            // Lấy ngày bắt đầu và kết thúc từ request hoặc sử dụng giá trị mặc định
            $startDateInput = $request->get('start_date', Carbon::now()->startOfMonth()->toDateString());
            $endDateInput = $request->get('end_date', Carbon::now()->toDateString());

            // Kiểm tra tính hợp lệ của ngày
            if (
                !Carbon::canBeCreatedFromFormat($startDateInput, 'Y-m-d') ||
                !Carbon::canBeCreatedFromFormat($endDateInput, 'Y-m-d')
            ) {
                Log::warning("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.',
                ], 400);
            }

            $startDate = Carbon::parse($startDateInput);
            $endDate = Carbon::parse($endDateInput);

            if (!$startDate->isBefore($endDate)) {
                Log::warning("Ngày bắt đầu phải xảy ra trước ngày kết thúc: start_date = $startDateInput, end_date = $endDateInput");
                return response()->json([
                    'error' => 'Ngày bắt đầu phải xảy ra trước ngày kết thúc.',
                ], 400);
            }

            // Đếm số lượng mã giảm giá được sử dụng
            $voucherUsageCount = Order::whereNotNull('voucher_id') // Lấy đơn hàng có voucher_id
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();

            // Nếu không có mã giảm giá nào
            if ($voucherUsageCount == 0) {
                Log::info("Không có mã giảm giá nào được sử dụng trong khoảng thời gian từ $startDateInput đến $endDateInput");
                return response()->json([
                    'message' => 'Không có mã giảm giá nào được sử dụng trong khoảng thời gian này.',
                    'start_date' => $startDate->toDateTimeString(),
                    'end_date' => $endDate->toDateTimeString(),
                ]);
            }

            // Trả về kết quả nếu có
            Log::info("Số lượng mã giảm giá được sử dụng trong khoảng thời gian từ $startDateInput đến $endDateInput: $voucherUsageCount");
            return response()->json([
                'voucher_usage_count' => $voucherUsageCount,
                'start_date' => $startDate->toDateTimeString(),
                'end_date' => $endDate->toDateTimeString(),
            ]);
        } catch (\Exception $e) {
            $errorMessage = "Lỗi khi lấy số lượng mã giảm giá được sử dụng: " . $e->getMessage();
            Log::error($errorMessage);
            return response()->json([
                'error' => 'Có lỗi xảy ra khi đếm số lượng mã giảm giá được sử dụng. Chi tiết: ' . $errorMessage,
            ], 500);
        }
    }

    public function overviewReport()
    {
        try {
            $totalProducts = DB::table('product_variants')->count();

            $totalRevenue = Order::where('status', 'Giao hàng thành công')
                ->sum('total_amount');

            $totalOrders = Order::count();

            $totalSoldProducts = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->where('orders.status', 'Giao hàng thành công')
                ->sum('order_items.quantity');

            return response()->json([
                'total_products' => $totalProducts,
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'total_sold_products' => $totalSoldProducts,
            ]);
        } catch (\Exception $e) {
            Log::error('Lỗi khi lấy báo cáo tổng quan: ' . $e->getMessage());
            return response()->json([
                'error' => 'Có lỗi xảy ra khi lấy dữ liệu tổng quan.',
            ], 500);
        }
    }


}

