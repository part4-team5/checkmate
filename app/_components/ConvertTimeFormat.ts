/* eslint-disable no-nested-ternary */
const padZero = (num: number) => (num < 10 ? `0${num}` : num);

const convertTo24HourFormat = (time: string, isAm: boolean) => {
	const [hour, minute] = time.split(":").map(Number);
	const convertedHour = isAm ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
	return `${padZero(convertedHour)}:${padZero(minute)}`;
};

const convertTo12HourFormat = (time: string) => {
	const [hour, minute] = time.split(":").map(Number);
	const isAm = hour < 12 || hour === 24;
	const convertedHour = hour % 12 === 0 ? 12 : hour % 12;
	const period = isAm ? "오전" : "오후";
	return `${period} ${padZero(convertedHour)}:${padZero(minute)}`;
};

export { convertTo24HourFormat, convertTo12HourFormat };
