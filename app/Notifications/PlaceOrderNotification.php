<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PlaceOrderNotification extends Notification
{
    use Queueable;

    public $order;
    public $user;
    public $eventType;

    public function __construct($order, $user, $eventType)
    {
        $this->order = $order;
        $this->user = $user;
        $this->eventType = $eventType;

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        $locale = session('app_locale', 'en');
        $message = '';

        if ($this->eventType === 'added') {
            $message ="added";
        } elseif ($this->eventType === 'updated') {
            $message = "updated";
        }

        return [
            'message' => $message,
            'order_id' => $this->order->id,
            'customer_name' => $this->user->name,
            'event_type' => $this->eventType,
        ];
    }
}
