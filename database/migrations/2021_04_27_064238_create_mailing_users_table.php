<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMailingUsersTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("mailing_users", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->string("email")->unique();
			$table->string("token")->index();
			$table->boolean("isActive")->default(false);
			$table->char("language", 5);
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
		Schema::dropIfExists("mailing_users");
	}
}
