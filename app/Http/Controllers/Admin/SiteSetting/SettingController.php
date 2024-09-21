<?php

namespace App\Http\Controllers\Admin\SiteSetting;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Setting\SettingResource;
use App\Models\Admin\SiteSetting\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all();

        return inertia("Admin/Setting/Index", [
            'success' => session('success'),
            'settings' => $settings,

        ]);
    }




    public function update(Request $request)
    {
        // Validate the image field (optional)
        $validated = $request->validate([
            'site_name' => 'required|string',
            'support_email' => 'required|email',
            'support_phone' => 'required|string',
            'image' => 'nullable|image',
        ]);

        // Check if a new image was uploaded
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Fetch the current logo from the database
            $currentLogo = Setting::where('name', 'company_logo')->value('value');

            // If there is an existing logo, delete it from storage
            if ($currentLogo) {
                // Get the storage path from the URL
                $currentLogoPath = str_replace('/storage/', '', $currentLogo);

                // Check if the file exists and delete it
                if (Storage::disk('public')->exists($currentLogoPath)) {
                    Storage::disk('public')->delete($currentLogoPath);
                }
            }

            // Process the new image
            $image = $request->file('image');

            // Define the path and store the image
            $path = 'settings/logo';
            $imageName = $image->getClientOriginalName();
            $imagePath = $image->storeAs($path, $imageName, 'public');

            // Store the image URL for further use
            $imageUrl = Storage::url($imagePath);

            // Update the logo setting in the database
            Setting::where('name', 'company_logo')->update(['value' => $imageUrl]);
        }

        // Process other settings
        Setting::where('name', 'site_name')->update(['value' => $validated['site_name']]);
        Setting::where('name', 'support_email')->update(['value' => $validated['support_email']]);
        Setting::where('name', 'support_phone')->update(['value' => $validated['support_phone']]);

        return back()->with('success', 'تم التعديل بنجاح!');
    }



}
