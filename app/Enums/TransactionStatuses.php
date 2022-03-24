<?php

namespace App\Enums;

class TransactionStatuses
{
    const PENDING = 'pending';
    const SUCCESS = 'success';
    const REFUSE = 'refuse';

    const STATUSES = [
        self::PENDING,
        self::SUCCESS,
        self::REFUSE,
    ];
}
