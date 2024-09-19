<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\UploadedFile;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }
            $customerData = $request->only(['phone', 'address']);

            $request->user()->save();

             if ($request->user()->hasRole('customer')) { 
                $customerData = $request->only(['phone', 'address']);
                $request->user()->customer()->update($customerData);
            }

        return Redirect::route('profile.edit');
    }

    public function updateProfileImage(Request $request)
    {
        $data = $request->validate([
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        if($data['photo'] === null) {
            return Redirect::route('profile.edit');
        }
        $user = auth()->user();
        $newImage = $request->file('photo');

        if ($newImage) {
            // Save the new image
            $relativePath = $this->saveImage($newImage, $user->id);
            $imageUrl = URL::to(Storage::url($relativePath));
            // Delete the old image if it exists
            if ($user->profile_photo_url) {
                $this->deleteOldImage($user->profile_photo_url);
            }

            // Update the user's profile photo URL
            $user->profile_photo_url = $imageUrl;
        }

        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Save the uploaded image to storage.
     */
    private function saveImage(UploadedFile $image, $userId)
    {
        $path = 'profile_images/' . $userId;
        Storage::makeDirectory($path, 0755, true);

        Storage::putFileAs('public/' . $path, $image, $image->getClientOriginalName());

        return $path . '/' . $image->getClientOriginalName();
    }

    /**
     * Delete the old image from storage.
     */
    private function deleteOldImage($imageUrl)
    {
        if ($imageUrl) {
            $relativePath = str_replace('/storage', '', parse_url($imageUrl, PHP_URL_PATH));

            Storage::disk('public')->delete($relativePath);

            $directoryPath = dirname($relativePath);

            if (count(Storage::disk('public')->files($directoryPath)) === 0) {
                Storage::disk('public')->deleteDirectory($directoryPath);
            }
        }
    }
    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
