<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketScan extends Model
{
    /** @use HasFactory<\Database\Factories\TicketScanFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];
}



