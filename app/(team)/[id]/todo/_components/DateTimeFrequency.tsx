import Image from "next/image";

type DateTimeFrequencyProps = {
	date: string;
	frequency: string;
};

export default function DateTimeFrequency({ date, frequency }: DateTimeFrequencyProps) {
	return (
		<div className="flex items-center text-xs font-normal text-text-default">
			<div className="flex gap-[6px]">
				<Image src="/icons/calendar.svg" alt="calendar" width={16} height={16} />
				<div>{date}</div>
			</div>
			<div className="flex items-center gap-[6px] px-[10px]">
				<div className="h-2 border-l" />
			</div>
			<div className="flex items-center gap-[6px]">
				<Image src="/icons/cycles.svg" alt="frequency" width={16} height={16} />
				{frequency}
			</div>
		</div>
	);
}
