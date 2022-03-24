<?php

namespace App\Repositories;

use App\Models\Payment;
use App\Models\Payout;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class TransactionsRepository
{
    const MODELS = [
        'payments' => Payment::class,
        'payouts'  => Payout::class,
    ];

    private $user;

    public function __construct ( User $user = null ) {
        $this->user = $user;
    }

//    public function getData ( $type, $period, $page ) {
//        $data = collect();
//
//      //  if ( $type === 'all' ) {
//        if ( $type === 'all' ) {
//            /**
//             * @var Model $model
//             */
//            foreach ( self::MODELS as $model ) {
//                $data = $data->merge($this->getDataForQuery($model, $period, $page));
//            }
//        } else {
//            if( isset(self::MODELS[$type])) {
//                $model  = self::MODELS[$type];
//                $data = $data->merge($this->getDataForQuery($model, $period, $page));
//            }
//        }
//
//        $data = $data->toArray();
//
//        usort($data, function ($a, $b) {
//            return $a['created_at'] < $b['created_at'];
//        });
//
//        return $data;
//    }

//    public function getDataForQuery ( $model, $period, $page ): array {
//        /** @var Builder $query */
//        $query = app( $model )->query();
//
//        if ( strpos( $period, '|' ) ) {
//            [ $start, $end ] = explode( '|', $period );
//
//            $query = $query
//                ->where( 'created_at', '>=', Carbon::parse( $start ) )
//                ->where( 'created_at', '<=', Carbon::parse( $end ) );
//        } else {
//            $query = $query->where( 'created_at', '>=', Carbon::now()->subDays( $period )->toDateTimeString() );
//        }
//
//        if ( $this->user ) {
//            $query = $query->where( 'user_id', $this->user->id );
//        }
//
//        return $query->orderByDesc( 'created_at' )->forPage( (int) $page, 5 )->get()->toArray();
//    }



    public function getData ( $type, $period, $page ) {
        if ( isset( self::MODELS[ $type ] ) ) {
            $model = self::MODELS[ $type ];
            /** @var Builder $query */
            $query = app( $model )->query();

            if ( strpos( $period, '|' ) ) {
                [ $start, $end ] = explode( '|', $period );

                $query = $query
                    ->where( 'created_at', '>=', Carbon::parse( $start ) )
                    ->where( 'created_at', '<=', Carbon::parse( $end ) );
            } else {
                $query = $query->where( 'created_at', '>=', Carbon::now()->subDays( $period )->toDateTimeString() );
            }

            if ( $this->user ) {
                $query = $query->where( 'user_id', $this->user->id );
            }

            return $query->paginate(10);
        }
    }

}
