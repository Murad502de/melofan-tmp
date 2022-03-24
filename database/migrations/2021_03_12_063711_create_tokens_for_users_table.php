<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTokensForUsersTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("tokens_for_users", function (Blueprint $table) {
			$table->bigIncrements("id");

			$table->bigInteger("user_id")->unsigned();
			$table->string("token")->index();
			$table->string("type")->index();

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
		Schema::dropIfExists("tokens_for_users");
	}
}
