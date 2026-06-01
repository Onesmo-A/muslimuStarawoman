<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AwardCategory extends Model
{
    /** @use HasFactory<\Database\Factories\AwardCategoryFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'eligibility_rules' => 'array',
        ];
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(AwardSeason::class, 'award_season_id');
    }

    public function pricing(): HasOne
    {
        return $this->hasOne(CategoryPricing::class);
    }

    public function nominations(): HasMany
    {
        return $this->hasMany(Nomination::class);
    }

    public function nominees(): HasMany
    {
        return $this->hasMany(Nominee::class);
    }
}



