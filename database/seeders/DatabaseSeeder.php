<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
	/**
	 * Seed the application's database.
	 *
	 * @return void
	 */
	public function run()
	{
		$admin = new Role();
		$admin->name = "Администратор";
		$admin->slug = "admin";
		$admin->save();

		$ticketOperator = new Role();
		$ticketOperator->name = "Оператор тикетов";
		$ticketOperator->slug = "ticket_operator";
		$ticketOperator->save();

		$payoutOperator = new Role();
		$payoutOperator->name = "Оператор выплат";
		$payoutOperator->slug = "payout_operator";
		$payoutOperator->save();

		$verifyOperator = new Role();
		$verifyOperator->name = "Оператор верификации (Скотт)";
		$verifyOperator->slug = "verify_operator";
		$verifyOperator->save();

		$broker = new Role();
		$broker->name = "Брокер";
		$broker->slug = "broker";
		$broker->save();

		$userRole = new Role();
		$userRole->name = "Пользователь";
		$userRole->slug = "user";
		$userRole->save();

		$userRole = Role::where("slug", "admin")->first();

		$user1 = new User();
		$user1->lastName = "Администратор";
		$user1->firstName = "HitBeat";
		$user1->email = "administrator@hitbeat.com";
		$user1->password = Hash::make("ghbvth");
		$user1->phone = "77777777777";
		$user1->is_verified_email = true;
		$user1->save();
		$user1->roles()->attach($userRole);

		$userRole = Role::where("slug", "verify_operator")->first();

		$user2 = new User();
		$user2->lastName = "Верификация";
		$user2->firstName = "HitBeat";
		$user2->email = "scott@hitbeat.com";
		$user2->password = Hash::make("ghbvth");
		$user2->phone = "88888888888";
		$user2->is_verified_email = true;
		$user2->save();
		$user2->roles()->attach($userRole);

		DB::table("text_codes")->insert([
			[
				"code" => 0,
				"table" => "Статус KYC",
				"name" => "Не верефицирован",
			],
			[
				"code" => 1,
				"table" => "Статус KYC",
				"name" => "Верифицирован",
			],
			[
				"code" => 2,
				"table" => "Статус KYC",
				"name" => "US не аккредитованный",
			],
			[
				"code" => 3,
				"table" => "Статус KYC",
				"name" => "US аккредитованный",
			],
			[
				"code" => 4,
				"table" => "Статус KYC",
				"name" => "CA не аккредитованный",
			],
			[
				"code" => 5,
				"table" => "Статус KYC",
				"name" => "CA аккредитованный",
			],
		]);
	}
}
