<?php

namespace App\Http\Controllers\Root;

use App\Events\Notifications\SendAllUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
	private static $idSectionFiles = "other";
	private static $typeFiles = ["png", "jpe", "jpeg", "jpg", "gif", "bmp", "ico", "tiff", "tif", "svg", "svgz"];

	public function getDataDashboard(Request $request): \Illuminate\Http\JsonResponse
	{
		return response()->json([
			"success" => true,
		]);
	}

	public function getDataSettings(Request $request): \Illuminate\Http\JsonResponse
	{
		return response()->json([
			"success" => true,
			"enable2fa" => auth()->user()->google2fa_enable,
		]);
	}

	public function sendMessageAllUsers(Request $request): \Illuminate\Http\JsonResponse
	{
		$message = $request->json()->get("message");

		if (!empty($message)) {
			$today = date("Y-m-d H:i:s");
			$messageId = DB::table("message_for_user")->insertGetId([
				"user_id" => 0,
				"view_users" => ".",
				"message" => $message,
				"created_at" => $today,
			]);

			SendAllUser::dispatch([
				"id" => $messageId,
				"message" => $message,
				"date" => $today,
				"isRead" => false,
			]);

			return response()->json(["success" => true]);
		}
		return response()->json(["success" => false]);
	}

	public function saveFileForText(Request $request): \Illuminate\Http\JsonResponse
	{
		$files = $request->files;
		$today = date("Y-m-d H:i:s");

		$result = [];
		foreach ($files as $file) {
			// Создадим ресурс FileInfo
			$fi = finfo_open(FILEINFO_MIME_TYPE);
			// Получим MIME-тип
			$mime = (string) finfo_file($fi, $file);
			// Проверим ключевое слово image (image/jpeg, image/png и т. д.)
			if (
				strpos($mime, "image") === false &&
				strpos($mime, "video") === false &&
				strpos($mime, "audio") === false
			) {
				return response()->json(["errorMessage" => "insert error message"]);
			}

			do {
				$fileName = Str::random(30); //Generate verification code
				$collectionVerify = DB::table("all_files")
					->select(["id"])
					->where([["name", $fileName], ["parent", self::$idSectionFiles]])
					->first();
			} while (!is_null($collectionVerify));
			$ext = $file->getClientOriginalExtension();
			$fileName = $fileName . "." . $ext;

			try {
				DB::transaction(function () use ($fileName, $ext, $today) {
					DB::table("all_files")->insert([
						"name" => $fileName,
						"format" => $ext,
						"path" => self::$idSectionFiles . "/" . $fileName,
						"language" => "en",
						"parent" => self::$idSectionFiles,
						"created_at" => $today,
					]);
				});
			} catch (\Throwable $e) {
				Log::error($e);
				return response()->json(["result" => $result]);
			}

			Storage::disk("public")->putFileAs("/" . self::$idSectionFiles . "/", $file, $fileName);

			$result[] = [
				"url" => Storage::url("other/" . $fileName),
				"name" => $fileName,
			];
		}

		return response()->json(["result" => $result]);
	}

	public function getGalleryFileForText(Request $request): \Illuminate\Http\JsonResponse
	{
		$files = Storage::disk("public")->files("/other");

		$result = [];
		foreach ($files as $file) {
			$result[] = [
				"src" => "/storage/" . $file,
			];
		}
		return response()->json(["result" => $result]);
	}

	public function othersAction(Request $request)
	{
	}
}
