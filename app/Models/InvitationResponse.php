<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InvitationResponse extends Model
{
    /** @use HasFactory<\Database\Factories\InvitationResponseFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];
}



