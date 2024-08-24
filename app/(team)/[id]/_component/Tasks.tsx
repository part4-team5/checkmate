/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

"use client";

import { useState, useRef } from "react";
import { Reorder } from "framer-motion";
import CircularProgressBar from "@/app/(team)/[id]/_component/CircularProgressBar";
import Icon from "@/app/_icons";
import Image from "next/image";
import DropDown from "@/app/_components/Dropdown";
import PostEditTasks from "@/app/_components/modal-contents/PostEditTasks";
import DeleteModal from "@/app/_components/modal-contents/DeleteModal";
import { useRouter } from "next/navigation";
import useOverlay from "@/app/_hooks/useOverlay";
import { useQueryClient } from "@tanstack/react-query";
import toast from "@/app/_utils/Toast";
import { useGroupInfo, useDeleteTaskList, useReorderTaskLists, TaskListType } from "./useTaskList";

function getColorClass(index: number) {
	const colors = ["bg-[#A855F7]", "bg-[#3B82F6]", "bg-[#06B6D4]", "bg-[#EC4899]"];
	return colors[index % colors.length];
}

function TaskItem({
	taskList,
	index,
	groupId,
	onEditTask,
	onDrag,
}: {
	taskList: TaskListType;
	index: number;
	groupId: number;
	onEditTask: (name: string, id: number) => void;
	onDrag: (e: any) => void;
}) {
	const totalTasks = taskList.tasks?.length ?? 0;
	const completedTasks = taskList.tasks?.filter((task) => task.doneAt !== null).length ?? 0;
	const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
	const overlay = useOverlay();
	const router = useRouter();
	const isLongPress = useRef(false);
	const timerId = useRef<NodeJS.Timeout>();

	const deleteTaskListMutation = useDeleteTaskList(groupId);

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

	const handleDropdownClick = (event: React.MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();
	};

	const handleDelete = () => {
		deleteTaskListMutation.mutate(taskList.id, {
			onError: () => {
				toast.error("삭제에 실패했습니다. 다시 한 번 시도해주세요.");
			},
		});
	};

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
							handleDelete();
							close();
						}}
					/>
				));
			},
		},
	];

	return (
		<section
			className="flex w-full cursor-pointer rounded-[12px] bg-background-secondary"
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onDrag={onDrag} // onDrag 이벤트 핸들러 추가
		>
			<div className={`${getColorClass(index)} w-2 flex-shrink-0 rounded-l-lg`} />
			<div className="flex h-[40px] w-full items-center justify-between">
				<div className="max-w-[500px] truncate pl-2 text-white">{taskList.name}</div>
				<div className="flex w-[78px] items-center justify-center gap-[4px]" onClick={(e) => e.stopPropagation()}>
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
					<div onClick={handleDropdownClick} className="mr-[8px] rounded-[4px] hover:bg-[#3F4752]">
						<DropDown options={editDropdown} gapY={-20} gapX={19} align="RR">
							<Icon.Kebab color="#64748B" width={16} height={16} />
						</DropDown>
					</div>
				</div>
			</div>
		</section>
	);
}

export default function Tasks({ id }: { id: number }) {
	const overlay = useOverlay();
	const [isListExpanded, setIsListExpanded] = useState(false);

	const queryClient = useQueryClient();
	const { data, isLoading } = useGroupInfo(id);
	const reorderMutation = useReorderTaskLists(id);

	const handleReorder = (newTaskLists: TaskListType[]) => {
		queryClient.setQueryData(["groupInfo", { groupId: id }], { ...data, taskLists: newTaskLists });
	};

	const handleDragEnd = (taskList: TaskListType) => {
		if (!data?.taskLists) return;

		for (let index = 0; index < data.taskLists.length; index += 1) {
			const item = data.taskLists[index];
			if (taskList.id === item.id) {
				reorderMutation.mutate({
					taskListId: item.id,
					displayIndex: index.toString(),
				});
				break;
			}
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

	const handleDrag = (e: any) => {
		const scrollContainer = e.target.closest(".scroll-container");
		if (!scrollContainer) return;

		const { top, bottom } = scrollContainer.getBoundingClientRect();
		const scrollThreshold = 50; // 스크롤이 시작될 위치
		const scrollSpeed = 30; // 스크롤 속도
		// 현재 마우스 위치가 컨테이너의 상단 근처에 있는지 확인
		if (e.clientY < top + scrollThreshold) {
			scrollContainer.scrollBy({
				top: -scrollSpeed,
				behavior: "smooth",
			});
		}

		// 현재 마우스 위치가 컨테이너의 하단 근처에 있는지 확인
		if (e.clientY > bottom - scrollThreshold) {
			scrollContainer.scrollBy({
				top: scrollSpeed,
				behavior: "smooth",
			});
		}
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
						className="scroll-container flex min-h-[208px] flex-col gap-[16px] overflow-y-auto scrollbar-hide"
						style={{
							maxHeight: isListExpanded ? "none" : "208px",
							transition: "max-height 0.3s ease",
						}}
						values={data?.taskLists ?? []}
						onReorder={handleReorder}
					>
						{data?.taskLists.map((taskList, index) => (
							<Reorder.Item
								key={taskList.id}
								value={taskList}
								id={taskList.id.toString()}
								style={{ cursor: "pointer" }}
								onDragEnd={() => handleDragEnd(taskList)}
								onDrag={handleDrag} // onDrag 이벤트 핸들러 추가
							>
								<TaskItem key={taskList.id} taskList={taskList} index={index} groupId={id} onEditTask={handleEditTasksClick} onDrag={handleDrag} />
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
