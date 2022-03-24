<?php

namespace App\Models;

use App\Traits\HasRolesAndPermissions;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements JWTSubject
{
	use Notifiable, HasRolesAndPermissions;

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->password = Hash::make($model->password);
        });
    }

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		"id",
		"email",
		"role_id",
		"google2fa_enable",
		"google2fa_secret",
		"google2fa_reset",
		"mentor",
		"lastName",
		"firstName",
		"language",
		"is_verified_email",
		"avatar",
		"password",
		"statusKYC",
		"stepKYC",
		"phone",
		"is_blocked",
		"is_blocked_payout",
		"ip_register",
		"created_at",
		"updated_at",
		"payeer",
		"country",
		"birthday",
		"city",
		"address",
		"is_accreditation",
		"nameTheme",
	];

	/**
	 * The attributes that should be hidden for arrays.
	 *
	 * @var array
	 */
	protected $hidden = ["password", "remember_token"];

	/**
	 * The attributes that should be cast to native types.
	 *
	 * @var array
	 */
	protected $casts = [
		"google2fa_enable" => "integer",
	];

    protected $with = ['documents'];

    protected $appends = ['document2', 'document'];

	/**
	 * Get the identifier that will be stored in the subject claim of the JWT.
	 *
	 * @return mixed
	 */
	public function getJWTIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Return a key value array, containing any custom claims to be added to the JWT.
	 *
	 * @return array
	 */
	public function getJWTCustomClaims()
	{
		return [];
	}

	public function broker() {
	    return $this->belongsTo(User::class, 'mentor');
    }

    public function finances() {
	    return $this->hasMany(Finance::class);
    }

    public function getCreatedAtAttribute($attr) {
        return Carbon::parse($attr)->toDateTimeString();
    }

//    public function setPasswordAttribute($password){
//        $this->attributes['password'] = Hash::make($password);
//    }
    public function documents() {
        return $this->hasMany(PaymentDocument::class);
    }

    public function getDocument2Attribute() {
        return $this->documents()->orderByDesc('id')->first();
    }

    public function getDocumentAttribute() {
        return $this->documents()->orderBy('id')->first();
    }

    public function makeDocument($file) {
        return PaymentDocument::make($file, $this->id);
    }
}
