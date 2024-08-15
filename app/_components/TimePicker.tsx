/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";

export default function TimePicker({ onChange }: { onChange?: (time: string, isAm: boolean) => void }) {
	const [isAm, setIsAm] = useState(true);
	const [selectedTime, setSelectedTime] = useState("12:00");

	useEffect(() => {
		onChange?.(selectedTime, isAm);
	}, [selectedTime, onChange, isAm]);

	const generateTimes = () => {
		const times = [];
		for (let i = 1; i <= 12; i += 1) {
			const hour = i < 10 ? `0${i}` : i.toString();
			times.push(`${hour}:00`);
			times.push(`${hour}:30`);
		}
		return times;
	};

	const times = generateTimes();

	return (
		<div className="relative flex w-full gap-2 rounded-xl border border-border-primary p-4 text-text-default">
			<div className="mb-4 flex w-fit flex-col gap-2">
				<button
					type="button"
					className={`w-max rounded-xl px-4 py-2 text-md font-medium ${isAm ? "bg-brand-primary text-text-primary" : "bg-background-primary"} `}
					onClick={() => setIsAm(true)}
				>
					오전
				</button>
				<button
					type="button"
					className={`w-max rounded-xl px-4 py-2 text-md font-medium ${!isAm ? "bg-brand-primary text-text-primary" : "bg-background-primary"} `}
					onClick={() => setIsAm(false)}
				>
					오후
				</button>
			</div>

			<div className="max-h-48 w-full overflow-y-auto pr-2 scrollbar:w-2 scrollbar:rounded-full scrollbar:bg-background-primary scrollbar-thumb:rounded-full scrollbar-thumb:bg-background-tertiary">
				{times.map((time) => (
					<div
						key={time}
						className={`cursor-pointer rounded-xl p-2 ${time === selectedTime ? "text-green-500" : ""} ${selectedTime.includes(time) ? "bg-brand-primary text-text-primary" : ""}`}
						onClick={() => setSelectedTime(time)}
					>
						{time}
					</div>
				))}
			</div>
		</div>
	);
}
