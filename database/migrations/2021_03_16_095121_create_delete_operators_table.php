<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDeleteOperatorsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("delete_operators", function (Blueprint $table) {
			$table->bigIncrements("id");

			$table->string("lastName")->index();
			$table->string("firstName");
			$table->string("middleName")->nullable();
			$table->char("language", 5)->default("ru");

			$table->string("email")->unique();
			$table->boolean("is_verified_email")->default(false);
			$table->text("avatar")->nullable();
			$table->string("phone");
			$table->string("password");
			$table->boolean("google2fa_enable")->default(false);
			$table->string("google2fa_secret")->nullable();

			$table->boolean("is_blocked")->default(false);
			$table->boolean("is_blocked_payout")->default(false);

			$table->integer("role_id")->nullable();

			$table->text("remember_token")->nullable();
			$table->string("ip_register")->nullable();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("delete_operators");
	}
}
