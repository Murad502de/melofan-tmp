<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayVerificationsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("pay_verifications", function (Blueprint $table) {
			$table->bigIncrements("id");

			$table->bigInteger("user_id")->unsigned();
			$table
				->bigInteger("recipient_id")
				->unsigned()
				->nullable();
			$table->integer("system")->nullable();
			$table->decimal("amount", 20, 8);
			$table->string("currency", 20);
			$table->string("token")->index();
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
		Schema::dropIfExists("pay_verifications");
	}
}
