/* eslint-disable no-nested-ternary */

// 숫자를 두 자리로 맞추기 위해 0을 패딩하는 함수
const padZero = (num: number): string => num.toString().padStart(2, "0");

// 시간 형식이 올바른지 확인하는 함수
const validateTimeFormat = (time: string): void => {
	if (!/^\d{1,2}(:\d{2})?$/.test(time.trim())) {
		throw new Error("잘못된 시간 형식입니다. 올바른 형식은 'hh:mm' 또는 'hh'입니다.");
	}
};

// 시간과 분이 유효한 범위 내에 있는지 확인하는 함수
const validateTimeRange = (hour: number, minute: number): void => {
	if (hour < 0 || hour > 23) {
		throw new Error(`시간은 0에서 23 사이여야 합니다. 입력된 시간: ${hour}`);
	}
	if (minute < 0 || minute > 59) {
		throw new Error(`분은 0에서 59 사이여야 합니다. 입력된 시간: ${hour}`);
	}
};

// 시간 문자열을 파싱하여 시간과 분을 반환하는 함수
const parseTime = (time: string): { hour: number; minute: number } => {
	const [hourStr, minuteStr] = time.trim().split(":");
	const hour = Number(hourStr);
	const minute = minuteStr ? Number(minuteStr) : 0; // 분이 없으면 0으로 설정
	return { hour, minute };
};

/**
 * 12시간 형식의 시간을 24시간 형식으로 변환하는 함수
 * @param time - 'hh:mm' 또는 'hh' 형식의 시간 문자열
 * @param isAm - true이면 오전, false이면 오후로 간주
 * @returns 24시간 형식의 시간 문자열
 * @throws 잘못된 시간 형식이나 범위, 또는 잘못된 AM/PM 설정일 경우 오류 발생
 */
const convertTo24HourFormat = (time: string, isAm: boolean): string => {
	validateTimeFormat(time);
	const { hour, minute } = parseTime(time);
	validateTimeRange(hour, minute);

	// 24시간 형식으로 변환
	const convertedHour = isAm ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;

	return `${padZero(convertedHour)}:${padZero(minute)}`;
};

/**
 * 24시간 형식의 시간을 12시간 형식으로 변환하는 함수
 * @param time - 'hh:mm' 또는 'hh' 형식의 시간 문자열
 * @returns 12시간 형식의 시간 문자열 (오전/오후 포함)
 * @throws 잘못된 시간 형식일 경우 오류 발생
 */
const convertTo12HourFormat = (time: string): string => {
	validateTimeFormat(time);
	const { hour, minute } = parseTime(time);

	// AM/PM 결정
	const isAm = hour < 12;
	const convertedHour = hour % 12 === 0 ? 12 : hour % 12;
	const period = isAm ? "오전" : "오후";

	return `${period} ${padZero(convertedHour)}:${padZero(minute)}`;
};

export { convertTo24HourFormat, convertTo12HourFormat };
