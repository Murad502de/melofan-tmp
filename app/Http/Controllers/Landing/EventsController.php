<?php

namespace App\Http\Controllers\Landing;

use App\Http\Controllers\Controller;
use App\Rules\ReCaptchaRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class EventsController extends Controller
{
	public function setMailingUser(Request $request)
	{
		$this->validate($request, [
			"email" => "required|email",
			"language" => "required",
			"captcha" => ["required", new ReCaptchaRule($request->captcha)],
		]);

		$email = $request->json()->get("email");
		$language = $request->json()->get("language");

		$controllerUser = DB::table("users")
			->select(["language"])
			->where("email", $email)
			->first();
		if (!is_null($controllerUser)) {
			$language = $controllerUser->language;
		}

		if (
			DB::table("mailing_users")
				->where("email", $email)
				->exists()
		) {
			return response()->json(["success" => true]);
		} else {
			try {
				DB::beginTransaction();

				DB::table("mailing_users")->insert([
					"email" => $email,
					"isActive" => true,
					"language" => $language,
					"created_at" => date("Y-m-d H:i:s"),
				]);

				DB::commit();
				return response()->json(["success" => true]);
			} catch (\Throwable $exception) {
				DB::rollBack();
				Log::error($exception);
				return response()->json(["success" => false]);
			}
		}
	}

	public function getListEvents(Request $request)
	{
		$language = $request->json()->get("language");
		$resultEvents = [];

		$collectionEvents = DB::table("events")
			->select(["id", "title", "body", "created_at"])
			->where("language", $language)
			->orderBy("created_at", "desc")
			->get();

		foreach ($collectionEvents as $event) {
			$collectionImageEvents = DB::table("event_files")
				->select(["id", "name", "path", "format", "size"])
				->where("event_id", $event->id)
				->get();
			$arrayImage = [];
			foreach ($collectionImageEvents as $imageEvent) {
				$arrayImage[] = [
					"name" => $imageEvent->name,
					"path" => Storage::url($imageEvent->path),
					"format" => $imageEvent->format,
					"size" => $imageEvent->size,
				];
			}

			$resultEvents[] = [
				"id" => $event->id,
				"title" => $event->title,
				"body" => $event->body,
				"created_at" => $event->created_at,
				"images" => $arrayImage,
			];
		}

		return response()->json([
			"success" => true,
			"arrayEvents" => $resultEvents,
		]);
	}
}
