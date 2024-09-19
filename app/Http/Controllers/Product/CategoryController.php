<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCategoryResource;
use App\Models\Product\ProductCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = ProductCategory::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $productCategories = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Product/ProductCategory/Index", [
            "categories" => ProductCategoryResource::collection($productCategories),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Product/ProductCategory/Create",);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:product_categories,name'],
            'is_active'=>['required','boolean'],
        ]);

        $category= ProductCategory::create($data);


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم إنشاء الصنف \"{$category->name}\" بنجاح"
            : "Category \"{$category->name}\" was created successfully";

        return to_route('category.index')
            ->with('success', $message);

    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $category)
    {
        $hasSubCategories = $category->subCategories()->exists(); // Check if the category has subcategories

        return inertia('Product/ProductCategory/Edit', [
            'category' => new ProductCategoryResource($category),
            'hasSubCategories' => $hasSubCategories,

        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, ProductCategory $category)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('product_categories')->ignore($category->id, 'id')],
            'is_active' => ['required', 'boolean'],
        ];

        $data = $request->validate($rules);

        // Check if the category has subcategories
        $hasSubCategories = $category->subCategories()->exists();

        // If the category has subcategories and the is_active field is being set to false
        if ($hasSubCategories && $data['is_active'] == false) {
            // Create a validator instance to add a custom validation message
            $validator = Validator::make($request->all(), $rules);

            $locale = session('app_locale', 'en');
            $message = "Cannot deactivate the category because it has subcategories";

            // Add custom validation error to the validator
            $validator->after(function ($validator) use ($message) {
                $validator->errors()->add('is_active', $message);
            });

            // If the validator fails, redirect back with errors
            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }
        }

        // Update the category if no validation errors occur
        $category->update($data);

        // Prepare success message
        $locale = session('app_locale', 'en');
        $message = $locale === 'ar'
            ? "تم تحديث الصنف \"{$category->name}\" بنجاح"
            : "Category \"{$category->name}\" was updated successfully";

        return to_route('category.index')
            ->with('success', $message);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $category)
    {

        $name = $category->name;
        if ($category->subCategories()->count() > 0) {
        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "لا يمكن حذف الصنف \"{$name}\" لأنها تحتوي على فئات فرعية"
            : "Cannot delete category \"{$name}\" because it has subcategories";

        return to_route('category.index')
            ->with('danger', $message);
        }
        $category->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف الصنف \"{$name}\" بنجاح"
            : "Category \"{$name}\" was deleted successfully";

        return to_route('category.index')
            ->with('success', $message);

    }
}
