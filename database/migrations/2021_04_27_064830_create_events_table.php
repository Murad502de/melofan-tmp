<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("events", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->bigInteger("mainId")->nullable();
			$table->string("title");
			$table->longText("body")->nullable();
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
		Schema::dropIfExists("events");
	}
}
