import Icon from "@/app/_icons";

type DateTimeFrequencyProps = {
	date: string;
	frequency: string;
};

export default function DateTimeFrequency({ date, frequency }: DateTimeFrequencyProps) {
	return (
		<div className="flex items-center text-xs font-normal text-text-secondary">
			<div className="flex gap-[6px]">
				<Icon.Calendar width={16} height={16} />
				<div>{date}</div>
			</div>
			<div className="flex items-center gap-[6px] px-[10px]">
				<div className="h-2 border-l" />
			</div>
			<div className="flex items-center gap-[6px]">
				<Icon.Cycles width={16} height={16} />
				{frequency}
			</div>
		</div>
	);
}
