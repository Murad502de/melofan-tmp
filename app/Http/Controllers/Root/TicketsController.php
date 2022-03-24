<?php

namespace App\Http\Controllers\Root;

use App\Events\Tickets\AddPending;
use App\Events\Tickets\Apply;
use App\Events\Tickets\Close;
use App\Events\Tickets\SendOperator;
use App\Events\Tickets\SendUser;
use App\Events\Tickets\UpdateStatusUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PHPUnit\Exception;

class TicketsController extends Controller
{
	private static $idSectionFiles = "tickets";
	private static $typeFiles = ["pdf", "png", "jpe", "jpeg", "jpg", "gif", "bmp", "ico", "tiff", "tif", "svg", "svgz"];

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getTickets(Request $request): \Illuminate\Http\JsonResponse
	{
		$administrator = auth()->user()->id;
		$idTickets = $request->json()->get("id");

		$collectionTickets = DB::table("tickets")
			->select(["id", "status", "theme", "created_at"])
			->where([["id", $idTickets], ["operator_id", $administrator], ["status", ">", 0]])
			->orWhere([["id", $idTickets], ["status", 0]])
			->first();

		if (is_null($collectionTickets)) {
			return response()->json([
				"success" => false,
				"error" => "Вы не являетесь исполнителем!",
			]);
		}

		$collectionTicketMessages = DB::table("ticket_messages")
			->select([
				"ticket_messages.id",
				"ticket_messages.text",
				"ticket_messages.user_id",
				"users.avatar",
				"users.lastName",
				"users.firstName",
				"ticket_messages.created_at",
			])
			->where("ticket_messages.ticket_id", $idTickets)
			->orderBy("ticket_messages.id")
			->leftJoin("users", "users.id", "=", "ticket_messages.user_id")
			->get();
		$arrayMessages = self::collectionTicketMessagesToArray($collectionTicketMessages);

		$collectionUser = DB::table("users")
			->select(["language"])
			->where("id", $arrayMessages[0]["user_id"])
			->first();
		$collectionTickets = [
			"id" => $collectionTickets->id,
			"theme" => parent::$themeTicket[$collectionTickets->theme],
			"status" => parent::$statusTicket[$collectionTickets->status],
			"created_at" => $collectionTickets->created_at,
			"language" => parent::$langages[$collectionUser->language],
		];

		return response()->json([
			"success" => true,
			"tickets" => $collectionTickets,
			"ticketMessages" => $arrayMessages,
		]);
	}

