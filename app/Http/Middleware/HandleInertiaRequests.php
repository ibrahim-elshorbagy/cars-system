<?php

namespace App\Http\Middleware;

use App\Models\Admin\SiteSetting\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $websiteName = Setting::where('name', 'site_name')->value('value');
        $websiteLogo = Setting::where('name', 'company_logo')->value('value');
        $site_cover = Setting::where('name', 'site_cover')->value('value');
        $phone = Setting::where('name', 'support_phone')->value('value');
        $email = Setting::where('name', 'support_email')->value('value');
        return [
            ...parent::share($request),
            'auth' => [

                'user' => function() use ($request) {
                    $user = $request->user();
                    return $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'box_id'=> $user->accountant->box_id ?? null,
                        // 'phone' => $user->customer?->phone ?? null,
                        // 'address' => $user->customer?->address ?? null,
                        'roles' => $user->getRoleNames(),
                        'permissions' => $user->getAllPermissions()->pluck('name'),
                        'profile_photo_url'=> $user->profile_photo_url ?? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                        // 'notifications' => $user->unreadNotifications ?? [],

                    ] : null;
                },
                ],
            'site_settings' => [
                'websiteName' => $websiteName ,
                'websiteLogo' => $websiteLogo ,
                'site_cover' => $site_cover ,
                'phone' => $phone ,
                'email' => $email ,
            ],


        ];
    }
}
