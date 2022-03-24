<?php

namespace App\Http\Controllers\Cabinet;

use App\Events\Tickets\Open;
use App\Events\Tickets\SendOperator;
use App\Events\Tickets\SendUser;
use App\Events\Tickets\UpdateStatusOperator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\App;
use Throwable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;

class TicketsController extends Controller
{
	private static $idSectionFiles = "tickets";
	private static $typeFiles = ["pdf", "png", "jpe", "jpeg", "jpg", "gif", "bmp", "ico", "tiff", "tif", "svg", "svgz"];

	/**
	 * @var string[]
	 */
	private static $mapNameTable = [
		"number" => "id",
		"theme" => "theme",
		"status" => "status",
		"date" => "created_at",
	];

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllTickets(Request $request): \Illuminate\Http\JsonResponse
	{
		$userId = auth()->user()->id;
		$dataRequest = $request->json()->all();

		if (!parent::verifyTableId($request["tableId"])) {
			return response()->json(["success" => false]);
		}

		if ($dataRequest["isFirstLoad"]) {
			$dataRequest = parent::getProcessedData($userId, $dataRequest);
			$response = $dataRequest["response"];
			$dataRequest = $dataRequest["request"];
		}
		$response["success"] = true;

		$whereStatus = false;
		if ($dataRequest["tableId"] == "pendingTickets") {
			$whereStatus = ["status", ">", 0];
		} elseif ($dataRequest["tableId"] == "endTickets") {
			$whereStatus = ["status", 0];
		}
		$dataTable = self::getTickets($userId, $dataRequest, $whereStatus);
		if (!$dataTable) {
			return response()->json(["success" => false]);
		}
		$response["rows"] = $dataTable["rows"];
		$response["count"] = $dataTable["count"];

		return response()->json($response);
	}

