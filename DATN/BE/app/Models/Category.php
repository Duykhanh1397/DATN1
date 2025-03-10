<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'id';
    protected $fillable = ['name', 'description', 'status'];

    public function products()
    {
        return $this->hasMany(Product::class, 'id');
    }
}