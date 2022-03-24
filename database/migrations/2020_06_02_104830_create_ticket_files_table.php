<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTicketFilesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("ticket_files", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->bigInteger("ticket_message_id")->unsigned();
			$table->string("name");
			$table->string("path");
			$table->string("type");

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
		Schema::dropIfExists("ticket_files");
	}
}
