<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketOrder extends Model
{
    /** @use HasFactory<\Database\Factories\TicketOrderFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}



