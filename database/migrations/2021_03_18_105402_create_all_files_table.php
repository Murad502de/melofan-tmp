<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAllFilesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("all_files", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->string("name")->index();
			$table->string("parent")->index();
			$table->string("format");
			$table->string("size")->default("0 b");
			$table->string("path");
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
		Schema::dropIfExists("all_files");
	}
}
