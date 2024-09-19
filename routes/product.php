<?php


// use App\Http\Controllers\Product\ModelController;
use App\Http\Controllers\Product\CategoryController;
use App\Http\Controllers\Product\SubCategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



//--------------------------------------------------------------------------------------------- categories
Route::group(['middleware' => ['permission:create-main-category']], function () {
    Route::get('/product/category/create', [CategoryController::class, 'create'])->name('category.create');
    Route::post('/product/category', [CategoryController::class, 'store'])->name('category.store');
});

Route::group(['middleware' => ['permission:read-main-category']], function () {
    Route::get('/product/category', [CategoryController::class, 'index'])->name('category.index');
});

Route::group(['middleware' => ['permission:update-main-category']], function () {
    Route::get('/product/category/{category}/edit', [CategoryController::class, 'edit'])->name('category.edit');
    Route::put('/product/category/{category}', [CategoryController::class, 'update'])->name('category.update');
});

Route::group(['middleware' => ['permission:delete-main-category']], function () {
    Route::delete('/product/category/{category}', [CategoryController::class, 'destroy'])->name('category.destroy');
});

//--------------------------------------------------------------------------------------------- Sub categories
Route::group(['middleware' => ['permission:create-sub-category']], function () {
    Route::get('/product/subcategory/create', [SubCategoryController::class, 'create'])->name('subCategory.create');
    Route::post('/product/subcategory', [SubCategoryController::class, 'store'])->name('subCategory.store');
});

Route::group(['middleware' => ['permission:read-sub-category']], function () {
    Route::get('/product/subcategory', [SubCategoryController::class, 'index'])->name('subCategory.index');
});

Route::group(['middleware' => ['permission:update-sub-category']], function () {
    Route::get('/product/subcategory/{subcategory}/edit', [SubCategoryController::class, 'edit'])->name('subCategory.edit');
    Route::put('/product/subcategory/{subcategory}', [SubCategoryController::class, 'update'])->name('subCategory.update');
});

Route::group(['middleware' => ['permission:delete-sub-category']], function () {
    Route::delete('/product/subcategory/{subcategory}', [SubCategoryController::class, 'destroy'])->name('subCategory.destroy');
});
