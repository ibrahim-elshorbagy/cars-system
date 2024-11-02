<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;
use App\Notifications\CustomResetPasswordNotification;
use App\Notifications\CustomResetPasswordAdminNotification;
use Illuminate\Support\Carbon;


use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */


    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'user_name' => 'required|string',
        ]);

        // Retrieve the user requesting the password reset
        $user = User::where('user_name', $request->user_name)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'user_name' => [trans('passwords.user')],
            ]);
        }


        // Check if the user has requested a reset recently
        $lastResetRequest = DB::table('password_reset_tokens')->where('email', $user->email)->first();

        if ($lastResetRequest) {
            $lastRequestTime = Carbon::parse($lastResetRequest->created_at);
            $nextAllowedRequestTime = $lastRequestTime->addMinutes(5);

            if ($nextAllowedRequestTime->isFuture()) {
                $remainingTime = $nextAllowedRequestTime->diffForHumans([
                    'parts' => 2,
                    'syntax' => Carbon::DIFF_RELATIVE_TO_NOW,
                ]);

                throw ValidationException::withMessages([
                    'user_name' => ["يجب عليك الانتظار {$remainingTime} قبل طلب استعادة كلمة المرور مرة أخرى."],
                ]);
            }
        }

        // Generate a password reset token
        $token = Str::random(60);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => bcrypt($token), 'created_at' => now()]
        );

        // Send email to the user with the reset link
        $user->notify(new CustomResetPasswordNotification($token, $user));

        // Retrieve the admin user
        $admin = User::find(1);
        if ($admin) {
            $admin->notify(new CustomResetPasswordAdminNotification($token, $user, $admin));
        }

        // Return a success response
        return back()->with('status', __('passwords.sent'));
    }



}
