<?php

namespace App\Notifications;

use App\Models\Admin\SiteSetting\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;

class CustomResetPasswordNotification extends Notification
{
    use Queueable;

    protected $token;
    protected $user;
    /**
     * Create a new notification instance.
     */
    public function __construct($token , $user)
    {
        $this->token = $token;
        $this->user = $user;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = url(config('app.url') . route('password.reset', $this->token, false));

    // Retrieve website settings
        $websiteName = Setting::where('name', 'site_name')->value('value');
        $logoPath = Setting::where('name', 'company_logo')->value('value');
        $websiteLogo = url($logoPath);
        $phone = Setting::where('name', 'support_phone')->value('value');
        $email = Setting::where('name', 'support_email')->value('value');

        return (new MailMessage)
            ->subject('تغير كلمة المرور')
            ->view('emails.reset_password', [
                'url' => $url,
                'user' => $this->user,
                'websiteName' => $websiteName,
                'websiteLogo' => $websiteLogo,
                'phone' => $phone,
                'email' => $email,
            ]);
    }


}