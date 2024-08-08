"use client";

import API from "@/app/_api";
import Calendar from "@/app/_components/Calendar";
import Button from "@/app/_components/Button";
import useCookie from "@/app/_hooks/useCookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useOverlay from "@/app/_hooks/useOverlay";
import AddTask from "@/app/(team)/[id]/todo/AddTask";

type ClientTodoProps = {
	groupId: number;
	taskId: number;
};

type FrequencyType = "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";
const frequency: Record<FrequencyType, string> = {
	DAILY: "매일 반복",
	WEEKLY: "매주 반복",
	MONTHLY: "매월 반복",
	ONCE: "반복 없음",
};

export default function ClientTodo({ groupId, taskId }: ClientTodoProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [refreshToken, setRefreshToken] = useCookie<string>("refreshToken");

	const queryClient = useQueryClient();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
	const overlay = useOverlay();

	const { data: taskList, isLoading } = useQuery({
		queryKey: ["taskList", { groupId }],
		queryFn: async () => {
			const response = API["{teamId}/groups/{id}"].GET({
				id: groupId,
			});
			return response;
		},

		staleTime: 1000 * 30,
	});

	const tasks = taskList?.taskLists;
	/* eslint-disable no-restricted-syntax */
	const prefetch = () => {
		if (!tasks) return;
		for (const task of tasks) {
			queryClient.prefetchQuery({
				queryKey: ["tasks", { groupId, taskId: task.id, date: currentDate.toLocaleDateString("kr") }],
				queryFn: async () => {
					const response = API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"].GET({
						groupId,
						taskListId: task.id,
						date: currentDate.toISOString(),
					});
					return response;
				},
				staleTime: 1000 * 60,
			});
		}
	};

	const { data: todos } = useQuery({
		queryKey: ["tasks", { groupId, taskId, date: currentDate.toLocaleDateString("kr") }],
		queryFn: async () => {
			const response = API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"].GET({
				groupId,
				taskListId: taskId,
				date: currentDate.toISOString(),
			});
			return response;
		},
		staleTime: 1000 * 60,
	});

	const updateSearchParams = (name: string, value: number) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());
		newSearchParams.set(name, value.toString());
		router.push(`${pathname}?${newSearchParams.toString()}`);
	};

	const formatDate = (date: Date): string => {
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

	function dateTimeSplit(isoString: string) {
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

		// 포맷된 문자열 생성
		const formattedDate = `${year}년 ${month}월 ${day}일`;
		const formattedTime = `${period} ${hours}:${minutes}`;

		return { date: formattedDate, time: formattedTime };
	}

	const handleCurrentDate = (date: Date) => {
		setCurrentDate(date);
	};

	const handleCalendarClick = () => {
		setIsCalendarOpen((prev) => !prev);
	};

	const addTask = () => {
		overlay.open(({ close }) => (
			<AddTask
				onClick={() => {
					close();
				}}
				close={close}
			/>
		));
	};

	if (isLoading) return <div>로딩중...</div>;

	return (
		<>
			<div className="my-6 flex justify-between">
				<Calendar onChange={(date) => handleCurrentDate(date)}>
					<div className="flex gap-3">
						<div className="flex items-center text-lg font-medium">
							<Calendar.Date>{(date) => formatDate(date)}</Calendar.Date>
						</div>
						<div className="flex gap-1">
							<Calendar.Jump to={{ unit: "day", times: -1 }}>
								<img src="/icons/calendarLeftArrow.svg" alt="beforeDate" />
							</Calendar.Jump>
							<Calendar.Jump to={{ unit: "day", times: 1 }}>
								<img src="/icons/calendarRightArrow.svg" alt="afterDate" />
							</Calendar.Jump>
						</div>
						<div className="relative flex items-center">
							<button type="button" onClick={handleCalendarClick} aria-label="Open calendar">
								<img src="/icons/calendarCircle.svg" alt="calendar" />
							</button>
							{isCalendarOpen && (
								<div className="absolute bottom-[-230px] right-[-260px]">
									<Calendar.Picker />
								</div>
							)}
						</div>
					</div>
				</Calendar>
				<button onClick={addTask} type="button" className="text-brand-primary" aria-label="addtask">
					+새로운 목록 추가하기
				</button>
			</div>
			<div className="flex gap-3 text-lg font-medium">
				{tasks &&
					tasks.map((task) => (
						<button
							className={`${task.id === taskId ? "underline" : "text-text-default"}`}
							type="button"
							key={task.id}
							onMouseEnter={prefetch}
							onClick={() => updateSearchParams("taskId", task.id)}
						>
							{task.name}
						</button>
					))}
			</div>
			<div className="mt-4 flex flex-col gap-4">
				{todos &&
					todos.map((todo) => {
						const { date, time } = dateTimeSplit(todo.date); // 날짜 변환
						return (
							<div className="flex w-full flex-col gap-[11px] rounded-lg bg-background-secondary px-[14px] py-3 hover:bg-background-tertiary" key={todo.id}>
								<div className="flex items-center justify-between">
									<div className="flex gap-3">
										<button type="button" aria-label="todo-done">
											{todo.doneAt ? <img src="/icons/check.svg" alt="done" /> : <img src="/icons/uncheck.svg" alt="not done" />}
										</button>
										<div>{todo.name}</div>
										<div className="flex items-center justify-center gap-1 text-xs font-normal text-text-default">
											<img src="/icons/comment.svg" alt="comment" />
											{todo.commentCount}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-5 text-xs font-normal text-text-default">
									<div className="flex gap-[6px]">
										<img src="/icons/calendar.svg" alt="calendar" />
										<div>{date}</div>
									</div>
									<div className="flex items-center gap-[6px]">
										<img src="/icons/clock.svg" alt="time" />
										<div>{time}</div>
									</div>
									<div className="flex items-center gap-[6px]">
										<img src="/icons/cycles.svg" alt="frequency" />
										{frequency[todo.frequency]}
									</div>
								</div>
							</div>
						);
					})}
			</div>
			<div>
				<div className="fixed bottom-12 flex w-full max-w-[1233px] justify-end">
					<div className="h-[48px] w-[125px]">
						<Button rounded="full">+할 일 추가</Button>
					</div>
				</div>
			</div>
		</>
	);
}
