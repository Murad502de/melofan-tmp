<?php

namespace App\Http\Requests;

use App\Rules\ReCaptchaRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterAuthRequest extends FormRequest
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
			"lastName" => "required|string|min:2|max:255",
			"firstName" => "required|string|min:2|max:255",
			"email" => "required|email|max:255|unique:users",
			"phone" => "required|numeric|unique:users",
			"password" =>
				'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/',
			"captcha" => ["required", new ReCaptchaRule()],
		];
	}
}
