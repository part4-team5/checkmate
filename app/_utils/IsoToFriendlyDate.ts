export const convertIsoToDateAndTime = (isoString: string) => {
	// ISO 8601 문자열을 Date 객체로 변환
	const date = new Date(isoString);

	// 날짜 및 시간 정보를 추출
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
	const day = date.getDate();
	let hours = date.getHours();
	const minutes = date.getMinutes();

	// 오전/오후 구분 및 시간 포맷 설정
	const period = hours < 12 ? "오전" : "오후";
	if (hours > 12) {
		hours -= 12; // 12시간제로 변환
	} else if (hours === 0) {
		hours = 12; // 오전 0시는 오전 12시로 변환
	}

	// 분 단위를 항상 두 자리로 포맷
	const formattedMinutes = minutes.toString().padStart(2, "0");

	// 포맷된 문자열 생성
	const formattedDate = `${year}년 ${month}월 ${day}일`;
	const formattedTime = `${period} ${hours}:${formattedMinutes}`;

	return { date: formattedDate, time: formattedTime };
};

export const convertIsoToDateToKorean = (date: Date): string => {
	// 날짜 포맷 지정
	const options: Intl.DateTimeFormatOptions = {
		month: "numeric",
		day: "numeric",
		weekday: "short",
	};
	const formattedDate = date.toLocaleDateString("ko-KR", options);
	// '5월 18일 (월)' 형식으로 변환
	const [month, day, weekday] = formattedDate.split(" ");
	// 결과 문자열 구성
	return `${month.slice(0, -1)}월 ${day.slice(0, -1)}일 ${weekday}`;
};
