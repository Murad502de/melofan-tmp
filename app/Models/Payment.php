<?php

namespace App\Models;

use App\Enums\TransactionStatuses;
use App\Traits\Transactionable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use Transactionable;

    const TYPE = 'payment';

    protected $fillable = [
        'user_id', 'amount', 'currency', 'system', 'system_id', 'transaction_number', 'wallet_number'
    ];

    protected $dates = [
      'created_at',
      'updated_at'
    ];

    protected $appends = ['type'];

    public $timestamps = true;


}
