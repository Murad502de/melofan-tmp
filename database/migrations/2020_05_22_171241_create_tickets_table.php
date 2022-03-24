<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTicketsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("tickets", function (Blueprint $table) {
			$table->id();
			$table->bigInteger("user_id")->unsigned();
			$table
				->bigInteger("operator_id")
				->unsigned()
				->nullable();

			$table->integer("status")->default(1);
			$table->string("theme");
			$table->text("text");

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
		Schema::dropIfExists("tickets");
	}
}
