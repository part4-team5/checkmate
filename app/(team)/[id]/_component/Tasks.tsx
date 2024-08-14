/* eslint-disable jsx-a11y/control-has-associated-label, react/button-has-type */

"use client";

import CircularProgressBar from "@/app/(team)/[id]/_component/CircularProgressBar";
import { useState, useCallback } from "react";
import Icon from "@/app/_icons";
import { useQuery } from "@tanstack/react-query";
import API from "@/app/_api";
import { ReportProps } from "./Report";

type Team = Awaited<ReturnType<(typeof API)["{teamId}/groups/{id}"]["GET"]>>;

type TaskList = {
	id: number;
	name: string;
	tasks: { doneAt: string | null }[];
};

type TaskItemProps = {
	taskList: TaskList;
	index: number;
};

// 색상 클래스 반환 함수
function getColorClass(index: number) {
	// 사용할 색상 배열
	const colors = ["bg-[#A855F7]", "bg-[#3B82F6]", "bg-[#06B6D4]", "bg-[#EC4899]"];

	// 인덱스를 colors 배열의 길이로 나눈 나머지로 색상 순환
	return colors[index % colors.length];
}

function TaskItem({ taskList, index }: TaskItemProps) {
	const totalTasks = taskList.tasks.length;
	const completedTasks = taskList.tasks.filter((task) => task.doneAt !== null).length;
	const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

	return (
		<main className="flex w-full rounded-[12px] bg-background-secondary">
			{/* 색상바 */}
			<div className={`${getColorClass(index)} w-2 rounded-l-lg`} />
			<section className="flex h-[40px] w-full items-center justify-between">
				<div className="pl-2 text-white">{taskList.name}</div>
				<div className="flex w-[78px] items-center justify-center gap-[4px]">
					<div className="flex h-[25px] w-[58px] items-center justify-center gap-[4px] rounded-[12px] bg-[#0F172A]">
						<CircularProgressBar percent={completionRate} size={10} strokeWidth={2} backgroundColor="#FFFFFF" useGradient={false} strokeColor="#10B981" />{" "}
						<p className="text-[12px] text-[#10B981]">
							{completedTasks}/{totalTasks}
						</p>
					</div>
					<button className="mr-[8px]">
						<Icon.Kebab color="#64748B" width={16} height={16} />
					</button>
				</div>
			</section>
		</main>
	);
}

export default function Tasks({ id }: ReportProps) {
	const [maxHeight, setMaxHeight] = useState(208);
	const [isExpanded, setIsExpanded] = useState(false); // 높이 확장 여부
	const itemHeight = 208; // 각 아이템의 높이

	const fetchGroupInfo = useCallback((): Promise<Team> => API["{teamId}/groups/{id}"].GET({ id }), [id]);

	const { data, isLoading, error } = useQuery<Team>({
		queryKey: ["groupInfo", id],
		queryFn: fetchGroupInfo,
		enabled: !!id,
		refetchInterval: 60000,
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading data</div>;

	const taskLists = data?.taskLists || [];
	const totalHeight = taskLists.length * itemHeight;

	// 버튼 클릭 시 높이를 증가/감소시키는 함수
	const handleToggleHeight = () => {
		if (isExpanded) {
			// 확장된 상태에서 버튼을 누르면 원래 크기로 줄어듦
			setMaxHeight(208);
		} else {
			// 축소된 상태에서 버튼을 누르면 전체 리스트를 표시하도록 확장
			setMaxHeight(totalHeight);
		}
		setIsExpanded(!isExpanded); // 확장 상태 반전
	};

	return (
		<main>
			<section className="mt-[24px] flex justify-between">
				<div className="flex justify-between gap-[8px]">
					<p>할 일 목록</p>
					<p>({taskLists.length}개)</p>
				</div>
				<button type="button" aria-label="Add Task List">
					할 일 목록 추가
				</button>
			</section>
			<section className="mt-[16px]">
				<div
					className="flex flex-col gap-[16px] overflow-hidden overflow-y-auto scrollbar:w-2 scrollbar:bg-background-primary scrollbar-thumb:bg-background-tertiary"
					style={{ maxHeight: `${maxHeight}px`, transition: "max-height 0.3s ease" }}
				>
					{taskLists.map((taskList, index) => (
						<TaskItem key={taskList.id} taskList={taskList} index={index} />
					))}
				</div>
			</section>
			<button
				type="button"
				onClick={handleToggleHeight}
				aria-label={isExpanded ? "Collapse" : "Expand"}
				className={`mx-auto mt-[10px] flex w-[70px] transform items-center justify-center rounded-[4px] bg-background-secondary transition-transform duration-300 ${
					isExpanded ? "rotate-180" : "rotate-0"
				}`}
			>
				<Icon.ArrowDown width={20} height={20} />
			</button>
		</main>
	);
}
