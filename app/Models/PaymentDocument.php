<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class PaymentDocument extends Model
{

    const PATH = 'users-documents';
    protected $table = 'currency_documents';
    protected $fillable = [
        'path',
        'name',
        'type',
        'user_id',
    ];

    public $timestamps = false;


    public static function make ( $file, $user_id ) {
        $filename = $file->getClientOriginalName();
        $format = $file->getClientOriginalExtension();
        $hashName = md5($filename . time()).'.'.$format;

        $path     = self::PATH . '/'.$user_id;

        $file->storeAs( $path, $hashName, ['disk' => 'public'] );

        return self::create( [
            'path' => $path.'/'.$hashName,
            'name' => $filename,
            'user_id' => $user_id
        ] );
    }

  /*  public static function boot () {
        parent::boot();

        self::creating( function ( $model ) {
            $model->path = self::PATH . '/' . $model->name;
        } );

        self::updating( function ( $model ) {
            $model->path = self::PATH$model->name;
        } );
    }*/
}
