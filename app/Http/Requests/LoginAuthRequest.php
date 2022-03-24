<?php

namespace App\Http\Requests;

use App\Rules\ReCaptchaRule;
use Illuminate\Foundation\Http\FormRequest;

class LoginAuthRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			"email" => "required|email|max:255",
			"password" => "required|string",
			//"captcha" => ["required", new ReCaptchaRule()], // FIXME es muss immer auskommentiert werden bei der lokalen Entwicklung
		];
	}
}
