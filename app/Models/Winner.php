<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Winner extends Model
{
    /** @use HasFactory<\Database\Factories\WinnerFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function awardCategory(): BelongsTo
    {
        return $this->belongsTo(AwardCategory::class, 'award_category_id');
    }

    public function nominee(): BelongsTo
    {
        return $this->belongsTo(Nominee::class);
    }
}



