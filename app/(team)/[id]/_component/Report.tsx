"use client";

import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import TodoIcon from "@/public/icons/TodoIcon.svg";
import DoneIcon from "@/public/icons/DoneIcon.svg";
import API from "@/app/_api";
import CircularProgressBar from "./CircularProgressBar";

type Team = Awaited<ReturnType<(typeof API)["{teamId}/groups/{id}"]["GET"]>>;

export interface ReportProps {
	id: string;
}

function Report({ id }: ReportProps) {
	const fetchGroupInfo = useCallback(
		(): Promise<Team> =>
			API["{teamId}/groups/{id}"]
				.GET({ id: Number(id) })
				.then((response) => response)
				.catch((error) => {
					console.error("그룹 정보 조회 실패:", error);
					throw error;
				}),

		[id],
	);

	const { data, isLoading, error } = useQuery<Team>({
		queryKey: ["groupInfo", id],
		queryFn: fetchGroupInfo,
		enabled: !!id,
		refetchInterval: 60000,
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>오류 발생: {error instanceof Error ? error.message : "Unknown error"}</div>;

	const { totalTasks, doneTasks } = (() => {
		let total = 0;
		let done = 0;

		if (data) {
			data.taskLists.forEach((taskList) => {
				total += taskList.tasks.length;
				done += taskList.tasks.filter((task) => task.doneAt !== null).length;
			});
		}

		return { totalTasks: total, doneTasks: done };
	})();

	const percent = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

	return (
		<main className="flex min-w-[375px] items-center justify-between rounded-[12px] bg-background-secondary p-[12px] text-[#F8FAFC] tablet:p-[24px]">
			<section className="flex items-center justify-center gap-[45px]">
				<div className="relative">
					<CircularProgressBar percent={percent} />
					<div className="absolute inset-0 flex flex-col items-center justify-center tablet:hidden">
						<p className="text-[12px] font-medium">오늘</p>
						<p className="bg-gradient-to-r from-text-emerald to-text-lime bg-clip-text text-[20px] font-bold text-transparent">{percent.toFixed(0)}%</p>
					</div>
				</div>
				<div className="flex hidden flex-col items-start justify-center tablet:block">
					<p className="text-14px font-medium">
						오늘의 <br /> 진행 상황
					</p>
					<p className="h-[48px] bg-gradient-to-r from-text-emerald to-text-lime bg-clip-text text-[40px] font-bold text-transparent">{percent.toFixed(0)}%</p>
				</div>
			</section>
			<section className="flex flex-col gap-[16px]">
				<div className="flex w-[142px] items-center justify-between rounded-[12px] bg-background-tertiary p-[16px] tablet:w-[280px] desktop:w-[400px]">
					<div>
						<p className="text-[12px] font-medium">오늘의 할 일</p>
						<p className="text-[24px] font-bold text-text-lime">{totalTasks}개</p>
					</div>
					<Image src={TodoIcon} alt="todo" width={40} height={40} />
				</div>
				<div className="flex w-[142px] items-center justify-between rounded-[12px] bg-background-tertiary p-[16px] tablet:w-[280px] desktop:w-[400px]">
					<div>
						<p className="text-[12px] font-medium">한 일</p>
						<p className="text-[24px] font-bold text-text-lime">{doneTasks}개</p>
					</div>
					<Image src={DoneIcon} alt="done" width={40} height={40} />
				</div>
			</section>
		</main>
	);
}

export default Report;
