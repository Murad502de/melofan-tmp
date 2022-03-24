<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get("/storage/news/{filename}", function ($filename) {
	$filename = str_replace("/", "", $filename);
	try {
		return Storage::disk("public")->get("/news/" . $filename);
	} catch (Throwable $e) {
		Log::error($e);
		return response($filename . " NOT FOUND", 404);
	}
});

Route::get("/storage/articles/{filename}", function ($filename) {
	$filename = str_replace("/", "", $filename);
	try {
		return Storage::disk("public")->get("/articles/" . $filename);
	} catch (Throwable $e) {
		Log::error($e);
		return response($filename . " NOT FOUND", 404);
	}
});

Route::get("/storage/other/{filename}", function ($filename) {
	$filename = str_replace("/", "", $filename);
	try {
		return Storage::disk("public")->get("/other/" . $filename);
	} catch (Throwable $e) {
		Log::error($e);
		return response($filename . " NOT FOUND", 404);
	}
});

Route::get("/storage/documents/{filename}", function ($filename) {
	$filename = str_replace("/", "", $filename);
	try {
		return Storage::disk("public")->get("/documents/" . $filename);
	} catch (Throwable $e) {
		Log::error($e);
		return response($filename . " NOT FOUND", 404);
	}
});

Route::get("/storage/tickets/{userId}/{filename}", function ($userId, $filename) {
	$filename = str_replace("/", "", $filename);

	$user = auth()->user();

	if (
		!$user ||
		($user->id != $userId &&
			!auth()
				->user()
				->hasRole("admin", "ticket_operator"))
	) {
		return response()->json(["success" => false], 401);
	}

	try {
		return Storage::disk("public")->get("/tickets/" . $userId . "/" . $filename);
	} catch (Throwable $e) {
		Log::error($e);
		return response($filename . " NOT FOUND", 404);
	}
});
