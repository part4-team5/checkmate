"use client";

import API from "@/app/_api";
import Calendar from "@/app/_components/Calendar";
// import Button from "@/app/_components/Button";
// import useCookie from "@/app/_hooks/useCookie";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type ClientTodoProps = {
	groupId: number;
	taskId: number;
};

export default function ClientTodo({ groupId, taskId }: ClientTodoProps) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// const [refreshToken, setRefreshToken] = useCookie<string>("refreshToken");

	const queryClient = useQueryClient();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [currentDate, setCurrentDate] = useState(new Date());
	const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
	// const handleRefreshToken = () => {
	// 	const newToken =
	// 		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsInRlYW1JZCI6IjYtNSIsInNjb3BlIjoicmVmcmVzaCIsImlhdCI6MTcyMjgzNDYyNywiZXhwIjoxNzIzNDM5NDI3LCJpc3MiOiJzcC1jb3dvcmtlcnMifQ.dhJygJkbDxxs9ObsZaEiOo64QizFB-XS2KOjjti7Hqo";
	// 	setRefreshToken(newToken);
	// };

	const { data: taskList, isLoading } = useQuery({
		queryKey: ["taskList", { groupId }],
		queryFn: async () => {
			const response = API["{teamId}/groups/{id}"].GET({
				id: groupId,
			});
			return response;
		},

		staleTime: 1000 * 60,
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

	const handleCurrentDate = (date: Date) => {
		setCurrentDate(date);
	};

	const handleCalendarClick = () => {
		setIsCalendarOpen((prev) => !prev);
	};

	if (isLoading) return <div>로딩중...</div>;

	return (
		<>
			{/* <div className="fixed right-2 top-2 flex flex-col gap-3">
				<Button onClick={handleRefreshToken}>토큰받기</Button>
			</div> */}
			<div className="my-6 flex justify-between">
				<Calendar onChange={(date) => handleCurrentDate(date)}>
					<div className="flex gap-3">
						<div className="flex items-center text-lg font-medium">
							<Calendar.Date>{(date) => formatDate(date)}</Calendar.Date>
						</div>
						<div className="flex gap-1">
							<Calendar.Jump to={{ unit: "day", times: -1 }}>전날</Calendar.Jump>
							<Calendar.Jump to={{ unit: "day", times: 1 }}>다음날</Calendar.Jump>
						</div>
						<div className="relative flex items-center">
							<button type="button" onClick={handleCalendarClick} aria-label="Open calendar">
								캘린더 열기
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
			{tasks &&
				tasks.map((task) => (
					<button type="button" key={task.id} onMouseEnter={prefetch} onClick={() => updateSearchParams("taskId", task.id)}>
						{task.name}
					</button>
				))}
			<div>{todos && todos.map((todo) => todo.name)}</div>
		</>
	);
}
