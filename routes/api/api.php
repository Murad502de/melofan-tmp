<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post("signup", [\App\Http\Controllers\Auth\RegisterController::class, "register"]);
Route::post("getMentor", [\App\Http\Controllers\Auth\RegisterController::class, "getMentor"]);
Route::post("signin", [\App\Http\Controllers\Auth\LoginController::class, "login"]);
Route::post("resetPassword", [\App\Http\Controllers\Auth\ResetPasswordController::class, "resetPassword"]);
Route::post("sendForResetPassword", [
	\App\Http\Controllers\Auth\ResetPasswordController::class,
	"sendForResetPassword",
]);
Route::post("verify", [\App\Http\Controllers\Auth\VerifyUserController::class, "verifyUser"]);
Route::post("changeLanguage", [\App\Http\Controllers\Auth\UserController::class, "changeLanguage"]);

Route::post("sendMessageSupport", [\App\Http\Controllers\Landing\SupportController::class, "sendMessageSupport"]);
Route::post("sendConnectionSupport", [\App\Http\Controllers\Landing\SupportController::class, "sendConnectionSupport"]);

Route::post("getNews", [\App\Http\Controllers\Landing\NewsController::class, "getNews"]);
Route::post("getOneNews", [\App\Http\Controllers\Landing\NewsController::class, "getOneNews"]);
Route::post("getCountNews", [\App\Http\Controllers\Landing\NewsController::class, "getCountNews"]);

Route::post("getArticles", [\App\Http\Controllers\Landing\ArticlesController::class, "getArticles"]);
Route::post("getActualArticles", [\App\Http\Controllers\Landing\ArticlesController::class, "getActualArticles"]);
Route::post("getOneArticles", [\App\Http\Controllers\Landing\ArticlesController::class, "getOneArticles"]);
Route::post("getCountArticles", [\App\Http\Controllers\Landing\ArticlesController::class, "getCountArticles"]);

Route::post("getListDocuments", [\App\Http\Controllers\Landing\DocumentsController::class, "getListDocuments"]);

Route::post("setMailingUser", [\App\Http\Controllers\Landing\EventsController::class, "setMailingUser"]);
Route::post("getListEvents", [\App\Http\Controllers\Landing\EventsController::class, "getListEvents"]);

Route::post("getRoadmap", [\App\Http\Controllers\Landing\RoadmapController::class, "getRoadmap"]);

Route::group(["middleware" => ["auth.jwt"]], function () {
	Route::group(["middleware" => "role:user,broker"], function () {
		Route::post("getCountries", [\App\Http\Controllers\Auth\VerifyUserController::class, "getCountries"]);
		Route::post("getRegions", [\App\Http\Controllers\Auth\VerifyUserController::class, "getRegions"]);
		Route::post("getCities", [\App\Http\Controllers\Auth\VerifyUserController::class, "getCities"]);
		Route::post("getStepKYC", [\App\Http\Controllers\Auth\VerifyUserController::class, "getStepKYC"]);
		Route::post("savePersonalData", [\App\Http\Controllers\Auth\VerifyUserController::class, "savePersonalData"]);
		Route::post("setDataAccreditation", [
			\App\Http\Controllers\Auth\VerifyUserController::class,
			"setDataAccreditation",
		]);
		Route::post("onFinishVerify", [\App\Http\Controllers\Auth\VerifyUserController::class, "onFinishVerify"]);

		Route::post("profile", [\App\Http\Controllers\Auth\UserController::class, "getAuthUser"]);
		Route::post("setTheme", [\App\Http\Controllers\Auth\UserController::class, "setTheme"]);
		Route::post("getTheme", [\App\Http\Controllers\Auth\UserController::class, "getTheme"]);
		Route::post("signout", [\App\Http\Controllers\Auth\LogoutController::class, "logout"]);

		Route::post("getAll-pendingTickets", [\App\Http\Controllers\Cabinet\TicketsController::class, "getAllTickets"]);
		Route::post("getAll-endTickets", [\App\Http\Controllers\Cabinet\TicketsController::class, "getAllTickets"]);
		Route::post("getAll-allTickets", [\App\Http\Controllers\Cabinet\TicketsController::class, "getAllTickets"]);
		Route::post("getIsOpenTicket", [\App\Http\Controllers\Cabinet\TicketsController::class, "getIsOpenTicket"]);
		Route::post("getOneTickets", [\App\Http\Controllers\Cabinet\TicketsController::class, "getOneTickets"]);
		Route::post("openTicket", [\App\Http\Controllers\Cabinet\TicketsController::class, "openTicket"]);
		Route::post("sendMessageTicket", [\App\Http\Controllers\Cabinet\TicketsController::class, "sendMessageTicket"]);
		Route::get("my-partners/first", [\App\Http\Controllers\Cabinet\PartnersController::class, "getFirstLine"]);
		Route::get("my-partners/second", [\App\Http\Controllers\Cabinet\PartnersController::class, "getSecondLine"]);
	});

	Route::group(["middleware" => ["role:user,broker", "verify.country"]], function () {
		Route::post("2fa", [\App\Http\Controllers\Auth\PasswordSecurityController::class, "init2FA"]);
		Route::post("reset2fa", [\App\Http\Controllers\Auth\PasswordSecurityController::class, "saveReset2FA"]);
		Route::post("verify2fa", [\App\Http\Controllers\Auth\PasswordSecurityController::class, "verify2FA"]);
		Route::post("sendVerifyCodeEmail2fa", [
			\App\Http\Controllers\Auth\PasswordSecurityController::class,
			"sendVerifyCodeEmail",
		]);
		Route::post("enable2fa", [\App\Http\Controllers\Auth\PasswordSecurityController::class, "enable2FA"]);
		Route::post("disable2fa", [\App\Http\Controllers\Auth\PasswordSecurityController::class, "disable2FA"]);

		Route::post("getDataForSettings", [\App\Http\Controllers\Auth\UserController::class, "getDataForSettings"]);
		Route::post("editCash", [\App\Http\Controllers\Auth\UserController::class, "editCash"]);
		Route::post("editAvatar", [\App\Http\Controllers\Auth\UserController::class, "editAvatar"]);
		Route::post("editPassword", [\App\Http\Controllers\Auth\UserController::class, "editPassword"]);

		Route::post("getAll-notification", [
			\App\Http\Controllers\Cabinet\NotificationController::class,
			"getAllNotification",
		]);
		Route::post("getTodayNotification", [
			\App\Http\Controllers\Cabinet\NotificationController::class,
			"getTodayNotification",
		]);

		Route::get("transactions", [\App\Http\Controllers\Cabinet\TransactionController::class, "index"]);
		Route::get("finances", [\App\Http\Controllers\Cabinet\FinancesController::class, "show"]);

		Route::post("getDataSecurities", [\App\Http\Controllers\Cabinet\SecuritiesController::class, "getData"]);
		Route::post("onBuySecurities", [\App\Http\Controllers\Cabinet\SecuritiesController::class, "onBuy"]);
	});
});
