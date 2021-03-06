<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("payments", function (Blueprint $table) {
			$table->bigIncrements("id");

			$table->bigInteger("user_id")->unsigned();
			$table->decimal("amount", 20, 8);
			$table->string("currency", 20);
			$table->integer("system");
			$table->string("transaction_number");
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
		Schema::dropIfExists("payments");
	}
}
