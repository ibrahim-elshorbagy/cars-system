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

            'settings' => $settings,

        ]);
    }




    public function update(Request $request)
    {
        // Validate the image fields (both logo and cover are optional)
        $validated = $request->validate([
            'site_name' => 'required|string',
            'support_email' => 'required|email',
            'support_phone' => 'required|string',
            'image' => 'nullable|image',
            'site_cover' => 'nullable|image',
        ]);

        // Handling logo (company_logo)
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Fetch the current logo from the database
            $currentLogo = Setting::where('name', 'company_logo')->value('value');

            // If there is an existing logo, delete it from storage
            if ($currentLogo) {
                $currentLogoPath = str_replace('/storage/', '', $currentLogo);
                if (Storage::disk('public')->exists($currentLogoPath)) {
                    Storage::disk('public')->delete($currentLogoPath);
                }
            }

            // Store the new logo
            $logo = $request->file('image');
            $path = 'settings/logo';
            $logoName = $logo->getClientOriginalName();
            $logoPath = $logo->storeAs($path, $logoName, 'public');
            $logoUrl = Storage::url($logoPath);

            // Update the logo setting in the database
            Setting::where('name', 'company_logo')->update(['value' => $logoUrl]);
        }

        // Handling site cover (site_cover)
        if ($request->hasFile('site_cover') && $request->file('site_cover')->isValid()) {
            // Fetch the current site cover from the database
            $currentCover = Setting::where('name', 'site_cover')->value('value');

            // If there is an existing cover, delete it from storage
            if ($currentCover) {
                $currentCoverPath = str_replace('/storage/', '', $currentCover);
                if (Storage::disk('public')->exists($currentCoverPath)) {
                    Storage::disk('public')->delete($currentCoverPath);
                }
            }

            // Store the new site cover
            $cover = $request->file('site_cover');
            $coverPath = 'settings/cover';
            $coverName = $cover->getClientOriginalName();
            $coverFullPath = $cover->storeAs($coverPath, $coverName, 'public');
            $coverUrl = Storage::url($coverFullPath);

            // Update the site cover setting in the database
            Setting::where('name', 'site_cover')->update(['value' => $coverUrl]);
        }

        // Update other settings
        Setting::where('name', 'site_name')->update(['value' => $validated['site_name']]);
        Setting::where('name', 'support_email')->update(['value' => $validated['support_email']]);
        Setting::where('name', 'support_phone')->update(['value' => $validated['support_phone']]);

        return back()->with('success', 'تم التعديل بنجاح!');
    }




}
