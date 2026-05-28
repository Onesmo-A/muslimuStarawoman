<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MediaAsset extends Model
{
    /** @use HasFactory<\Database\Factories\MediaAssetFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];
}



