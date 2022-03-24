<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("users", function (Blueprint $table) {
			$table->bigIncrements("id");

			$table->string("lastName")->index();
			$table->string("firstName");
			$table
				->bigInteger("mentor")
				->unsigned()
				->nullable();
			$table->char("language", 5)->default("en");

			$table
				->string("email")
				->unique()
				->index();
			$table->boolean("is_verified_email")->default(false);
			$table->string("phone");
			$table->string("password");
			$table->boolean("google2fa_enable")->default(false);
			$table->string("google2fa_secret")->nullable();
			$table->string("google2fa_reset")->nullable();

			$table->boolean("is_blocked")->default(false);
			$table->boolean("is_blocked_payout")->default(false);

			$table->text("remember_token")->nullable();
			$table->string("ip_register")->nullable();

			$table->string("payeer", 30)->nullable();

			$table->integer("postIndex")->nullable();
			$table->string("country")->nullable();
			$table->string("city")->nullable();
			$table->string("region")->nullable();
			$table->string("address")->nullable();
			$table->string("birthday")->nullable();
			$table->boolean("is_accreditation")->default(false);
			$table
				->integer("statusKYC")
				->default(0)
				->index();
			$table
				->integer("stepKYC")
				->default(0)
				->index();

			$table->string("nameTheme")->nullable();
			$table->timestamps();
		});
		DB::statement("ALTER TABLE users ADD avatar MEDIUMBLOB NULL");
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("users");
	}
}
