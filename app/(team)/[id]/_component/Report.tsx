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
	id: number;
}

function Report({ id }: ReportProps) {
	const fetchGroupInfo = useCallback((): Promise<Team> => API["{teamId}/groups/{id}"].GET({ id }), [id]);

	const { data, isLoading, error } = useQuery<Team>({
		queryKey: ["groupInfo", { groupId: id }],
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

		if (data && Array.isArray(data.taskLists)) {
			data.taskLists.forEach((taskList) => {
				const tasks = taskList.tasks || [];
				total += tasks.length;
				done += tasks.filter((task) => task.doneAt !== null).length;
			});
		} else {
			console.warn("Unexpected data structure:", data);
		}

		return { totalTasks: total, doneTasks: done };
	})();

	const percent = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

	return (
		<section className="report-me mt-[24px] w-full text-text-primary desktop:w-[383px]">
			<p className="mb-[16px] text-[16px] font-semibold text-text-primary">리포트</p>
			<div className="flex w-full flex-col items-center justify-between rounded-[12px]">
				<section className="flex h-[217px] w-full items-center justify-center gap-[45px] rounded-[12px] bg-background-tertiary shadow-teamCard">
					<div className="relative">
						<CircularProgressBar useGradient percent={percent} />
					</div>
					<div className="flex flex-col items-start justify-center tablet:block">
						<p className="text-[16px] font-bold text-text-primary">
							오늘의 <br /> 진행 상황
						</p>
						<p className="h-[48px] text-[40px] font-bold text-[#10B981]">{percent.toFixed(0)}%</p>
					</div>
				</section>
				<section className="mt-[21px] flex h-[84px] w-full flex-col gap-[21px] desktop:max-w-[385px]">
					<div className="flex items-center justify-between rounded-[12px] bg-background-tertiary p-[16px] shadow-teamCard">
						<div className="bg-background-tertiary">
							<p className="text-[12px] font-semibold">오늘의 할 일</p>
							<p className="text-[24px] font-bold text-text-lime">{totalTasks}개</p>
						</div>
						<Image src={TodoIcon} alt="todo" width={40} height={40} />
					</div>
					<div className="mb-[10px] flex h-[84px] w-full items-center justify-between rounded-[12px] bg-background-tertiary p-[16px] shadow-teamCard desktop:max-w-[385px]">
						<div>
							<p className="text-[12px] font-semibold">한 일</p>
							<p className="text-[24px] font-bold text-text-lime">{doneTasks}개</p>
						</div>
						<Image src={DoneIcon} alt="done" width={40} height={40} />
					</div>
				</section>
			</div>
		</section>
	);
}

export default Report;
