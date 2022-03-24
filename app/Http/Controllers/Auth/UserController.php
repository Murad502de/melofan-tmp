<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Rules\ReCaptchaRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class UserController extends Controller
{
	public function getAuthUser(Request $request): \Illuminate\Http\JsonResponse
	{
		return response()->json(["success" => true, "user" => self::getAllDataUser(auth()->user())]);
	}

	public static function getAllDataUser($user): array
	{
		$dataUser["id"] = $user->id;
		$dataUser["lastName"] = $user->lastName;
		$dataUser["firstName"] = $user->firstName;
		$dataUser["avatar"] = $user->avatar;
		$dataUser["email"] = $user->email;
		$dataUser["role_id"] = $user->role_id;
		$dataUser["statusKYC"] = $user->stepKYC == 0 ? $user->statusKYC : 0;
		$dataUser["payeer"] = $user->payeer;
		$collectionFinance = DB::table("finance")
			->select(["balance"])
			->where([["user_id", $dataUser["id"]], ["currency", "USD"]])
			->first();
		$dataUser["balanceUSD"] = $collectionFinance->balance;
		$collectionFinance = DB::table("finance")
			->select(["balance"])
			->where([["user_id", $dataUser["id"]], ["currency", "HBM"]])
			->first();
		$dataUser["balanceMLFN"] = $collectionFinance->balance;

		return $dataUser;
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getDataForSettings(Request $request): \Illuminate\Http\JsonResponse
	{
		$user = auth()->user();

		$dataUser["id"] = $user->id;
		$dataUser["lastName"] = $user->lastName;
		$dataUser["firstName"] = $user->firstName;
		$dataUser["avatar"] = $user->avatar;
		$dataUser["email"] = $user->email;
		$dataUser["phone"] = $user->phone;
		$dataUser["birthday"] = $user->birthday;

		$collectionData = DB::table("countries")
			->select(["country as name"])
			->where("iso", $user->country)
			->first();
		if (is_null($collectionData)) {
			return response()->json(["success" => false], 401);
		}
		$dataUser["country"] = $collectionData->name;

		$collectionData = DB::table("cities")
			->select(["city as name"])
			->where("id", $user->city)
			->first();

		if (is_null($collectionData)) {
			return response()->json(["success" => false], 401);
		}
		$dataUser["city"] = $collectionData->name;

		$dataUser["address"] = $user->address;
		$dataUser["payeer"] = $user->payeer;

		$dataUser["is2faEnable"] = $user->google2fa_enable;
		$dataUser["mentor"] = $user->broker->only('id', 'firstName', 'lastName', 'email', 'phone');
		$dataUser["referral"] = url("?ref={$user->id}");

		return response()->json([
			"success" => true,
			"user" => $dataUser,
		]);
	}

	public function editAvatar(Request $request): \Illuminate\Http\JsonResponse
	{
		$dataField = $request->json()->get("avatar");
		$this->validate($request, [
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		$user = auth()->user();
		if (!$dataField) {
			$dataField = self::generateAvatar($user->firstName, $user->lastName);
		}
		$user->update(["avatar" => $dataField]);
		return response()->json([
			"success" => true,
			"avatar" => $dataField,
		]);
	}

	public function editPassword(Request $request): \Illuminate\Http\JsonResponse
	{
		$user = auth()->user();
		$oldPassword = $request->json()->get("old_password");
		$newPassword = $request->json()->get("password");
		$isTrueOldPassword = Hash::check($oldPassword, $user->password);

		if ($isTrueOldPassword) {
			$this->validate($request, [
				"password" =>
					'required|string|min:8|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/',
				"captcha" => ["required", new ReCaptchaRule($request->captcha)],
			]);
			$newPassword = Hash::make($newPassword);
			$user->update(["password" => $newPassword]);
			return response()->json(["success" => true]);
		} else {
			return response()->json(["success" => false, "error" => 1]);
		}
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function editCash(Request $request)
	{
		$user = auth()->user();
		$dataField = $request->json()->get("data");
		$this->validate($request, [
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		if ($user->payeer == null && !empty($dataField["payeer"]) && $dataField["payeer"] != "P") {
			$user->update(["payeer" => $dataField["payeer"]]);
		}

		$dataCash = [
			"payeer" => $user->payeer,
		];

		return response()->json([
			"success" => true,
			"dataCash" => $dataCash,
		]);
	}

	public function changeLanguage(Request $request): \Illuminate\Http\JsonResponse
	{
		$language = $request->json()->get("language");
		$user = auth()->user();
		if (is_null($user)) {
			return response()->json(["success" => false]);
		}

		DB::table("users")
			->where("id", $user->id)
			->update([
				"language" => $language,
			]);

		return response()->json(["success" => true]);
	}

	public function getTheme(Request $request): \Illuminate\Http\JsonResponse
	{
		return response()->json(["success" => true, "name" => auth()->user()->nameTheme]);
	}

	public function setTheme(Request $request): \Illuminate\Http\JsonResponse
	{
		$name = $request->json()->get("nameTheme");
		$user = auth()->user();
		if ($name != "" && $name != "dark") {
			return response()->json(["success" => false]);
		}

		DB::table("users")
			->where("id", $user->id)
			->update([
				"nameTheme" => $name,
			]);

		return response()->json(["success" => true]);
	}

	public static function generateAvatar($firstName, $lastName)
	{
		$arrayColors = [
			[249, 136, 102],
			[255, 66, 14],
			[128, 189, 158],
			[144, 175, 197],
			[51, 107, 135],
			[42, 49, 50],
			[118, 54, 38],
			[70, 33, 26],
			[105, 61, 61],
			[186, 85, 54],
			[164, 56, 32],
			[80, 81, 96],
			[104, 130, 158],
			[174, 189, 56],
			[89, 130, 52],
			[0, 59, 70],
			[7, 87, 91],
			[102, 165, 173],
			[46, 70, 0],
			[72, 107, 0],
			[162, 197, 35],
			[125, 68, 39],
			[2, 28, 30],
			[0, 68, 69],
			[44, 120, 115],
			[111, 185, 143],
			[55, 94, 151],
			[251, 101, 66],
			[63, 104, 28],
			[152, 219, 198],
			[91, 200, 172],
			[241, 141, 158],
			[50, 72, 81],
			[134, 172, 65],
			[52, 103, 92],
			[125, 163, 161],
			[76, 181, 245],
			[52, 103, 92],
			[222, 122, 34],
			[32, 148, 139],
			[106, 177, 135],
			[141, 35, 15],
			[30, 67, 76],
			[155, 79, 15],
			[201, 158, 16],
			[25, 149, 173],
			[154, 158, 171],
			[93, 83, 94],
			[6, 56, 82],
			[240, 129, 15],
			[54, 50, 55],
			[46, 35, 0],
			[110, 103, 2],
			[192, 88, 5],
			[219, 149, 1],
			[80, 49, 47],
			[203, 0, 0],
			[228, 234, 140],
			[63, 108, 69],
			[52, 136, 140],
			[203, 99, 24],
			[92, 130, 26],
			[0, 41, 60],
			[30, 101, 109],
			[98, 109, 113],
			[179, 136, 103],
			[37, 128, 57],
			[49, 169, 184],
			[207, 55, 33],
			[238, 105, 63],
			[246, 148, 84],
			[115, 159, 61],
			[40, 54, 85],
			[77, 100, 141],
			[247, 0, 37],
			[242, 92, 0],
			[249, 166, 3],
			[237, 87, 82],
			[72, 151, 216],
			[250, 110, 89],
			[248, 160, 85],
			[175, 68, 37],
			[102, 46, 28],
			[201, 166, 107],
			[76, 63, 84],
			[209, 53, 37],
			[242, 192, 87],
			[72, 104, 36],
			[250, 175, 8],
			[250, 129, 47],
			[250, 64, 50],
			[231, 63, 11],
			[161, 31, 12],
			[134, 118, 102],
			[48, 27, 40],
			[82, 54, 52],
			[182, 69, 44],
			[86, 62, 32],
			[75, 67, 69],
			[85, 109, 172],
			[117, 82, 72],
			[216, 65, 47],
			[41, 136, 188],
			[47, 73, 110],
			[80, 8, 5],
			[157, 51, 31],
			[249, 186, 50],
			[66, 110, 134],
			[47, 49, 49],
			[4, 32, 44],
			[48, 64, 64],
			[91, 112, 101],
		];

		$name = strtoupper(mb_substr($firstName, 0, 1) . mb_substr($lastName, 0, 1));
		// наше изображение
		$img = imagecreate(256, 256);
		$center = 128;
		$fontSize = 80;
		// указываем путь к шрифту
		$font = "../app/Http/Controllers/Auth/HarmoniaSansProCyr-Bold.otf";
		// определяем цвет, в RGB
		$indexColorArray = rand(0, count($arrayColors) - 1);
		$color_background = imagecolorallocate(
			$img,
			$arrayColors[$indexColorArray][0],
			$arrayColors[$indexColorArray][1],
			$arrayColors[$indexColorArray][2],
		);
		$color_text = imagecolorallocate($img, 255, 255, 255);

		imagefilledellipse($img, 128, 128, 256, 256, $color_background);
		$box = imagettfbbox($fontSize, 0, $font, $name);
		$x = $center - ($box[2] - $box[0]) / 2;
		$y = $center - ($box[7] - $box[1]) / 2;
		imagettftext($img, $fontSize, 0, $x, $y, $color_text, $font, $name);

		ob_start();
		imagepng($img);
		$contents = ob_get_contents();
		ob_end_clean();

		return "data:image/png;base64," . base64_encode($contents);
	}
}
