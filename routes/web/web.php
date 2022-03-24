<?php

use Illuminate\Support\Facades\Route;

Route::view("/", "index");
Route::view("/about", "index");
Route::view("/board-of-directors", "index");
Route::view("/documents", "index");
Route::view("/events", "index");
Route::view("/news", "index");
Route::view("/news/{id}", "index");
Route::view("/articles", "index");
Route::view("/article/{id}", "index");
Route::view("/privacy-policy", "index");
Route::view("/terms-of-use", "index");
Route::view("/aml", "index");
Route::view("/contacts", "index");
Route::view("/unsubscribing", "index");
Route::view("/signin", "index");
Route::view("/verify/{code}", "index");
Route::view("/signup", "index");
Route::view("/recovery", "index");
Route::view("/recovery/{code}", "index");

Route::view("/cabinet/finance", "index");
Route::view("/cabinet/securities", "index");
Route::view("/cabinet/trade", "index");
Route::view("/cabinet/transaction-history", "index");
Route::view("/cabinet/partners", "index");
Route::view("/cabinet/verification", "index");
Route::view("/cabinet/faq", "index");
Route::view("/cabinet/settings", "index");
Route::view("/cabinet/support", "index");
Route::view("/cabinet/dialog-open/{id}", "index");
Route::view("/cabinet/notification", "index");

Route::view("/{url?}", "index", [], 404)->where("url", "(.*)");
