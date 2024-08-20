/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

"use client";

import CircularProgressBar from "@/app/(team)/[id]/_component/CircularProgressBar";
import Icon from "@/app/_icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/_api";
import useOverlay from "@/app/_hooks/useOverlay";
import PostEditTasks from "@/app/_components/modal-contents/PostEditTasks";
import DeleteModal from "@/app/_components/modal-contents/DeleteModal";
import DropDown from "@/app/_components/Dropdown";
import Image from "next/image";
import ToastPopup from "@/app/(team)/[id]/_component/ToastPopup";
import { Reorder } from "framer-motion";

type Team = Awaited<ReturnType<(typeof API)["{teamId}/groups/{id}"]["GET"]>>;
type TaskListType = Team["taskLists"][number];

type TaskItemProps = {
	taskList: TaskListType;
	index: number;
	groupId: number;
	onEditTask: (name: string, id: number) => void;
};

function getColorClass(index: number) {
	const colors = ["bg-[#A855F7]", "bg-[#3B82F6]", "bg-[#06B6D4]", "bg-[#EC4899]"];
	return colors[index % colors.length];
}

// TaskItem 컴포넌트
function TaskItem({ taskList, index, groupId, onEditTask }: TaskItemProps) {
	const totalTasks = taskList.tasks?.length ?? 0;
	const completedTasks = taskList.tasks?.filter((task) => task.doneAt !== null).length ?? 0;
	const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
	const overlay = useOverlay();
	const queryClient = useQueryClient();
	const [showToast, setShowToast] = useState(false);
	const router = useRouter();
	const isLongPress = useRef(false);
	const timerId = useRef<NodeJS.Timeout>();

	// 할 일 목록 삭제
	const deleteMutation = useMutation({
		mutationFn: async () =>
			API["{teamId}/groups/{groupId}/task-lists/{id}"].DELETE({
				id: taskList.id,
			}),
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ["groupInfo", groupId],
				exact: true,
			});
			const previousGroupInfo = queryClient.getQueryData<{ taskLists: TaskListType[] }>(["groupInfo", groupId]);

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
			if (context?.previousGroupInfo) {
				queryClient.setQueryData(["groupInfo", groupId], context.previousGroupInfo);
			}
			setShowToast(true);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["groupInfo", groupId],
				exact: true,
			});
		},
	});

	// 수정 및 삭제 드롭다운
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

	const handleMouseDown = () => {
		isLongPress.current = false;
		timerId.current = setTimeout(() => {
			isLongPress.current = true;
		}, 100);
	};

	const handleMouseUp = () => {
		clearTimeout(timerId.current);
		if (!isLongPress.current) {
			router.push(`/${groupId}/todo?taskId=${taskList.id}`);
		}
	};

	return (
		<>
			{showToast && <ToastPopup message="삭제에 실패했습니다. 다시 한 번 시도해주세요." position="bottom" />}
			<main className="flex w-full cursor-pointer rounded-[12px] bg-background-secondary" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
				<div className={`${getColorClass(index)} w-2 flex-shrink-0 rounded-l-lg`} />
				<section className="flex h-[40px] w-full items-center justify-between">
					<div className="max-w-[500px] truncate pl-2 text-white">{taskList.name}</div>
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
							className="mr-[8px] rounded-[4px] hover:bg-[#3F4752]"
						>
							<DropDown options={editDropdown} gapY={-20} gapX={19} align="RR">
								<Icon.Kebab color="#64748B" width={16} height={16} />
							</DropDown>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}

