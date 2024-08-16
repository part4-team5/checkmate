/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

"use client";

import CircularProgressBar from "@/app/(team)/[id]/_component/CircularProgressBar";
import { useState, useCallback } from "react";
import Link from "next/link";
import Icon from "@/app/_icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/app/_api";
import useOverlay from "@/app/_hooks/useOverlay";
import PostEditTasks from "@/app/_components/modal-contents/PostEditTasks";
import DeleteModal from "@/app/_components/modal-contents/DeleteModal";
import DropDown from "@/app/_components/Dropdown";
import Image from "next/image";
import ToastPopup from "@/app/(team)/[id]/_component/ToastPopup"; // ToastPopup 컴포넌트 임포트
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
	groupId: number;
};

// 색상 클래스 반환 함수
function getColorClass(index: number) {
	// 사용할 색상 배열
	const colors = ["bg-[#A855F7]", "bg-[#3B82F6]", "bg-[#06B6D4]", "bg-[#EC4899]"];
	// 인덱스를 colors 배열의 길이로 나눈 나머지로 색상 순환
	return colors[index % colors.length];
}

// TasksItem 컴포넌트
function TaskItem({ taskList, index, groupId, onEditTask }: TaskItemProps & { onEditTask: (name: string, id: number) => void }) {
	const totalTasks = taskList.tasks?.length || 0;
	const completedTasks = taskList.tasks ? taskList.tasks.filter((task) => task.doneAt !== null).length : 0;
	const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
	const overlay = useOverlay();
	const queryClient = useQueryClient();
	const [showToast, setShowToast] = useState(false);

	const deleteMutation = useMutation({
		mutationFn: async () =>
			API["{teamId}/groups/{groupId}/task-lists/{id}"].DELETE({
				id: taskList.id,
			}),
		onMutate: async () => {
			// 캐시 쿼리 취소 (낙관적 업데이트시 최신 데이터 반영 목적)
			await queryClient.cancelQueries({
				queryKey: ["groupInfo", groupId],
				exact: true,
			});

			const previousGroupInfo = queryClient.getQueryData<{ taskLists: TaskList[] }>(["groupInfo", groupId]);

			// 해당 taskList를 UI에서 제거
			queryClient.setQueryData(["groupInfo", groupId], (oldData: any) => {
				if (!oldData?.taskLists) return oldData;

				const updatedTaskLists = oldData.taskLists.filter((taskListItem: any) => taskListItem.id !== taskList.id);

				return {
					...oldData,
					taskLists: updatedTaskLists,
				};
			});

			return { previousGroupInfo };
		},
		onError: (err, variables, context) => {
			// 에러 발생 시 이전 상태로 롤백
			if (context?.previousGroupInfo) {
				queryClient.setQueryData(["groupInfo", groupId], context.previousGroupInfo);
			}
			setShowToast(true);
		},
		onSettled: () => {
			// 성공 여부에 관계없이 데이터를 다시 가져옴
			queryClient.invalidateQueries({
				queryKey: ["groupInfo", groupId],
				exact: true,
			});
		},
	});

	const editDropdown = [
		{
			text: "수정하기",
			onClick: () => {
				onEditTask(taskList.name, taskList.id);
			},
		},
		{
			text: "삭제하기",
			onClick: () => {
				overlay.open(({ close }) => (
					<DeleteModal
						modalContent="할 일 목록을 삭제하시겠어요?"
						close={close}
						onClick={() => {
							deleteMutation.mutate();
							close();
						}}
					/>
				));
			},
		},
	];

	return (
		<>
			{showToast && <ToastPopup message="삭제에 실패했습니다. 다시 한 번 시도해주세요." position="bottom" />}
			<Link href={`/${groupId}/todo?taskId=${taskList.id}`} passHref>
				<main className="flex w-full cursor-pointer rounded-[12px] bg-background-secondary">
					<div className={`${getColorClass(index)} w-2 rounded-l-lg`} />
					<section className="flex h-[40px] w-full items-center justify-between">
						<div className="pl-2 text-white">{taskList.name}</div>
						<div className="flex w-[78px] items-center justify-center gap-[4px]">
							<div className="flex h-[25px] w-[58px] items-center justify-center gap-[4px] rounded-[12px] bg-[#0F172A]">
								{completedTasks === totalTasks && totalTasks !== 0 ? (
									<Image src="/icons/DoneCheckIcon.svg" alt="Completed" height={16} width={16} />
								) : (
									<CircularProgressBar percent={completionRate} size={10} strokeWidth={2} backgroundColor="#FFFFFF" useGradient={false} strokeColor="#10B981" />
								)}
								<p className="text-[12px] text-[#10B981]">
									{completedTasks}/{totalTasks}
								</p>
							</div>
							<div
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
								}}
								className="mr-[8px]"
							>
								<DropDown options={editDropdown} gapY={-20} gapX={19} align="RR">
									<Icon.Kebab color="#64748B" width={16} height={16} />
								</DropDown>
							</div>
						</div>
					</section>
				</main>
			</Link>
		</>
	);
}

// Tasks 컴포넌트
export default function Tasks({ id }: ReportProps) {
	const [maxHeight, setMaxHeight] = useState(208);
	const [isExpanded, setIsExpanded] = useState(false); // 높이 확장 여부
	const itemHeight = 208; // 각 아이템의 높이

	const overlay = useOverlay();

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

	const handlePostTasksClick = (taskId: number | null = null) => {
		overlay.open(({ close }) => <PostEditTasks groupId={id} close={close} taskId={taskId} />);
	};

	const handleEditTasksClick = (taskName: string = "", taskId: number | null = null) => {
		overlay.open(({ close }) => <PostEditTasks groupId={id} close={close} initialTasksName={taskName} taskId={taskId} />);
	};

	return (
		<main>
			<section className="mt-[24px] flex justify-between">
				<div className="flex justify-between gap-[8px]">
					<p className="text-[16px] font-medium">할 일 목록</p>
					<p className="text-[16px] text-[#64748B]">({taskLists.length}개)</p>
				</div>
				<button onClick={() => handlePostTasksClick()} type="button" aria-label="Add Task List" className="text-[14px] font-normal text-brand-primary">
					+ 할 일 목록 추가
				</button>
			</section>
			<section className="mt-[16px]">
				{taskLists.length === 0 ? (
					<div className="flex justify-center py-[64px] text-[#64748B]">
						<p>아직 할 일 목록이 없습니다.</p>
					</div>
				) : (
					<div
						className="flex flex-col gap-[16px] overflow-hidden overflow-y-auto scrollbar:w-2 scrollbar:bg-background-primary scrollbar-thumb:bg-background-tertiary"
						style={{ maxHeight: `${maxHeight}px`, transition: "max-height 0.3s ease" }}
					>
						{taskLists.map((taskList, index) => (
							<TaskItem key={taskList.id} taskList={taskList} index={index} groupId={id} onEditTask={handleEditTasksClick} />
						))}
					</div>
				)}
			</section>
			{/* 배열의 길이가 5 이상일 때만 버튼 렌더링 */}
			{taskLists.length > 4 && (
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
			)}
		</main>
	);
}
