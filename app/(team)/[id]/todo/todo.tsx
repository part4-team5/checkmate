"use client";

import API from "@/app/_api";
import Calendar from "@/app/_components/Calendar";
import Button from "@/app/_components/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useOverlay from "@/app/_hooks/useOverlay";
import SideBarWrapper from "@/app/_components/sidebar";
import TodoDetail from "@/app/(team)/[id]/todo/todoDetail";
import { convertIsoToDateAndTime, convertIsoToDateToKorean } from "@/app/_utils/IsoToFriendlyDate";
import Image from "next/image";

type ClientTodoProps = {
	groupId: number;
	taskListId: number;
};

type FrequencyType = "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";
const frequency: Record<FrequencyType, string> = {
	DAILY: "매일 반복",
	WEEKLY: "매주 반복",
	MONTHLY: "매월 반복",
	ONCE: "반복 없음",
};

export default function ClientTodo({ groupId, taskListId }: ClientTodoProps) {
	const queryClient = useQueryClient();
	const pathname = usePathname();

	const [currentDate, setCurrentDate] = useState(new Date());
	const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
	const [currentTaskId, setCurrentTaskId] = useState<number>(taskListId);
	const overlay = useOverlay();

	const updateSearchParams = (name: string, value: number) => {
		setCurrentTaskId(value);
		window.history.pushState(null, "", `${pathname}?taskId=${value}`);
	};

	const { data: taskList } = useQuery({
		queryKey: ["tasks", { groupId }],
		queryFn: async () => {
			const response = API["{teamId}/groups/{id}"].GET({
				id: groupId,
			});
			return response;
		},
	});

	const tasks = taskList?.taskLists;
	/* eslint-disable no-restricted-syntax */
	const prefetch = () => {
		if (!tasks) return;
		for (const task of tasks) {
			queryClient.prefetchQuery({
				queryKey: ["tasks", { groupId, taskId: task.id, date: currentDate.toLocaleDateString("ko-KR") }],
				queryFn: async () => {
					const response = API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"].GET({
						groupId,
						taskListId: task.id,
						date: currentDate.toLocaleDateString("ko-KR"),
					});
					return response;
				},
			});
		}
	};
	const fetchTodos = async () => {
		const response = API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"].GET({
			groupId,
			taskListId: currentTaskId,
			date: currentDate.toLocaleDateString("ko-KR"),
		});
		return response;
	};

	const { data: todos } = useQuery({
		queryKey: ["tasks", { groupId, taskId: currentTaskId, date: currentDate.toLocaleDateString("ko-KR") }],
		queryFn: fetchTodos,
	});

	const handleCurrentDate = (date: Date) => {
		setCurrentDate(() => date);
	};

	const handleCalendarClick = () => {
		setIsCalendarOpen((prev) => !prev);
	};

	const handleTodoClick = (todoId: number) => {
		overlay.open(({ close }) => (
			<SideBarWrapper close={close}>
				<TodoDetail id={todoId} close={close} />
			</SideBarWrapper>
		));
	};

	/* eslint-disable jsx-a11y/click-events-have-key-events */
	/* eslint-disable jsx-a11y/interactive-supports-focus */
	/* eslint-disable jsx-a11y/click-events-have-key-events */
	/* eslint-disable jsx-a11y/no-static-element-interactions */
	return (
		<>
			<div className="my-6 flex justify-between">
				<Calendar onChange={(date) => handleCurrentDate(date)}>
					<div className="flex gap-3">
						<div className="flex items-center text-lg font-medium text-text-primary">
							<Calendar.Date>{(date) => convertIsoToDateToKorean(date)}</Calendar.Date>
						</div>
						<div className="flex gap-1">
							<Calendar.Jump to={{ unit: "day", times: -1 }}>
								<Image src="/icons/calendarLeftArrow.svg" alt="beforeDate" width={16} height={16} />
							</Calendar.Jump>
							<Calendar.Jump to={{ unit: "day", times: 1 }}>
								<Image src="/icons/calendarRightArrow.svg" alt="afterDate" width={16} height={16} />
							</Calendar.Jump>
						</div>
						<div className="relative flex items-center">
							<button type="button" onClick={handleCalendarClick} aria-label="Open calendar">
								<Image src="/icons/calendarCircle.svg" alt="calendar" width={24} height={24} />
							</button>
							{isCalendarOpen && (
								<div className="absolute bottom-[-230px] right-[-260px]">
									<Calendar.Picker />
								</div>
							)}
						</div>
					</div>
				</Calendar>
				<button type="button" className="text-brand-primary" aria-label="addtask">
					+새로운 목록 추가하기
				</button>
			</div>
			<div className="flex gap-3 text-lg font-medium">
				{tasks &&
					tasks.map((task) => (
						<button
							className={`${task.id === currentTaskId ? "text-text-primary underline" : "text-text-default"}`}
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
						const { date, time } = convertIsoToDateAndTime(todo.date); // 날짜 변환
						return (
							<div
								className="flex w-full flex-col gap-[11px] rounded-lg bg-background-secondary px-[14px] py-3 hover:bg-background-tertiary"
								key={todo.id}
								onClick={() => handleTodoClick(todo.id)}
							>
								<div className="flex items-center justify-between">
									<div className="flex gap-3">
										<button type="button" aria-label="todo-done">
											{todo.doneAt ? (
												<Image src="/icons/checkBox.svg" alt="done" width={24} height={24} />
											) : (
												<Image src="/icons/uncheckBox.svg" alt="not done" width={24} height={24} />
											)}
										</button>
										<div>{todo.name}</div>
										<div className="flex items-center justify-center gap-1 text-xs font-normal text-text-default">
											<Image src="/icons/comment.svg" alt="comment" width={16} height={16} />
											{todo.commentCount}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-5 text-xs font-normal text-text-default">
									<div className="flex gap-[6px]">
										<Image src="/icons/calendar.svg" alt="calendar" width={16} height={16} />
										<div>{date}</div>
									</div>
									<div className="flex items-center gap-[6px]">
										<Image src="/icons/clock.svg" alt="time" width={16} height={16} />
										<div>{time}</div>
									</div>
									<div className="flex items-center gap-[6px]">
										<Image src="/icons/cycles.svg" alt="frequency" width={16} height={16} />
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
