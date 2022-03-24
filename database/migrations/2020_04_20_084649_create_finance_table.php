<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFinanceTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("finance", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->bigInteger("user_id")->unsigned();

			$table
				->decimal("balance", 20, 8)
				->unsigned()
				->default(0);
			$table->string("currency", 20);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists("finance");
	}
}