	private static function getTickets($userId, $dataRequest, $whereStatus = false): array
	{
		$whereForTable = parent::getWhereDateForTable(
			$userId,
			$dataRequest["tableId"],
			"created_at",
			$dataRequest["typeDateFilter"],
			$dataRequest["dateBegin"],
			$dataRequest["dataEnd"],
		);
		$whereForTable[] = ["user_id", $userId];
		if ($whereStatus) {
			$whereForTable[] = $whereStatus;
		}

		$cellSort = self::$mapNameTable[$dataRequest["idCellSort"]];
		$sortAsc = parent::getSortAscForTable(
			$userId,
			$dataRequest["tableId"],
			$dataRequest["sortAsc"],
			$dataRequest["idCellSort"],
		);

		$collectionTickets = DB::table("tickets")
			->select(["id as number", "theme", "status", "created_at as date"])
			->where($whereForTable)
			->skip(($dataRequest["currentPage"] - 1) * $dataRequest["countPerPage"])
			->take($dataRequest["countPerPage"])
			->orderBy($cellSort, $sortAsc)
			->get();

		return [
			"rows" => $collectionTickets->toArray(),
			"count" => DB::table("tickets")
				->where($whereForTable)
				->count(),
		];
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getIsOpenTicket(Request $request): \Illuminate\Http\JsonResponse
	{
		$userId = auth()->user()->id;
		return response()->json([
			"success" => true,
			"isOpenTicket" => DB::table("tickets")
				->where([["user_id", $userId], ["status", ">", 0]])
				->exists(),
		]);
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getOneTickets(Request $request): \Illuminate\Http\JsonResponse
	{
		$id = $request->json()->get("id");
		$idUser = auth()->user()->id;

		$resultTickets = [];

		$collectionTicket = DB::table("tickets")
			->select(["user_id", "status", "theme"])
			->where("id", $id)
			->first();
		if (is_null($collectionTicket)) {
			return response()->json(["success" => false], 404);
		}
		if ($collectionTicket->user_id != $idUser) {
			return response()->json(["success" => false], 404);
		}

		$themeTicket = $collectionTicket->theme;
		$statusTicket = $collectionTicket->status;

		$collectionTickets = DB::table("ticket_messages")
			->select([
				"ticket_messages.id",
				"ticket_messages.text",
				"ticket_messages.user_id",
				"users.avatar",
				"ticket_messages.created_at",
			])
			->where("ticket_messages.ticket_id", $id)
			->orderBy("ticket_messages.id")
			->leftJoin("users", "users.id", "=", "ticket_messages.user_id")
			->get();

		$indexImage = 0;
		$index = -1;
		$oldUserId = 0;
		$oldDateMessages = strtotime(date("Y-m-d 00:00:00"));
		foreach ($collectionTickets as $ticket) {
			$collectionFilesMessage = DB::table("ticket_files")
				->select(["path", "type", "name"])
				->where("ticket_message_id", $ticket->id)
				->get();
			$arrayImage = [];
			$arrayDocuments = [];
			foreach ($collectionFilesMessage as $fileMessage) {
				if ($fileMessage->type == "pdf") {
					$arrayDocuments[] = [
						"path" => Storage::disk("public")->url($fileMessage->path),
						"type" => $fileMessage->type,
						"name" => $fileMessage->name,
					];
				} else {
					$arrayImage[] = [
						"path" => Storage::disk("public")->url($fileMessage->path),
						"type" => $fileMessage->type,
						"name" => $fileMessage->name,
						"index" => $indexImage,
					];
					$indexImage++;
				}
			}
			if ($oldUserId == 0) {
				$oldUserId = $ticket->user_id;
			}

			$dateMessage = strtotime(date("Y-m-d 00:00:00", strtotime($ticket->created_at)));
			if ($oldUserId != $ticket->user_id || $dateMessage != $oldDateMessages || count($resultTickets) == 0) {
				$index++;
				$oldUserId = $ticket->user_id;
				$oldDateMessages = $dateMessage;

				$resultTickets[$index] = [
					"id" => $ticket->id,
					"date" => date("Y-m-d 00:00:00", strtotime($ticket->created_at)),
					"msg" => [
						[
							"date" => $ticket->created_at,
							"text" => $ticket->text,
							"images" => $arrayImage,
							"documents" => $arrayDocuments,
						],
					],
					"userId" => $ticket->user_id,
					"userAvatar" => $ticket->avatar,
				];
			} else {
				$resultTickets[$index]["msg"][] = [
					"date" => $ticket->created_at,
					"text" => $ticket->text,
					"images" => $arrayImage,
					"documents" => $arrayDocuments,
				];
			}
		}

		return response()->json([
			"success" => true,
			"messages" => $resultTickets,
			"theme" => $themeTicket,
			"status" => $statusTicket,
		]);
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws Throwable
	 */
	public function openTicket(Request $request): \Illuminate\Http\JsonResponse
	{
		$arrayFiles = [];
		$userId = auth()->user()->id;

		DB::beginTransaction();
		try {
			$theme = $request->get("theme");
			$text = $request->get("text");
			$today = date("Y-m-d H:i:s");
			$countFiles = (int) $request->get("countFiles");

			$isOpenTickets = DB::table("tickets")
				->where([["user_id", $userId], ["status", ">", 0]])
				->exists();

			if (!empty($theme) && !empty($text) && !$isOpenTickets) {
				$ticketId = DB::table("tickets")->insertGetId([
					"user_id" => $userId,
					"theme" => $theme,
					"text" => $text,
					"created_at" => $today,
					"updated_at" => $today,
				]);

				$idMessagesTicket = DB::table("ticket_messages")->insertGetId([
					"ticket_id" => $ticketId,
					"user_id" => $userId,
					"text" => $text,
					"created_at" => $today,
					"updated_at" => $today,
				]);

				$idSectionFiles = self::$idSectionFiles . "/" . $userId;
				for ($index = 0; $index < $countFiles; $index++) {
					$arrayFiles[] = parent::saveFile(
						$request->file("files" . $index),
						$idSectionFiles,
						self::$typeFiles,
						true,
					);
					DB::table("ticket_files")->insert([
						"ticket_message_id" => $idMessagesTicket,
						"path" => $arrayFiles[$index]["filename"],
						"name" => $arrayFiles[$index]["originalName"],
						"type" => $arrayFiles[$index]["ext"],
						"created_at" => $today,
						"updated_at" => $today,
					]);
				}

				App::setLocale(auth()->user()->language);
				$subject = __("themeTicket" . $theme) . " #" . $ticketId;
				Mail::send("message.ticket_message", ["text_message" => $text], function ($mail) use ($subject) {
					$mail->to(env("MAIL_ADDRESS_SUPPORT"))->subject($subject);
					$mail->from(env("MAIL_USERNAME"), "HitBeat Support");
				});
			} else {
				return response()->json(["success" => false]);
			}

			DB::commit();

			Open::dispatch([
				"id" => $ticketId,
				"user_id" => $userId,
				"theme" => parent::$themeTicket[(int) $theme],
				"text" => $text,
				"created_at" => $today,
				"updated_at" => $today,
				"status" => parent::$statusTicket[1],
			]);

			return response()->json(["success" => true]);
		} catch (Throwable $e) {
			DB::rollBack();

			$idSectionFiles = self::$idSectionFiles . "/" . $userId;
			$countFiles = count($arrayFiles);
			for ($index = 0; $index < $countFiles; $index++) {
				parent::deleteFile($arrayFiles[$index]["filename"], $idSectionFiles);
			}

			Log::error($e);
			return response()->json(["success" => false]);
		}
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 * @throws Throwable
	 */
	public function sendMessageTicket(Request $request): \Illuminate\Http\JsonResponse
	{
		$arrayFiles = [];
		$user = auth()->user();

		DB::beginTransaction();
		try {
			$id = $request->get("id");
			$text = $request->get("text");
			$today = date("Y-m-d H:i:s");
			$countFiles = (int) $request->get("countFiles");

			$collectionTickets = DB::table("tickets")
				->select(["theme", "text", "operator_id", "user_id", "created_at", "updated_at"])
				->where([["user_id", $user->id], ["status", ">", 0], ["id", $id]])
				->first();

			$arrayImage = [];
			$arrayDocuments = [];

			if ((!empty($text) || $countFiles > 0) && !is_null($collectionTickets)) {
				$idMessagesTicket = DB::table("ticket_messages")->insertGetId([
					"ticket_id" => $id,
					"user_id" => $user->id,
					"text" => $text,
					"created_at" => $today,
					"updated_at" => $today,
				]);

				$idSectionFiles = self::$idSectionFiles . "/" . $user->id;
				for ($index = 0; $index < $countFiles; $index++) {
					$arrayFiles[] = parent::saveFile(
						$request->file("files" . $index),
						$idSectionFiles,
						self::$typeFiles,
						true,
					);
					if ($arrayFiles[$index]["ext"] == "pdf") {
						$arrayDocuments[] = [
							"path" => Storage::disk("public")->url($arrayFiles[$index]["filename"]),
							"type" => $arrayFiles[$index]["ext"],
							"name" => $arrayFiles[$index]["originalName"],
						];
					} else {
						$arrayImage[] = [
							"path" => Storage::disk("public")->url($arrayFiles[$index]["filename"]),
							"type" => $arrayFiles[$index]["ext"],
							"name" => $arrayFiles[$index]["originalName"],
						];
					}
					DB::table("ticket_files")->insert([
						"ticket_message_id" => $idMessagesTicket,
						"path" => $arrayFiles[$index]["filename"],
						"name" => $arrayFiles[$index]["originalName"],
						"type" => $arrayFiles[$index]["ext"],
						"created_at" => $today,
						"updated_at" => $today,
					]);
				}

				App::setLocale(auth()->user()->language);
				$subject = __("themeTicket" . $collectionTickets->theme) . " #" . $id;
				Mail::send("message.ticket_message", ["text_message" => $text], function ($mail) use ($subject) {
					$mail->to(env("MAIL_ADDRESS_SUPPORT"))->subject($subject);
					$mail->from(env("MAIL_USERNAME"), "HitBeat Support");
				});
			} else {
				return response()->json(["success" => false]);
			}

			DB::table("tickets")
				->where("id", $id)
				->update([
					"status" => 1,
				]);

			DB::commit();

			UpdateStatusOperator::dispatch([
				"id" => $id,
				"created_at" => $collectionTickets->created_at,
				"updated_at" => $collectionTickets->updated_at,
				"user_id" => $collectionTickets->user_id,
				"theme" => parent::$themeTicket[(int) $collectionTickets->theme],
				"text" => $collectionTickets->text,
				"status" => parent::$statusTicket[1],
				"operator_id" => $collectionTickets->operator_id,
			]);

			SendUser::dispatch([
				"id" => $idMessagesTicket,
				"date" => date("Y-m-d 00:00:00", strtotime($today)),
				"msg" => [
					[
						"date" => $today,
						"text" => $text,
						"images" => $arrayImage,
						"documents" => $arrayDocuments,
					],
				],
				"userId" => $user->id,
				"userAvatar" => $user->avatar,
				"client_id" => $collectionTickets->user_id,
			]);

			SendOperator::dispatch([
				"id" => $idMessagesTicket,
				"created_at" => $today,
				"user_name" => $user->id . ": " . $user->lastName . " " . $user->firstName,
				"user_avatar" => $user->avatar,
				"user_id" => $user->id,
				"text" => $text,
				"images" => $arrayImage,
				"documents" => $arrayDocuments,
				"operator_id" => $collectionTickets->operator_id,
			]);
			return response()->json(["success" => true]);
		} catch (Throwable $e) {
			DB::rollBack();

			$idSectionFiles = self::$idSectionFiles . "/" . $user->id;
			$countFiles = count($arrayFiles);
			for ($index = 0; $index < $countFiles; $index++) {
				parent::deleteFile($arrayFiles[$index]["filename"], $idSectionFiles);
			}

			Log::error($e);
			return response()->json(["success" => false]);
		}
	}
}
