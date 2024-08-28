/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

"use client";

import { useRef, useEffect } from "react";
import { Reorder } from "framer-motion";
import CircularProgressBar from "@/app/(team)/[id]/_component/CircularProgressBar";
import Icon from "@/app/_icons";
import Tour from "@/app/_utils/Tour";

import DropDown from "@/app/_components/Dropdown";
import Image from "next/image";
import PostEditTasks from "@/app/_components/modal-contents/PostEditTasks";
import DeleteModal from "@/app/_components/modal-contents/DeleteModal";
import { useRouter } from "next/navigation";
import useOverlay from "@/app/_hooks/useOverlay";
import { useQueryClient } from "@tanstack/react-query";
import toast from "@/app/_utils/Toast";
import { useGroupInfo, useDeleteTaskList, useReorderTaskLists, TaskListType } from "./useTaskList";

function TaskItem({
	taskList,
	index, // eslint-disable-line @typescript-eslint/no-unused-vars
	groupId,
	onEditTask,
	onDrag,
	isLastItem,
}: {
	taskList: TaskListType;
	index: number;
	groupId: number;
	onEditTask: (name: string, id: number) => void;
	onDrag: (e: any) => void;
	isLastItem: boolean;
}) {
	const totalTasks = taskList.tasks?.length ?? 0;
	const completedTasks = taskList.tasks?.filter((task) => task.doneAt !== null).length ?? 0;
	const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
	const overlay = useOverlay();
	const router = useRouter();
	const isLongPress = useRef(false);
	const timerId = useRef<NodeJS.Timeout>();

	const deleteTaskListMutation = useDeleteTaskList(groupId);

	const handleMouseDown = (event: React.MouseEvent) => {
		// 우클릭일 경우 페이지 이동 방지
		if (event.button === 2) return;

		isLongPress.current = false;
		timerId.current = setTimeout(() => {
			isLongPress.current = true;
		}, 100);
	};

	const handleMouseUp = (event: React.MouseEvent) => {
		// 우클릭일 경우 페이지 이동 방지
		if (event.button === 2) return;

		clearTimeout(timerId.current);
		if (!isLongPress.current && event.button === 0) {
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

	useEffect(() => {
		Tour.play([
			{
				query: ".report-me",
				content: "오늘의 진척도를 확인할 수 있어요",
				position: "right"
			},
			{
				query: ".add-task",
				content: "이곳을 눌러서 새로운 할일을 추가할 수 있어요",
				position: "left"
			},
			{
				query: ".reorder-item",
				content: "할 일 목록을 Drag & Drop으로 재정렬할 수 있어요.",
				position: "bottom",
			},
			{
				query: ".my-member",
				content: "멤버들을 이곳에서 조회할 수 있어요",
				position: "right"
			},
			{
				query: ".add-member",
				content: "이곳을 눌러서 새로운 멤버를 초대할 수 있어요",
				position: "left"
			}
		]);
	}, []);

	return (
		<div
			className="reorder-item flex h-[40px] w-full cursor-pointer rounded-[12px] bg-background-quaternary text-text-primary shadow-teamTaskList"
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onContextMenu={(e) => e.preventDefault()} // 우클릭 시 기본 메뉴 차단
			onDrag={onDrag} // onDrag 이벤트 핸들러 추가
		>
			<div className="flex h-[40px] w-full flex-1 items-center justify-between">
				<div className="truncate pl-4 text-text-primary">{taskList.name}</div>
				<div className="flex w-[78px] items-center justify-center gap-[4px]" onClick={(e) => e.stopPropagation()}>
					<div className="flex h-[25px] w-[58px] items-center justify-center gap-[4px] rounded-[12px] bg-[#10B981]">
						{completedTasks === totalTasks && totalTasks !== 0 ? (
							<Image src="/icons/DoneCheckIcon.svg" alt="Completed" height={16} width={16} />
						) : (
							<CircularProgressBar percent={completionRate} size={10} strokeWidth={2} backgroundColor="#FFFFFF" useGradient={false} strokeColor="#EAB308" />
						)}
						<p className="text-[12px] text-text-primary">
							{completedTasks}/{totalTasks}
						</p>
					</div>
					<div onClick={handleDropdownClick} className="mr-[8px] rounded-[4px] hover:bg-[#3F4752]">
						<DropDown options={editDropdown} gapY={isLastItem ? -80 : -20} gapX={15} align="RR">
							<Icon.Kebab color="var(--text-primary)" width={16} height={16} />
						</DropDown>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Tasks({ id }: { id: number }) {
	const overlay = useOverlay();

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
			<section className="mt-[24px] flex max-h-[425px] w-full justify-between text-text-primary tablet:w-full">
				<div className="flex justify-between gap-[8px]">
					<p className="text-[16px] font-semibold">할 일 목록</p>
					<p className="text-[16px]">({data?.taskLists?.length ?? 0}개)</p>
				</div>
				<button onClick={() => handlePostTasksClick()} type="button" aria-label="Add Task List" className="add-task text-[14px] font-semibold text-brand-primary">
					+ 할 일 목록 추가
				</button>
			</section>
			<section className="mt-[16px] min-h-[427px] rounded-[12px] bg-background-tertiary p-[30px] tablet:w-full">
				{data?.taskLists?.length === 0 ? (
					<div className="flex justify-center py-[64px] text-text-primary">
						<p>아직 할 일 목록이 없습니다.</p>
					</div>
				) : (
					<Reorder.Group
						axis="y"
						className="scroll-container flex h-[363px] flex-col gap-[16px] overflow-y-auto p-[15px] text-text-primary scrollbar-hide"
						values={data?.taskLists ?? []}
						onReorder={handleReorder}
						onDrag={handleDrag} // onDrag 이벤트 핸들러 추가
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
								<TaskItem
									key={taskList.id}
									taskList={taskList}
									index={index}
									groupId={id}
									onEditTask={handleEditTasksClick}
									onDrag={handleDrag}
									isLastItem={index === data.taskLists.length - 1} // 마지막 요소인지 판단
								/>
							</Reorder.Item>
						))}
					</Reorder.Group>
				)}
			</section>
		</main>
	);
}
