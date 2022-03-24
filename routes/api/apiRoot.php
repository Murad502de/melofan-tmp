<?php

use Illuminate\Support\Facades\Route;

Route::post("loginRoot", [\App\Http\Controllers\AuthRoot\LoginController::class, "login"]);
Route::post("resetPassword", [\App\Http\Controllers\AuthRoot\RootController::class, "resetPassword"]);
Route::post("sendForResetPassword", [\App\Http\Controllers\AuthRoot\RootController::class, "sendForResetPassword"]);

Route::group(["middleware" => ["auth.jwt"]], function () {
	Route::group(["middleware" => "role:admin,ticket_operator,payout_operator,verify_operator"], function () {
		Route::post("checkAuthRoot", [\App\Http\Controllers\AuthRoot\RootController::class, "checkAuth"]);
		Route::post("editPassword", [\App\Http\Controllers\AuthRoot\RootController::class, "editPassword"]);
		Route::post("logoutRoot", [\App\Http\Controllers\AuthRoot\LogoutController::class, "logout"]);
	});

	//////////////////////////////////////////////////////////////////////////////////////////////
	/// Google two factor authentication
	Route::group(["middleware" => "role:admin,ticket_operator,payout_operator,verify_operator"], function () {
		//        Route::post('generate2fasecret', [\App\Http\Controllers\AuthRoot\PasswordSecurityController::class, 'generate2faSecretCode']);
		Route::post("2fa", [\App\Http\Controllers\AuthRoot\PasswordSecurityController::class, "init2FA"]);
		Route::post("enable2fa", [\App\Http\Controllers\AuthRoot\PasswordSecurityController::class, "enable2FA"]);
		Route::post("disable2fa", [\App\Http\Controllers\AuthRoot\PasswordSecurityController::class, "disable2FA"]);
		//        Route::post('get2fakey', [\App\Http\Controllers\AuthRoot\PasswordSecurityController::class, 'get2FASessionKey']);
		//        Route::post('gettwotactorinfo', [\App\Http\Controllers\AuthRoot\PasswordSecurityController::class, 'getTwoFactorInfo']);
		//        Route::post('verify2fa', [\App\Http\Controllers\AuthRoot\PasswordSecurityController::class, 'verify2FA']);
	});
	/////////////////////////////////////////////////////////////////////////////////////////////
	///
	//////////////////////////////////////////////////////////////////////////////////////////////
	/// Users BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("get-users", [\App\Http\Controllers\Root\UserController::class, "getUser"]);
		Route::post("getAll-users", [\App\Http\Controllers\Root\UserController::class, "getUsers"]);
		Route::post("edit-users", [\App\Http\Controllers\Root\UserController::class, "editUsers"]);
		Route::post("sendMessage-users", [\App\Http\Controllers\Root\UserController::class, "sendMessageUser"]);
	});
	/// Users END
	////////////////////////////////////////////////////////////////////////////////////////////
	///
	//////////////////////////////////////////////////////////////////////////////////////////////
	/// Verify BEGIN
	Route::group(["middleware" => "role:admin,verify_operator"], function () {
		Route::post("get-verify", [\App\Http\Controllers\Root\VerifyController::class, "getUser"]);
		Route::post("getAll-verify", [\App\Http\Controllers\Root\VerifyController::class, "getUsers"]);
		Route::post("apply-verify", [\App\Http\Controllers\Root\VerifyController::class, "applyVerify"]);
		Route::post("cancel-verify", [\App\Http\Controllers\Root\VerifyController::class, "cancelVerify"]);
	});
	/// Verify END
	////////////////////////////////////////////////////////////////////////////////////////////
	///
	//////////////////////////////////////////////////////////////////////////////////////////////
	/// Operators BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("get-operators", [\App\Http\Controllers\Root\OperatorController::class, "getUser"]);
		Route::post("getAll-operators", [\App\Http\Controllers\Root\OperatorController::class, "getUsers"]);
		Route::post("edit-operators", [\App\Http\Controllers\Root\OperatorController::class, "editUser"]);
		Route::post("add-operators", [\App\Http\Controllers\Root\OperatorController::class, "addUser"]);
		Route::post("destroy-operators", [\App\Http\Controllers\Root\OperatorController::class, "destroyUser"]);
	});

	Route::group(["middleware" => "role:admin"], function () {
		Route::apiResource("users",\App\Http\Controllers\Root\UserController::class)->only('store');
	});
	/// Operators END
	/////////////////////////////////////////////////////////////////////////////////////////////
	///
	///////////////////////////////////////////////////////////////////////////////////////////////
	/// Payments BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("getAll-payments", [\App\Http\Controllers\Root\PaymentsController::class, "getAllPayments"]);
	});
	/// Payments END
	///////////////////////////////////////////////////////////////////////////////////////////////
	///
	///////////////////////////////////////////////////////////////////////////////////////////////
	/// Payouts BEGIN
	Route::group(["middleware" => "role:admin,payout_operator"], function () {
		Route::post("get-payouts", [\App\Http\Controllers\Root\PayoutsController::class, "getPayouts"]);
		Route::post("getAll-openPayouts", [\App\Http\Controllers\Root\PayoutsController::class, "getAllOpenPayouts"]);
		Route::post("getAll-closePayouts", [\App\Http\Controllers\Root\PayoutsController::class, "getAllClosePayouts"]);
		Route::post("apply-payouts", [\App\Http\Controllers\Root\PayoutsController::class, "applyPayouts"]);
		Route::post("closing-payouts", [\App\Http\Controllers\Root\PayoutsController::class, "closingPayouts"]);
	});
	/// Payouts END
	///////////////////////////////////////////////////////////////////////////////////////////////
	///
	/// Dashboard BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("setValueSetting", [\App\Http\Controllers\Root\DashboardController::class, "setValueSetting"]);
		Route::post("othersAction", [\App\Http\Controllers\Root\DashboardController::class, "othersAction"]);
		Route::post("saveFileForText", [\App\Http\Controllers\Root\DashboardController::class, "saveFileForText"]);
		Route::get("getGalleryFileForText", [
			\App\Http\Controllers\Root\DashboardController::class,
			"getGalleryFileForText",
		]);
	});
	Route::group(["middleware" => "role:admin,ticket_operator,payout_operator,verify_operator"], function () {
		Route::post("getDataDashboard", [\App\Http\Controllers\Root\DashboardController::class, "getDataDashboard"]);
		Route::post("getDataSettings", [\App\Http\Controllers\Root\DashboardController::class, "getDataSettings"]);
	});
	Route::group(["middleware" => "role:admin,verify_operator"], function () {
		Route::post("sendMessageAllUsers", [
			\App\Http\Controllers\Root\DashboardController::class,
			"sendMessageAllUsers",
		]);
	});
	/// Dashboard END
	/////////////////////////////////////////////////////////////////////////////////////////////
	///
	//////////////////////////////////////////////////////////////////////////////////////////////
	/// News BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("get-news", [\App\Http\Controllers\Root\NewsController::class, "getNew"]);
		Route::post("getAll-news", [\App\Http\Controllers\Root\NewsController::class, "getNews"]);
		Route::post("changeLanguage-news", [\App\Http\Controllers\Root\NewsController::class, "changeLanguageNews"]);
		Route::post("destroy-news", [\App\Http\Controllers\Root\NewsController::class, "destroyNews"]);
		Route::post("create-news", [\App\Http\Controllers\Root\NewsController::class, "createNews"]);
		Route::post("edit-news", [\App\Http\Controllers\Root\NewsController::class, "editNews"]);
	});
	/// News END
	///////////////////////////////////////////////////////////////////////////////////////////////
	///
	//////////////////////////////////////////////////////////////////////////////////////////////
	/// News BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("get-articles", [\App\Http\Controllers\Root\ArticlesController::class, "getArticle"]);
		Route::post("getAll-articles", [\App\Http\Controllers\Root\ArticlesController::class, "getArticles"]);
		Route::post("changeLanguage-articles", [
			\App\Http\Controllers\Root\ArticlesController::class,
			"changeLanguageArticles",
		]);
		Route::post("destroy-articles", [\App\Http\Controllers\Root\ArticlesController::class, "destroyArticles"]);
		Route::post("create-articles", [\App\Http\Controllers\Root\ArticlesController::class, "createArticles"]);
		Route::post("edit-articles", [\App\Http\Controllers\Root\ArticlesController::class, "editArticles"]);
	});
	/// News END
	///////////////////////////////////////////////////////////////////////////////////////////////
	///
	//////////////////////////////////////////////////////////////////////////////////////////////
	/// Document BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("get-documents", [\App\Http\Controllers\Root\DocumentsController::class, "getDocuments"]);
		Route::post("getAll-documents", [\App\Http\Controllers\Root\DocumentsController::class, "getAllDocuments"]);
		Route::post("changeLanguage-documents", [
			\App\Http\Controllers\Root\DocumentsController::class,
			"changeLanguageDocuments",
		]);
		Route::post("destroy-documents", [\App\Http\Controllers\Root\DocumentsController::class, "destroyDocuments"]);
		Route::post("create-documents", [\App\Http\Controllers\Root\DocumentsController::class, "createDocuments"]);
		Route::post("edit-documents", [\App\Http\Controllers\Root\DocumentsController::class, "editDocuments"]);
	});
	/// Document END
	///////////////////////////////////////////////////////////////////////////////////////////////
	///
	//////////////////////////////////////////////////////////////////////////////////////////////
	/// Document BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("get-events", [\App\Http\Controllers\Root\EventsController::class, "getEvents"]);
		Route::post("getAll-events", [\App\Http\Controllers\Root\EventsController::class, "getAllEvents"]);
		Route::post("changeLanguage-events", [
			\App\Http\Controllers\Root\EventsController::class,
			"changeLanguageEvents",
		]);
		Route::post("destroy-events", [\App\Http\Controllers\Root\EventsController::class, "destroyEvents"]);
		Route::post("create-events", [\App\Http\Controllers\Root\EventsController::class, "createEvents"]);
		Route::post("edit-events", [\App\Http\Controllers\Root\EventsController::class, "editEvents"]);
	});
	/// Document END
	///////////////////////////////////////////////////////////////////////////////////////////////
	///
	//////////////////////////////////////////////////////////////////////////////////////////////
	/// Roadmap BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("get-roadmap", [\App\Http\Controllers\Root\RoadmapController::class, "getRoadmap"]);
		Route::post("getAll-roadmap", [\App\Http\Controllers\Root\RoadmapController::class, "getAllRoadmap"]);
		Route::post("changeLanguage-roadmap", [
			\App\Http\Controllers\Root\RoadmapController::class,
			"changeLanguageRoadmap",
		]);
		Route::post("destroy-roadmap", [\App\Http\Controllers\Root\RoadmapController::class, "destroyRoadmap"]);
		Route::post("create-roadmap", [\App\Http\Controllers\Root\RoadmapController::class, "createRoadmap"]);
		Route::post("edit-roadmap", [\App\Http\Controllers\Root\RoadmapController::class, "editRoadmap"]);
	});
	/// Roadmap END
	///////////////////////////////////////////////////////////////////////////////////////////////
	///
	//////////////////////////////////////////////////////////////////////////////////////////////
	/// Roadmap BEGIN
	Route::group(["middleware" => "role:admin"], function () {
		Route::post("get-securities", [\App\Http\Controllers\Root\SecuritiesController::class, "getSecurities"]);
		Route::post("getAll-securities", [\App\Http\Controllers\Root\SecuritiesController::class, "getAllSecurities"]);
		Route::post("destroy-securities", [
			\App\Http\Controllers\Root\SecuritiesController::class,
			"destroySecurities",
		]);
		Route::post("create-securities", [\App\Http\Controllers\Root\SecuritiesController::class, "createSecurities"]);
		Route::post("edit-securities", [\App\Http\Controllers\Root\SecuritiesController::class, "editSecurities"]);
	});
	/// Roadmap END
	///////////////////////////////////////////////////////////////////////////////////////////////
	///
	///////////////////////////////////////////////////////////////////////////////////////////////
	/// Tickets BEGIN
	Route::group(["middleware" => "role:admin,ticket_operator"], function () {
		Route::post("get-tickets", [\App\Http\Controllers\Root\TicketsController::class, "getTickets"]);
		Route::post("getAll-openTickets", [\App\Http\Controllers\Root\TicketsController::class, "getAllOpenTickets"]);
		Route::post("getAll-closeTickets", [\App\Http\Controllers\Root\TicketsController::class, "getAllCloseTickets"]);
		Route::post("getAll-workTickets", [\App\Http\Controllers\Root\TicketsController::class, "getAllWorkTickets"]);
		Route::post("apply-openTickets", [\App\Http\Controllers\Root\TicketsController::class, "applyTickets"]);
		Route::post("close-tickets", [\App\Http\Controllers\Root\TicketsController::class, "closeTickets"]);
		Route::post("send-tickets", [\App\Http\Controllers\Root\TicketsController::class, "sendTickets"]);
	});
	/// Tickets END
	///////////////////////////////////////////////////////////////////////////////////////////////
});
