<?php

namespace App\Http\Middleware;

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
        return [
            ...parent::share($request),
            'auth' => [

                'user' => function() use ($request) {
                    $user = $request->user();
                    return $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->customer?->phone ?? null,
                        'address' => $user->customer?->address ?? null,
                        'roles' => $user->getRoleNames(),
                        'permissions' => $user->getAllPermissions()->pluck('name'),
                        'profile_photo_url'=> $user->profile_photo_url ?? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                        'notifications' => $user->unreadNotifications ?? [],

                    ] : null;
                },
                ],
        ];
    }
}
