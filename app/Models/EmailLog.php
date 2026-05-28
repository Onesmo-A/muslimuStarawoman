<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmailLog extends Model
{
    /** @use HasFactory<\Database\Factories\EmailLogFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];
}



