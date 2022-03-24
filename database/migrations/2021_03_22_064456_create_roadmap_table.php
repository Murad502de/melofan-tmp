<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoadmapTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create("roadmap", function (Blueprint $table) {
			$table->bigIncrements("id");
			$table->bigInteger("mainId")->nullable();
			$table->string("title");
			$table->integer("round")->nullable();
			$table->string("target")->nullable();
			$table->integer("status")->default(0);
			$table->decimal("amount", 20, 2);
			$table->decimal("percentCalc", 20, 2)->default(0.1);
			$table->boolean("isDisplay")->default(true);
			$table->char("language", 5);
			$table->string("typeTime")->default("quarter");
			$table->integer("month")->default(1);
			$table->integer("quarter")->default(1);
			$table->integer("year")->default(0);
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
		Schema::dropIfExists("roadmap");
	}
}
