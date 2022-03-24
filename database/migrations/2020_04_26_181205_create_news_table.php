<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNewsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("news", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->bigInteger("mainId")->nullable();
			$table->string("url");
			$table->string("title");
			$table->string("announce");
			$table->string("image");
			$table->longText("body");
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
		Schema::dropIfExists("news");
	}
}
