<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeCurrencyColumnToFinanceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('finance', function (Blueprint $table) {
            $table->dropColumn('balance');
        });
        Schema::table('finance', function (Blueprint $table) {
            $table
                ->decimal("balance", 20, 2)
                ->unsigned()
                ->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('finance', function (Blueprint $table) {
            //
        });
    }
}
