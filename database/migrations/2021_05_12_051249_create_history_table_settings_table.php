<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoryTableSettingsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("history_table_settings", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table
				->bigInteger("user_id")
				->unsigned()
				->index();
			$table->string("table_id")->index();
			$table->integer("typeFilter")->nullable();
			$table->timestamp("dateBegin")->nullable();
			$table->timestamp("dateEnd")->nullable();
			$table->string("idCellSort")->nullable();
			$table->string("sortAsc")->nullable();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("history_table_settings");
	}
}
