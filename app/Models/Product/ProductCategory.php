<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    public $timestamps = false;

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class, 'category_id');
    }
}
