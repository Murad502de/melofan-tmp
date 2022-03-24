<?php

use Illuminate\Support\Facades\Route;

Route::view("/signin", "root");
Route::view("/open", "root");
Route::view("/reset", "root");
Route::view("/reset{code}", "root");
Route::view("/dashboard", "root");
Route::view("/settings", "root");

Route::view("/users", "root");
Route::view("/edit-users{id}", "root");
Route::view("/edit-users", "root");
Route::view("/edit-operators", "root");
Route::view("/edit-operators{id}", "root");

Route::view("/verify", "root");
Route::view("/edit-verify{id}", "root");

Route::view("/payments", "root");

Route::view("/payouts", "root");
Route::view("/edit-openPayouts{id}", "root");

Route::view("/news", "root");
Route::view("/edit-news", "root");
Route::view("/edit-news{id}", "root");

Route::view("/articles", "root");
Route::view("/edit-articles", "root");
Route::view("/edit-articles{id}", "root");

Route::view("/documents", "root");
Route::view("/edit-documents", "root");
Route::view("/edit-documents{id}", "root");

Route::view("/events", "root");
Route::view("/edit-events", "root");
Route::view("/edit-events{id}", "root");

Route::view("/roadmap", "root");
Route::view("/edit-roadmap", "root");
Route::view("/edit-roadmap{id}", "root");

Route::view("/securities", "root");
Route::view("/edit-securities", "root");
Route::view("/edit-securities{id}", "root");

Route::view("/tickets", "root");
Route::view("/edit-workTickets{id}", "root");
Route::view("/edit-closeTickets{id}", "root");
