<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPasswordNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Config;

class ResetPasswordNotification extends BaseResetPasswordNotification
{
    public function toMail($notifiable)
    {
        // Sử dụng `config('app.frontend_url')` để đảm bảo lấy đúng URL
        $resetUrl = rtrim(config('app.frontend_url'), '/') . "/reset-password?token=" . $this->token;

        return (new MailMessage)
            ->subject('Đặt lại mật khẩu')
            ->line('Bạn nhận được email này vì chúng tôi nhận được yêu cầu đặt lại mật khẩu.')
            ->action('Đặt lại mật khẩu', $resetUrl)
            ->line('Nếu bạn không yêu cầu đặt lại mật khẩu, bạn có thể bỏ qua email này.');
    }
}

