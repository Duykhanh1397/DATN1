@component('mail::message')
# Đơn hàng của bạn đã giao hàng thành công!

Chào bạn,

Chúng tôi rất vui thông báo rằng đơn hàng **#{{ $order->id }}** của bạn đã được giao thành công vào ngày **{{ $order->updated_at->format('d/m/Y H:i') }}**.

## Thông tin đơn hàng
- **Mã đơn hàng**: {{ $order->id }}
- **Tổng tiền**: {{ number_format($order->total_amount, 0, ',', '.') }} VNĐ
- **Phương thức thanh toán**: {{ $order->payment_method }}
- **Địa chỉ giao hàng**: {{ $order->address ?? 'Không có thông tin' }}

@component('mail::button', ['url' => config('app.frontend_url') . '/my-order-detail/' . $order->id])
Xem chi tiết đơn hàng
@endcomponent

Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua email {{ config('mail.from.address') }}.

Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!

Trân trọng,  
**{{ config('app.name') }}**
@endcomponent






{{-- 




@component('mail::message')
# Đơn hàng của bạn đã giao hàng thành công! 🎉

Chào bạn,

Chúng tôi rất vui thông báo rằng đơn hàng **#{{ $order->id }}** của bạn đã được giao thành công vào ngày **{{ $order->updated_at->format('d/m/Y H:i') }}**. Cảm ơn bạn đã tin tưởng và mua sắm tại **{{ config('app.name') }}**!

## Chi tiết đơn hàng

@component('mail::panel')
- **Mã đơn hàng**: {{ $order->id }}  
- **Ngày giao hàng**: {{ $order->updated_at->format('d/m/Y H:i') }}  
- **Tổng tiền**: {{ number_format($order->total_amount, 0, ',', '.') }} VNĐ  
- **Phương thức thanh toán**: {{ $order->payment_method ?? 'Không xác định' }}  
- **Địa chỉ giao hàng**: {{ $order->address ?? 'Không có thông tin' }}
@endcomponent

## Danh sách sản phẩm

@component('mail::table')
| Sản phẩm                              | Số lượng | Giá mỗi sản phẩm        | Tổng cộng               |
|---------------------------------------|----------|-------------------------|-------------------------|
@foreach($order->items as $item)
| {{ $item->productVariant->product->name }} ({{ $item->productVariant->color->value ?? 'N/A' }}, {{ $item->productVariant->storage->value ?? 'N/A' }}) | {{ $item->quantity }} | {{ number_format($item->price, 0, ',', '.') }} VNĐ | {{ number_format($item->price * $item->quantity, 0, ',', '.') }} VNĐ |
@endforeach
@endcomponent

@component('mail::button', ['url' => url('/orders/' . $order->id), 'color' => 'success'])
Xem chi tiết đơn hàng
@endcomponent

## Cần hỗ trợ?  
Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, xin vui lòng liên hệ với chúng tôi qua email **[{{ config('mail.from.address') }}](mailto:{{ config('mail.from.address') }})** hoặc gọi đến số hotline của chúng tôi.

Cảm ơn bạn đã lựa chọn **{{ config('app.name') }}**! Chúng tôi hy vọng bạn hài lòng với sản phẩm và dịch vụ của chúng tôi.

Trân trọng,  
**Đội ngũ {{ config('app.name') }}**
@endcomponent --}}