	/**
	 * @param $collectionTicketMessages
	 * @return array
	 */
	private static function collectionTicketMessagesToArray($collectionTicketMessages): array
	{
		$resultTicketMessages = [];
		$indexImage = 0;
		foreach ($collectionTicketMessages as $ticketMessage) {
			$collectionImageMessage = DB::table("ticket_files")
				->select(["path", "type", "name"])
				->where("ticket_message_id", $ticketMessage->id)
				->get();
			$arrayImage = [];
			$arrayDocuments = [];
			foreach ($collectionImageMessage as $fileMessage) {
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

			$resultTicketMessages[] = [
				"id" => $ticketMessage->id,
				"created_at" => $ticketMessage->created_at,
				"user_name" =>
					$ticketMessage->user_id . ": " . $ticketMessage->lastName . " " . $ticketMessage->firstName,
				"user_avatar" => $ticketMessage->avatar,
				"user_id" => $ticketMessage->user_id,
				"text" => $ticketMessage->text,
				"images" => $arrayImage,
				"documents" => $arrayDocuments,
			];
		}

		return $resultTicketMessages;
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllOpenTickets(Request $request): \Illuminate\Http\JsonResponse
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		return response()->json(self::getAllTickets($page, $perPage, $search, $filter, "open"));
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllCloseTickets(Request $request): \Illuminate\Http\JsonResponse
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		return response()->json(self::getAllTickets($page, $perPage, $search, $filter, "close"));
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function getAllWorkTickets(Request $request): \Illuminate\Http\JsonResponse
	{
		$page = $request->json()->get("page");
		$perPage = $request->json()->get("perPage");
		$search = $request->json()->get("search");
		$filter = $request->json()->get("filter");

		return response()->json(self::getAllTickets($page, $perPage, $search, $filter, "work"));
	}

	/**
	 * @param $page
	 * @param $perPage
	 * @param $search
	 * @param $filter
	 * @param $type
	 * @return array
	 */
	private function getAllTickets($page, $perPage, $search, $filter, $type): array
	{
		$operator = auth()->user();

		$resultArrayTickets = [];
		$countTickets = 0;
		$whereFilter = [];
		switch ($type) {
			case "open":
				$whereFilter[] = ["status", "=", 1];
				$whereFilter[] = ["operator_id", "=", null];
				break;
			case "close":
				$whereFilter[] = ["status", "=", 0];
				$whereFilter[] = ["operator_id", $operator->id];
				break;
			case "work":
				$whereFilter[] = ["status", ">", 0];
				$whereFilter[] = ["operator_id", $operator->id];
				break;
		}

		if ($filter) {
			//            if (isset($filter['ban']) && !empty($filter['ban']) && $filter['ban']['isActive']) {
			//                switch ((string)$filter['ban']['select']) {
			//                    case 'ban_true':
			//                        $whereFilter[] = ['users.is_blocked', true];
			//                        break;
			//                    case 'ban_false':
			//                        $whereFilter[] = ['users.is_blocked', false];
			//                        break;
			//                }
			//            }
		}

		if (empty($search)) {
			$collectionTickets = DB::table("tickets")
				->select(["id", "user_id", "theme", "text", "created_at", "updated_at", "status"])
				->where($whereFilter)
				->orderBy("id", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayTickets = self::collectionTicketsToArray($collectionTickets);

			$collectionCount = DB::table("tickets")
				->selectRaw("COUNT(id) AS countId")
				->where($whereFilter)
				->first();
			$countTickets = $collectionCount->countId;
		} else {
			$whereSearch = [
				1 => [["text", "like", "%" . $search . "%"]],
				2 => [["user_id", "like", "%" . $search . "%"]],
				3 => [["operator_id", "like", "%" . $search . "%"]],
			];
			$where = [];
			$where[1] = array_merge($whereSearch[1], $whereFilter);
			$where[2] = array_merge($whereSearch[2], $whereFilter);
			$where[3] = array_merge($whereSearch[3], $whereFilter);

			$collectionTickets = DB::table("tickets")
				->select(["id", "user_id", "theme", "text", "created_at", "updated_at", "status"])
				->where($where[1])
				->orWhere($where[2])
				->orWhere($where[3])
				->orderBy("updated_at", "desc")
				->skip($page * $perPage)
				->take($perPage)
				->get();
			$resultArrayTickets = self::collectionTicketsToArray($collectionTickets);

			$collectionCount = DB::table("tickets")
				->selectRaw("COUNT(id) AS countId")
				->where($where[1])
				->orWhere($where[2])
				->orWhere($where[3])
				->first();
			$countTickets = $collectionCount->countId;
		}

		return [
			"success" => true,
			"array" => $resultArrayTickets,
			"total" => $countTickets,
		];
	}

	/**
	 * @param $collectionTickets
	 * @return array
	 */
	private static function collectionTicketsToArray($collectionTickets): array
	{
		$resultTickets = [];
		foreach ($collectionTickets as $ticket) {
			$resultTickets[] = [
				"id" => $ticket->id,
				"created_at" => $ticket->created_at,
				"updated_at" => $ticket->updated_at,
				"user_id" => $ticket->user_id,
				"theme" => parent::$themeTicket[(int) $ticket->theme],
				"text" => $ticket->text,
				"status" => parent::$statusTicket[(int) $ticket->status],
			];
		}

		return $resultTickets;
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function applyTickets(Request $request): \Illuminate\Http\JsonResponse
	{
		$operator = auth()->user();
		try {
			DB::beginTransaction();
			$idTickets = $request->json()->get("rowId");
			$collectionTicket = DB::table("tickets")
				->select(["operator_id"])
				->where("id", $idTickets)
				->first();
			if (is_null($collectionTicket)) {
				return response()->json([
					"success" => false,
					"error" => "Выбранного обращения не существует.",
				]);
			}
			if (!is_null($collectionTicket->operator_id)) {
				return response()->json([
					"success" => false,
					"error" => "Обращению уже назначен исполнитель. Пожалуйста выберите другое обращение.",
				]);
			}

			DB::table("tickets")
				->where([["id", $idTickets], ["operator_id", null]])
				->update(["operator_id" => $operator->id]);
			DB::commit();

			broadcast(new Apply($idTickets))->toOthers();
			$collectionTicket = DB::table("tickets")
				->select(["id", "user_id", "operator_id", "text", "theme", "status", "created_at"])
				->where("id", $idTickets)
				->first();
			AddPending::dispatch([
				"id" => $collectionTicket->id,
				"created_at" => $collectionTicket->created_at,
				"user_id" => $collectionTicket->user_id,
				"operator_id" => $collectionTicket->operator_id,
				"theme" => parent::$themeTicket[(int) $collectionTicket->theme],
				"text" => $collectionTicket->text,
				"status" => parent::$statusTicket[(int) $collectionTicket->status],
			]);
		} catch (\Throwable $e) {
			DB::rollBack();
			Log::error($e);
			return response()->json(["success" => false]);
		}

		return response()->json(["success" => true]);
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function closeTickets(Request $request): \Illuminate\Http\JsonResponse
	{
		$operator = auth()->user();
		$idTickets = $request->json()->get("idTickets");

		try {
			DB::beginTransaction();
			DB::table("tickets")
				->where([["id", $idTickets], ["operator_id", $operator->id]])
				->update(["status" => 0]);
			DB::commit();

			$collectionTicket = DB::table("tickets")
				->select(["id as number", "user_id", "theme", DB::raw("0 as status"), "created_at as date"])
				->where([["id", $idTickets], ["operator_id", $operator->id]])
				->first();
			Close::dispatch($collectionTicket);
		} catch (\Throwable $e) {
			DB::rollBack();
			Log::error($e);
			return response()->json(["success" => false]);
		}

		return response()->json(["success" => true]);
	}

	/**
	 * @param Request $request
	 * @return \Illuminate\Http\JsonResponse
	 */
	public function sendTickets(Request $request): \Illuminate\Http\JsonResponse
	{
		$idTickets = $request->get("idTickets");
		$textMessage = $request->get("textMessage");
		$countImages = (int) $request->get("countImages");

		$operator = auth()->user();

		$collectionTicket = DB::table("tickets")
			->select([
				"tickets.user_id",
				"tickets.theme",
				"tickets.status",
				"tickets.created_at",
				"users.email",
				"users.lastName",
				"users.firstName",
				"users.avatar",
				"users.language",
				"tickets.operator_id",
			])
			->where("tickets.id", $idTickets)
			->leftJoin("users", "users.id", "=", "tickets.user_id")
			->first();

		if (is_null($collectionTicket)) {
			return response()->json([
				"success" => false,
				"error" => "Выбранного обращения не существует.",
			]);
		}
		if ($collectionTicket->operator_id != $operator->id) {
			return response()->json([
				"success" => false,
				"error" => "Вы не являетесь исполнителем обращения",
			]);
		}

		if ((!empty($textMessage) || (!empty($countImages) && $countImages > 0)) && $collectionTicket->status > 0) {
			$arrayFiles = [];
			try {
				DB::beginTransaction();

				$today = date("Y-m-d H:i:s");
				$textMessage = empty($textMessage) ? "" : $textMessage;
				$idMessagesTicket = DB::table("ticket_messages")->insertGetId([
					"ticket_id" => $idTickets,
					"user_id" => $operator->id,
					"text" => $textMessage,
					"created_at" => $today,
					"updated_at" => $today,
				]);

				$arrayImage = [];
				$arrayDocuments = [];
				$idSectionFiles = self::$idSectionFiles . "/" . $collectionTicket->user_id;
				for ($index = 0; $index < $countImages; $index++) {
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

				try {
					$nickname = $collectionTicket->firstName . " " . $collectionTicket->lastName;
					$email = $collectionTicket->email;
					App::setLocale($collectionTicket->language);
					$subject = __("themeTicket" . $collectionTicket->theme) . " #" . $idTickets;
					Mail::send("message.ticket_message", ["text_message" => $textMessage], function ($mail) use (
						$email,
						$nickname,
						$subject
					) {
						$mail->to($email, $nickname)->subject($subject);
						$mail->from(env("MAIL_USERNAME"), "HitBeat Support");
					});
				} catch (Exception $exception) {
					Log::error($exception, true);
				}

				DB::table("tickets")
					->where("id", $idTickets)
					->update([
						"status" => 2,
					]);

				DB::commit();

				UpdateStatusUser::dispatch([
					"number" => $idTickets,
					"theme" => $collectionTicket->theme,
					"date" => $collectionTicket->created_at,
					"status" => 2,
					"user_id" => $collectionTicket->user_id,
				]);

				SendUser::dispatch([
					"id" => $idMessagesTicket,
					"date" => date("Y-m-d 00:00:00", strtotime($today)),
					"msg" => [
						[
							"date" => $today,
							"text" => $textMessage,
							"images" => $arrayImage,
							"documents" => $arrayDocuments,
						],
					],
					"userId" => $operator->id,
					"userAvatar" => $operator->avatar,
					"client_id" => $collectionTicket->user_id,
				]);

				SendOperator::dispatch([
					"id" => $idMessagesTicket,
					"created_at" => $today,
					"user_name" => $operator->id . ": " . $operator->lastName . " " . $operator->firstName,
					"user_avatar" => $collectionTicket->avatar,
					"user_id" => $operator->id,
					"text" => $textMessage,
					"images" => $arrayImage,
					"documents" => $arrayDocuments,
					"operator_id" => $collectionTicket->operator_id,
				]);
			} catch (\Throwable $e) {
				DB::rollBack();
				$idSectionFiles = self::$idSectionFiles . "/" . $collectionTicket->user_id;
				$countFiles = count($arrayFiles);
				for ($index = 0; $index < $countFiles; $index++) {
					parent::deleteFile($arrayFiles[$index]["filename"], $idSectionFiles);
				}
				Log::error($e);
				return response()->json(["success" => false]);
			}

			return response()->json(["success" => true]);
		} else {
			return response()->json(["success" => false]);
		}
	}
}
