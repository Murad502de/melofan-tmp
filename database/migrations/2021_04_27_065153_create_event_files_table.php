<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventFilesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("event_files", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->bigInteger("event_id")->unsigned();
			$table->string("name");
			$table->string("path");
			$table->string("format");
			$table->string("size")->default("0 b");

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
		Schema::dropIfExists("event_files");
	}
}
