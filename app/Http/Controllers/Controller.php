<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class Controller extends BaseController
{
	use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

	protected static $statusTicket = [
		0 => "Завершен",
		1 => "В обработке",
		2 => "Ожидание ответа",
	];
	protected static $themeTicket = [
		0 => "Другое",
		1 => "Финансы",
		2 => "Перевод/Вывод",
		3 => "Покупка",
	];
	protected static $langages = [
		"ru" => "Русский",
		"en" => "Английский",
		"de" => "Немецкий",
		"fr" => "Французский",
		"es" => "Испанский",
		"kz" => "Казахский",
		"pl" => "Польский",
		"uz" => "Узбекский",
		"zh" => "Китайский",
	];

	// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
	private static $mime_types = [
		"txt" => "text/plain",
		"htm" => "text/html",
		"html" => "text/html",
		"php" => "text/html",
		"css" => "text/css",
		"js" => "application/javascript",
		"json" => "application/json",
		"xml" => "application/xml",
		"swf" => "application/x-shockwave-flash",
		"flv" => "video/x-flv",

		// images
		"png" => "image/png",
		"jpe" => "image/jpeg",
		"jpeg" => "image/jpeg",
		"jpg" => "image/jpeg",
		"gif" => "image/gif",
		"bmp" => "image/bmp",
		"ico" => "image/vnd.microsoft.icon",
		"tiff" => "image/tiff",
		"tif" => "image/tiff",
		"svg" => "image/svg+xml",
		"svgz" => "image/svg+xml",

		// archives
		"zip" => "application/zip",
		"rar" => "application/x-rar-compressed",
		"exe" => "application/x-msdownload",
		"msi" => "application/x-msdownload",
		"cab" => "application/vnd.ms-cab-compressed",

		// audio/video
		"mp3" => "audio/mpeg",
		"qt" => "video/quicktime",
		"mov" => "video/quicktime",

		// adobe
		"pdf" => "application/pdf",
		"psd" => "image/vnd.adobe.photoshop",
		"ai" => "application/postscript",
		"eps" => "application/postscript",
		"ps" => "application/postscript",

		// ms office
		"doc" => "application/msword",
		"rtf" => "application/rtf",
		"xls" => "application/vnd.ms-excel",
		"ppt" => "application/vnd.ms-powerpoint",

		// open office
		"odt" => "application/vnd.oasis.opendocument.text",
		"ods" => "application/vnd.oasis.opendocument.spreadsheet",
	];

	/**
	 * Метод для получения IP адреса пользователя
	 * @return mixed
	 */
	protected static function getIP()
	{
		$ip = 0;
		if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
			$ip = $_SERVER["HTTP_CLIENT_IP"];
		} elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
			$ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
		} else {
			$ip = $_SERVER["REMOTE_ADDR"];
		}
		return $ip;
	}

	/**
	 * Метод для получения уникального токена используемого в качестве реферальной ссылки
	 * @param $arrayData - Набор данные для создания уникального токена пользователя
	 * @return string
	 */
	protected static function encodeTokenForInvitation($arrayData): string
	{
		return "";
	}

	/**
	 * Метод для получения ID пользователя из токена
	 * @param $srtToken - Токен, который необходимо раскодировать
	 * @return int
	 */
	protected static function decodeTokenForInvitation($srtToken): int
	{
		return 0;
	}

	/**
	 * Метод для получения номера роли используемого для разграничения прав на стороне клиента
	 * @param $collection - Коллекция ролей пользователя или роль пользователя
	 * @return int
	 */
	protected static function getNumberRoleForClient($collection): int
	{
		if (gettype($collection) == "string") {
			$role = $collection;
		} else {
			$role = $collection->pluck("slug")->toArray();
			$role = $role[0];
		}
		switch ($role) {
			case "admin":
				return 200;
			case "ticket_operator":
				return 100;
			case "payout_operator":
				return 101;
			case "verify_operator":
				return 103;
			case "broker":
				return 1;
			default:
				return 0;
		}
	}

	/**
	 * Метод для получения наименование роли в БД из номера от клиента
	 * @param $numberRole - Номер роли используемый на клиенте
	 * @return string
	 */
	protected static function getStringRoleForServer($numberRole)
	{
		switch ($numberRole) {
			case 200:
				return "admin";
			case 100:
				return "ticket_operator";
			case 101:
				return "payout_operator";
			case 103:
				return "verify_operator";
			case 1:
				return "broker";
			default:
				return 0;
		}
	}

	/**
	 * Метод для транслита строк
	 * @param $s - Строка требующая транслит на латинский алфавит
	 * @return array|string|string[]
	 */
	protected static function translit($s, $isUnique = false, $nameTable = null, $nameColumn = null)
	{
		$s = (string) $s; // преобразуем в строковое значение
		$s = strip_tags($s); // убираем HTML-теги
		$s = str_replace(["\n", "\r"], " ", $s); // убираем перевод каретки
		$s = preg_replace("/\s+/", " ", $s); // удаляем повторяющие пробелы
		$s = trim($s); // убираем пробелы в начале и конце строки
		$s = function_exists("mb_strtolower") ? mb_strtolower($s) : strtolower($s); // переводим строку в нижний регистр (иногда надо задать локаль)
		$s = strtr($s, [
			"а" => "a",
			"б" => "b",
			"в" => "v",
			"г" => "g",
			"д" => "d",
			"е" => "e",
			"ё" => "e",
			"ж" => "j",
			"з" => "z",
			"и" => "i",
			"й" => "y",
			"к" => "k",
			"л" => "l",
			"м" => "m",
			"н" => "n",
			"о" => "o",
			"п" => "p",
			"р" => "r",
			"с" => "s",
			"т" => "t",
			"у" => "u",
			"ф" => "f",
			"х" => "h",
			"ц" => "c",
			"ч" => "ch",
			"ш" => "sh",
			"щ" => "shch",
			"ы" => "y",
			"э" => "e",
			"ю" => "yu",
			"я" => "ya",
			"ъ" => "",
			"ь" => "",
		]);
		$s = preg_replace("/[^0-9a-z-_ ]/i", "", $s); // очищаем строку от недопустимых символов
		$s = str_replace(" ", "-", $s); // заменяем пробелы знаком минус

		if ($isUnique) {
			$countRepeat = DB::table($nameTable)
				->where($nameColumn, $s)
				->count();
			$s .= "-" . $countRepeat;
		}

		return $s; // возвращаем результат
	}

	/**
	 * Метод для проверки существования ID таблицы
	 * @param $tableId - ID таблицы получаемый от клиента
	 * @return bool
	 */
	protected static function verifyTableId($tableId): bool
	{
		$arrayIdTables = ["pendingTickets", "endTickets", "allTickets", "notification"];
		return in_array($tableId, $arrayIdTables);
	}

	/**
	 * Метод для обновления данных запроса исходя из данных в БД
	 * @param $userId - ID пользователя, получающий данные таблицы
	 * @param $dataRequest - Данные запроса
	 * @return array
	 */
	protected static function getProcessedData($userId, $dataRequest): array
	{
		unset($dataRequest["token"]);

		$collectionFilter = DB::table("history_table_settings")
			->select(["typeFilter", "dateBegin", "dateEnd", "idCellSort", "sortAsc"])
			->where([["user_id", $userId], ["table_id", $dataRequest["tableId"]]])
			->first();

		$response = [];
		if (!is_null($collectionFilter)) {
			$dataRequest["typeDateFilter"] = $collectionFilter->typeFilter;
			$dataRequest["dateBegin"] = $collectionFilter->dateBegin;
			$dataRequest["dateEnd"] = $collectionFilter->dateEnd;
			$dataRequest["idCellSort"] = $collectionFilter->idCellSort;
			$dataRequest["sortAsc"] = $collectionFilter->sortAsc;

			$response["typeDateFilter"] = $collectionFilter->typeFilter;
			$response["idCellSort"] = $collectionFilter->idCellSort;
			$response["sortAsc"] = $collectionFilter->sortAsc;
			if ($collectionFilter->typeFilter == 4) {
				$response["dateBegin"] = $collectionFilter->dateBegin;
				$response["dateEnd"] = $collectionFilter->dateEnd;
			}
		} else {
			DB::table("history_table_settings")->insert([
				"user_id" => $userId,
				"table_id" => $dataRequest["tableId"],
			]);
		}

		return [
			"request" => $dataRequest,
			"response" => $response,
		];
	}

	/**
	 * Необходим для обработаки получаемых данных от клиента и сохранения данных в БД
	 * @param $userId - Пользователь получающий таблицу
	 * @param $nameTable - Имя сортирующей таблицы
	 * @param $direction - Направление сортировки
	 * @param $cellSort - Колонка сортировка клиентской таблицы
	 * @return string
	 */
	protected static function getSortAscForTable($userId, $nameTable, $direction, $cellSort): string
	{
		$sortAsc = $direction == "desc" ? "desc" : "asc";
		DB::table("history_table_settings")
			->where([["user_id", $userId], ["table_id", $nameTable]])
			->update(["idCellSort" => $cellSort, "sortAsc" => $sortAsc]);
		return $sortAsc;
	}

	/**
	 * Необходим для обработаки получаемых данных от клиента и сохранения данных в БД
	 * @param $userId - Пользователь получающий таблицу
	 * @param $nameTable - Имя сортирующей таблицы
	 * @param $direction - Направление сортировки
	 * @param $cellSort - Колонка сортировка клиентской таблицы
	 * @return string
	 */
	protected static function getSortCellForTable($userId, $nameTable, $direction, $cellSort): string
	{
		$sortAsc = $direction == "desc" ? "desc" : "asc";
		DB::table("history_table_settings")
			->where([["user_id", $userId], ["table_id", $nameTable]])
			->update(["idCellSort" => $cellSort, "sortAsc" => $sortAsc]);
		return $sortAsc;
	}

	/**
	 * Метод для получения сформированного условия используемого в запросе при получении данных таблицы
	 * @param $userId - Пользователь получающий таблицу
	 * @param $nameTable - Наименование фильтрующей таблицы
	 * @param $nameCell - Наименование колонки с датой в БД
	 * @param $typeDateFilter - Тип фильтрации данных таблицы
	 * @param $dateBegin - Дата начала
	 * @param $dateEnd - Дата окончания
	 * @return array
	 */
	protected static function getWhereDateForTable(
		$userId,
		$nameTable,
		$nameCell,
		$typeDateFilter,
		$dateBegin,
		$dateEnd
	): array {
		switch ($typeDateFilter) {
			case 0:
				$dateBegin = date("Y-m-d 00:00:00");
				$dateEnd = date("Y-m-d 23:59:59");
				break;
			case 1:
				$dateBegin = date("Y-m-d 00:00:00", strtotime("-7 days", strtotime(date("Y-m-d 00:00:00"))));
				$dateEnd = date("Y-m-d 23:59:59");
				break;
			case 2:
				$dateBegin = date("Y-m-d 00:00:00", strtotime("-1 month", strtotime(date("Y-m-d 00:00:00"))));
				$dateEnd = date("Y-m-d 23:59:59");
				break;
			case 3:
				$dateBegin = date("Y-m-d 00:00:00", strtotime("-3 month", strtotime(date("Y-m-d 00:00:00"))));
				$dateEnd = date("Y-m-d 23:59:59");
				break;
			case 4:
				$dateBegin = $dateBegin ? date("Y-m-d 00:00:00", strtotime($dateBegin)) : $dateBegin;
				$dateEnd = $dateEnd ? date("Y-m-d 23:59:59", strtotime($dateEnd)) : $dateEnd;
				break;
		}

		$result = [];
		if ($dateBegin) {
			$result[] = [$nameCell, ">", $dateBegin];
		}
		if ($dateEnd) {
			$result[] = [$nameCell, "<", $dateEnd];
		}

		DB::table("history_table_settings")
			->where([["user_id", $userId], ["table_id", $nameTable]])
			->update(["typeFilter" => $typeDateFilter, "dateBegin" => $dateBegin, "dateEnd" => $dateEnd]);

		return $result;
	}

	/**
	 * Show the form for creating a new resource.
	 * @param $file
	 * @param $nameSection
	 * @param $idSection
	 * @param $typesFile
	 * @throws Exception
	 */
	protected static function saveFile($file, $idSection, $typesFile, $isGetData = false, $isGetFullName = true)
	{
		// Создадим ресурс FileInfo
		$fi = finfo_open(FILEINFO_MIME_TYPE);
		// Получим MIME-тип
		$mime = (string) finfo_file($fi, $file);

		if (!self::verifyTypeFile($mime, $typesFile)) {
			throw new Exception();
		}

		do {
			$fileName = Str::random(30); //Generate verification code
			$collectionVerify = DB::table("all_files")
				->select(["id"])
				->where([["name", $fileName], ["parent", $idSection]])
				->first();
		} while (!is_null($collectionVerify));
		$ext = $file->getClientOriginalExtension();
		$fileName = $fileName . "." . $ext;
		Storage::disk("public")->putFileAs($idSection . "/", $file, $fileName);
		DB::table("all_files")->insert([
			"name" => $fileName,
			"format" => $ext,
			"path" => $idSection . "/" . $fileName,
			"language" => "en",
			"parent" => $idSection,
			"created_at" => date("Y-m-d H:i:s"),
		]);

		if ($isGetData) {
			return [
				"ext" => $ext,
				"originalName" => $file->getClientOriginalName(),
				"filename" => $idSection . "/" . $fileName,
			];
		}
		if ($isGetFullName) {
			return $idSection . "/" . $fileName;
		}

		return $fileName;
	}

	private static function verifyTypeFile($mime, $typesFile): bool
	{
		foreach ($typesFile as $type) {
			if (self::$mime_types[$type] == $mime) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Show the form for creating a new resource.
	 * @param $url
	 * @param $idSection
	 */
	protected static function deleteFile($url, $idSection)
	{
		Storage::disk("public")->delete($url);
		$arrStr = explode("/", $url);
		DB::table("all_files")
			->where([["name", $arrStr[count($arrStr) - 1]], ["parent", $idSection]])
			->delete();
	}
}
