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


}

