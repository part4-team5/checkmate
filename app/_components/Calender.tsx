"use client";

import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/public/icons/ArrowRightIcon";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface CalenderProps extends React.PropsWithChildren {
	onChange?: (value: Date) => void;
}

interface CalenderContext {
	date: Date;
	setDate: (value: Date) => void;
}

const CTX = createContext<CalenderContext>({ date: new Date(), setDate() {} });

export default function Calender({ children, onChange }: Readonly<CalenderProps>) {
	const [date, setDate] = useState(new Date());

	useEffect(() => {
		onChange?.(date);
	}, [date, onChange]);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	return <CTX.Provider value={{ date, setDate }}>{children}</CTX.Provider>;
}

function useCTX() {
	const ctx = useContext(CTX);

	if (!ctx) throw new Error();

	return ctx;
}

Calender.Date = function Date({ children }: Readonly<{ children: (value: Date) => React.ReactNode }>) {
	const ctx = useCTX();

	return children(ctx.date);
};

Calender.Jump = function Jump({
	to,
	children,
}: Readonly<React.PropsWithChildren & { to: "-year" | "-month" | "-week" | "-day" | "+day" | "+week" | "+month" | "+year" | Date }>) {
	const ctx = useCTX();

	const onClick = useCallback(() => {
		switch (to) {
			case "-year": {
				ctx.setDate(new Date(ctx.date.getFullYear() - 1, ctx.date.getMonth(), ctx.date.getDate()));
				break;
			}
			case "-month": {
				ctx.setDate(new Date(ctx.date.getFullYear(), ctx.date.getMonth() - 1, ctx.date.getDate()));
				break;
			}
			case "-week": {
				ctx.setDate(new Date(ctx.date.getFullYear(), ctx.date.getMonth(), ctx.date.getDate() - 7));
				break;
			}
			case "-day": {
				ctx.setDate(new Date(ctx.date.getFullYear(), ctx.date.getMonth(), ctx.date.getDate() - 1));
				break;
			}
			case "+day": {
				ctx.setDate(new Date(ctx.date.getFullYear(), ctx.date.getMonth(), ctx.date.getDate() + 1));
				break;
			}
			case "+week": {
				ctx.setDate(new Date(ctx.date.getFullYear(), ctx.date.getMonth(), ctx.date.getDate() - 7));
				break;
			}
			case "+month": {
				ctx.setDate(new Date(ctx.date.getFullYear(), ctx.date.getMonth() + 1, ctx.date.getDate()));
				break;
			}
			case "+year": {
				ctx.setDate(new Date(ctx.date.getFullYear() + 1, ctx.date.getMonth(), ctx.date.getDate()));
				break;
			}
			default: {
				ctx.setDate(to);
				break;
			}
		}
	}, [to, ctx]);

	return (
		<button type="button" onClick={onClick}>
			{children}
		</button>
	);
};

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

Calender.Picker = function Picker() {
	const ctx = useCTX();

	const [date, setDate] = useState(ctx.date);

	useEffect(() => {
		setDate(ctx.date);
	}, [ctx.date]);

	const days = useMemo(() => {
		const impl = [] as Date[];

		const [prev, start, end, next] = [
			new Date(date.getFullYear(), date.getMonth(), 0),
			new Date(date.getFullYear(), date.getMonth(), 1),
			new Date(date.getFullYear(), date.getMonth() + 1, 0),
			new Date(date.getFullYear(), date.getMonth() + 1, 1),
		];
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < start.getDay(); i++) {
			impl.unshift(new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - i));
		}
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < end.getDate(); i++) {
			impl.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
		}
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < 6 - end.getDay(); i++) {
			impl.push(new Date(next.getFullYear(), next.getMonth(), next.getDate() + i));
		}
		return impl;
	}, [date]);

	const prev = useCallback(() => {
		setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
	}, [date]);

	const next = useCallback(() => {
		setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
	}, [date]);

	const style = useCallback(
		(value: Date) => {
			const impl: React.CSSProperties = {};

			if (value.getMonth() !== date.getMonth()) {
				impl.color = "#64748B";
			} else {
				// :3
				const today = new Date();

				if (value.getFullYear() === today.getFullYear() && value.getMonth() === today.getMonth() && value.getDate() === today.getDate()) {
					impl.color = "#10B981";
				}
			}
			return impl;
		},
		[date],
	);

	return (
		<div className="inline-block rounded-[24px] bg-background-secondary px-[16px] py-[16px] text-text-primary">
			<div className="flex h-[34px] items-center justify-between">
				<button type="button" aria-label="prev" onClick={prev} className="mx-[4px] aspect-square rounded-[6px] hover:bg-background-tertiary">
					<ArrowLeftIcon width={24} height={24} color="white" />
				</button>
				<div>
					{date.getFullYear()}년 {date.getMonth() + 1}월
				</div>
				<button type="button" aria-label="next" onClick={next} className="mx-[4px] aspect-square rounded-[6px] hover:bg-background-tertiary">
					<ArrowRightIcon width={24} height={24} color="white" />
				</button>
			</div>
			<table className="table-auto">
				<thead>
					<tr>
						{DAYS.map((day, i) => (
							// eslint-disable-next-line react/no-array-index-key
							<th key={i} className="h-[32px] w-[32px] px-0 py-0 text-md font-semibold">
								{day}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{new Array(days.length / DAYS.length).fill(null).map((_, x) => {
						// cache
						const delta = x * DAYS.length;

						return (
							// eslint-disable-next-line react/no-array-index-key
							<tr key={x}>
								{new Array(DAYS.length).fill(null).map((__, y) => {
									// cache
									const cell = days[delta + y];

									return (
										// eslint-disable-next-line react/no-array-index-key
										<td key={y} className="rounded-[12px] px-0 py-0 hover:bg-brand-primary">
											<button
												type="button"
												style={style(cell)}
												onClick={() => ctx.setDate(cell)}
												className="h-[32px] w-[32px] text-md font-medium hover:text-background-secondary"
											>
												{cell.getDate()}
											</button>
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};