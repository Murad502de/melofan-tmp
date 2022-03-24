<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSecuritiesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("securities", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->integer("round");
			$table->decimal("targetAmount", 20);
			$table->decimal("targetPercent", 20);
			$table->decimal("targetMLFN", 20);
			$table->decimal("price", 20);
			$table->integer("status")->default(0);

			$table->decimal("resultAmount", 20)->default(0);
			$table->decimal("resultMLFN", 20)->default(0);
			$table->decimal("resultPercent", 20)->default(0);
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
		Schema::dropIfExists("securities");
	}
}
