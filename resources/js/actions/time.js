export function getLocaleDateTime(timeEditing, format = "full") {
	if (timeEditing) {
		let times;
		switch (format) {
			case "server":
				times = timeEditing;
				return (
					addZero(times.getFullYear()) + "-" + addZero(times.getMonth() + 1) + "-" + addZero(times.getDate())
				);
			case "time":
				times = new Date(timeEditing + "Z");
				return times.toLocaleTimeString();
			case "date":
				times = new Date(timeEditing + "Z");
				return times.toLocaleDateString();
			case "full":
				times = new Date(timeEditing + "Z");
				return times.toLocaleString();
			default:
				times = new Date(timeEditing + "Z");
				return times.toString();
		}
	} else {
		return "error time";
	}
}

function addZero(num) {
	if (num >= 0 && num <= 9) {
		return "0" + num;
	} else {
		return num;
	}
}
