<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AwardSeason extends Model
{
    /** @use HasFactory<\Database\Factories\AwardSeasonFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function categories(): HasMany
    {
        return $this->hasMany(AwardCategory::class);
    }
}



