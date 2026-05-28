<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SponsorOrder extends Model
{
    /** @use HasFactory<\Database\Factories\SponsorOrderFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];
}