// Tasks 컴포넌트
export default function Tasks({ id }: { id: number }) {
	const queryClient = useQueryClient();
	const overlay = useOverlay();
	const [isListExpanded, setIsListExpanded] = useState(false);

	const fetchGroupInfo = useCallback(async (): Promise<Team> => {
		const data = await API["{teamId}/groups/{id}"].GET({ id });
		return data;
	}, [id]);

	const { data, isLoading } = useQuery<Team>({
		queryKey: ["groupInfo", id],
		queryFn: fetchGroupInfo,
		enabled: !!id,
		refetchInterval: 60000,
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
	// 할 일 목록 순서 변경
	const reorderMutation = useMutation({
		mutationFn: async ({ taskListId, displayIndex }: { taskListId: number; displayIndex: string }) => {
			console.log("Mutation function called with:", { taskListId, displayIndex, groupId: id });
			return API["{teamId}/groups/{groupId}/task-lists/{id}/order"].PATCH(
				{
					groupId: id,
					id: taskListId,
				},
				{
					displayIndex,
				},
			);
		},
		onMutate: async ({ taskListId, displayIndex }) => {
			// 기존 쿼리 취소
			await queryClient.cancelQueries({ queryKey: ["groupInfo", id], exact: true });

			// 이전 상태 저장
			const previousTaskLists = queryClient.getQueryData<TaskListType[]>(["groupInfo", id]);

			if (Array.isArray(previousTaskLists)) {
				const newTaskLists = previousTaskLists.map((task) => (task.id === taskListId ? { ...task, displayIndex: Number(displayIndex) } : task));
				queryClient.setQueryData(["groupInfo", id], { ...data, taskLists: newTaskLists });
			}

			return { previousTaskLists }; // 이전 상태 반환
		},
	});

	// 목록 재정렬 시 핸들러
	const handleReorder = (newTaskLists: TaskListType[]) => {
		queryClient.setQueryData(["groupInfo", id], { ...data, taskLists: newTaskLists });
	};

	// 드래그 종료 시 핸들러
	const handleDragEnd = () => {
		console.log("Drag Ended");
		if (!data) return;

		try {
			const updatedTaskLists = data.taskLists.map((taskList, index) => ({
				...taskList,
				displayIndex: index,
			}));

			console.log("Updated Task Lists:", updatedTaskLists);

			updatedTaskLists.forEach((taskList) => {
				console.log("Before calling mutate for task:", taskList.id, "with displayIndex:", taskList.displayIndex);

				reorderMutation.mutate({
					taskListId: taskList.id,
					displayIndex: taskList.displayIndex.toString(),
				});
			});
		} catch (error) {
			console.error("Error in handleDragEnd:", error);
		}
	};

	const handleToggleHeight = () => {
		setIsListExpanded((prevState) => !prevState);
	};

	const handlePostTasksClick = (taskId: number | null = null) => {
		overlay.open(({ close }) => <PostEditTasks groupId={id} close={close} taskId={taskId} />);
	};

	const handleEditTasksClick = (taskName: string = "", taskId: number | null = null) => {
		overlay.open(({ close }) => <PostEditTasks groupId={id} close={close} initialTasksName={taskName} taskId={taskId} />);
	};

	if (isLoading) return <div>Loading...</div>;

	return (
		<main>
			<section className="mt-[24px] flex justify-between">
				<div className="flex justify-between gap-[8px]">
					<p className="text-[16px] font-medium">할 일 목록</p>
					<p className="text-[16px] text-[#64748B]">({data?.taskLists?.length ?? 0}개)</p>
				</div>
				<button onClick={() => handlePostTasksClick()} type="button" aria-label="Add Task List" className="text-[14px] font-normal text-brand-primary">
					+ 할 일 목록 추가
				</button>
			</section>
			<section className="mt-[16px]">
				{data?.taskLists?.length === 0 ? (
					<div className="flex justify-center py-[64px] text-[#64748B]">
						<p>아직 할 일 목록이 없습니다.</p>
					</div>
				) : (
					<Reorder.Group
						axis="y"
						className="flex min-h-[208px] flex-col gap-[16px] overflow-hidden overflow-y-auto scrollbar:w-2 scrollbar:bg-background-primary scrollbar-thumb:bg-background-tertiary"
						style={{
							maxHeight: isListExpanded ? "none" : "208px",
							transition: "max-height 0.3s ease",
						}}
						values={data?.taskLists ?? []}
						onReorder={handleReorder}
					>
						{data?.taskLists.map((taskList, index) => (
							<Reorder.Item key={taskList.id} value={taskList} id={taskList.id.toString()} style={{ cursor: "pointer" }} onDragEnd={handleDragEnd}>
								<TaskItem key={taskList.id} taskList={taskList} index={index} groupId={id} onEditTask={handleEditTasksClick} />
							</Reorder.Item>
						))}
					</Reorder.Group>
				)}
			</section>
			{(data?.taskLists?.length ?? 0) > 4 && (
				<button
					type="button"
					onClick={handleToggleHeight}
					aria-label={isListExpanded ? "Collapse" : "Expand"}
					className={`mx-auto mt-[10px] flex w-[70px] transform items-center justify-center rounded-[4px] bg-background-secondary transition-transform duration-300 ${
						isListExpanded ? "rotate-180" : "rotate-0"
					}`}
				>
					<Icon.ArrowDown width={20} height={20} />
				</button>
			)}
		</main>
	);
}
