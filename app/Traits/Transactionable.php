<?php

namespace App\Traits;

use App\Enums\TransactionStatuses;
use App\Models\User;
use Carbon\Carbon;

trait Transactionable
{
    public function getTypeAttribute() {
        return self::TYPE;
    }

    public function getStatusAttribute($value) {
        return TransactionStatuses::STATUSES[$value];
    }


    public function getCreatedAtAttribute ($value) {
        return Carbon::parse($value)->toDateTimeString();
    }

    public function user () {
        $this->belongsTo( User::class );
    }
}
