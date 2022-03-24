<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayoutsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("payouts", function (Blueprint $table) {
			$table->bigIncrements("id");

			$table->bigInteger("user_id")->unsigned();
			$table->decimal("amount", 20, 2);
			$table->string("currency", 20);
			$table->integer("system");
			$table->string("system_id");
			$table->boolean("status")->default(false);
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
		Schema::dropIfExists("payouts");
	}
}
