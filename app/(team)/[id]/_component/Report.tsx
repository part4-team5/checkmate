"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import TodoIcon from "@/public/icons/TodoIcon.svg";
import DoneIcon from "@/public/icons/DoneIcon.svg";
import API from "@/app/_api";
import { useParams } from "next/navigation";
import CircularProgressBar from "./CircularProgressBar";

type Team = Awaited<ReturnType<(typeof API)["{teamId}/groups/{id}"]["GET"]>>;

const fetchGroupInfo = async (groupId: string): Promise<Team> => {
	try {
		const response = await API["{teamId}/groups/{id}"].GET({ id: groupId });
		return response;
	} catch (error) {
		console.error("그룹 정보 조회 실패:", error);
		throw error;
	}
};

function Report() {
	const { id } = useParams();
	const [groupId] = Array.isArray(id) ? id : [id];

	const { data, isLoading, error } = useQuery<Team>({
		queryKey: ["groupInfo", groupId],
		queryFn: () => fetchGroupInfo(groupId!),
		enabled: !!groupId,
		refetchInterval: 60000,
		staleTime: 10000,
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>오류 발생: {error.message}</div>;

	let totalTasks = 0;
	let doneTasks = 0;

	if (data) {
		data.taskLists.forEach((taskList) => {
			totalTasks += taskList.tasks.length;
			doneTasks += taskList.tasks.filter((task) => task.doneAt !== null).length;
		});
	}

	const percent = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

	return (
		<main className="flex items-center justify-between rounded-[12px] bg-background-secondary p-[24px] text-[#F8FAFC]">
			<section className="flex items-center justify-center gap-[45px]">
				<div className="relative">
					<CircularProgressBar percent={percent} />
					<div className="absolute inset-0 flex flex-col items-center justify-center tablet:hidden">
						<p className="text-[12px] font-medium">오늘</p>
						<p className="from-text-emerald to-text-lime bg-gradient-to-r bg-clip-text text-[20px] font-bold text-transparent">{percent.toFixed(0)}%</p>
					</div>
				</div>
				<div className="flex hidden flex-col items-start justify-center tablet:block">
					<p className="text-14px font-medium">
						오늘의 <br /> 진행 상황
					</p>
					<p className="from-text-emerald to-text-lime h-[48px] bg-gradient-to-r bg-clip-text text-[40px] font-bold text-transparent">{percent.toFixed(0)}%</p>
				</div>
			</section>
			<section className="flex flex-col gap-[16px]">
				<div className="flex w-[142px] items-center justify-between rounded-[12px] bg-background-tertiary p-[16px] tablet:w-[280px] desktop:w-[400px]">
					<div>
						<p className="text-[12px] font-medium">오늘의 할 일</p>
						<p className="text-text-lime text-[24px] font-bold">{totalTasks}개</p>
					</div>
					<Image src={TodoIcon} alt="todo" width={40} height={40} />
				</div>
				<div className="flex w-[142px] items-center justify-between rounded-[12px] bg-background-tertiary p-[16px] tablet:w-[280px] desktop:w-[400px]">
					<div>
						<p className="text-[12px] font-medium">한 일</p>
						<p className="text-text-lime text-[24px] font-bold">{doneTasks}개</p>
					</div>
					<Image src={DoneIcon} alt="done" width={40} height={40} />
				</div>
			</section>
		</main>
	);
}

export default Report;
