<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDocumentsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("documents", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->bigInteger("mainId")->nullable();
			$table->string("name");
			$table->string("format");
			$table->string("size")->default("0 b");
			$table->string("path");
			$table->char("language", 5);
			$table->boolean("isDisplay")->default(true);
			$table->text("url_confirmation")->nullable();
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
		Schema::dropIfExists("documents");
	}
}
