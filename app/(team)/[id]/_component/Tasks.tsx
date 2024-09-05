/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import CircularProgressBar from "@/app/(team)/[id]/_component/CircularProgressBar";
import Icon from "@/app/_icons";
import Tour from "@/app/_utils/Tour";
import PostEditTasks from "@/app/_components/modal-contents/PostEditTasks";
import DeleteModal from "@/app/_components/modal-contents/DeleteModal";
import { useRouter } from "next/navigation";
import useOverlay from "@/app/_hooks/useOverlay";
import { useQueryClient } from "@tanstack/react-query";
import toast from "@/app/_utils/Toast";
import { useGroupInfo, useDeleteTaskList, useReorderTaskLists, TaskListType } from "./useTaskList";

function TaskItem({
	taskList,
	groupId,
	onEditTask,
	onDrag,
}: {
	taskList: TaskListType;
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

	const [isKebabOpen, setIsKebabOpen] = useState(false); // 케밥 메뉴 상태 관리
	const kebabRef = useRef<HTMLDivElement>(null); // 케밥 메뉴 참조

	const handleMouseDown = (event: React.MouseEvent) => {
		if (event.button === 2) return; // 우클릭 방지
		isLongPress.current = false;
		timerId.current = setTimeout(() => {
			isLongPress.current = true;
		}, 100);
	};

	const handleMouseUp = (event: React.MouseEvent) => {
		if (event.button === 2) return; // 우클릭 방지
		clearTimeout(timerId.current);
		if (!isLongPress.current && event.button === 0) {
			const target = event.target as HTMLElement;
			if (target.closest(".no-navigation")) return; // 특정 요소에서만 클릭 허용
			router.push(`/${groupId}/todo?taskId=${taskList.id}`);
		}
	};

	// 케밥 메뉴 열고 닫기
	const handleKebabClick = useCallback((event: React.MouseEvent) => {
		event.stopPropagation();
		setIsKebabOpen((prev) => !prev);
	}, []);

	const handleEditClick = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
			onEditTask(taskList.name, taskList.id);
			setIsKebabOpen(false);
		},
		[onEditTask, taskList.name, taskList.id],
	);

	const handleDeleteClick = useCallback(
		(event: React.MouseEvent) => {
			event.stopPropagation();
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
			setIsKebabOpen(false);
		},
		[overlay],
	);

	const handleDelete = useCallback(() => {
		deleteTaskListMutation.mutate(taskList.id, {
			onError: () => {
				toast.error("삭제에 실패했습니다. 다시 한 번 시도해주세요.");
			},
		});
	}, [deleteTaskListMutation, taskList.id]);

	// 케밥 메뉴 외부 클릭 시 메뉴 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (kebabRef.current && !kebabRef.current.contains(event.target as Node)) {
				setIsKebabOpen(false); // 외부 클릭 시 메뉴 닫기
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside); // 이벤트 리스너 정리
		};
	}, [kebabRef]);

	return (
		<div
			className="reorder-item flex h-[50px] w-full cursor-pointer items-center justify-center rounded-[12px] bg-background-quaternary pr-[10px] text-text-primary shadow-teamTaskList"
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onContextMenu={(e) => e.preventDefault()} // 우클릭 방지
			onDrag={onDrag}
		>
			<div className="flex h-[40px] w-full flex-1 items-center justify-between">
				<div className="truncate pl-4 text-text-primary">{taskList.name}</div>
				<div className="relative flex items-center justify-center gap-[4px]" ref={kebabRef}>
					<div className="no-navigation flex h-[25px] w-[60px] items-center justify-center gap-[4px] rounded-[12px] bg-[#10B981] px-2">
						{completedTasks === totalTasks && totalTasks !== 0 ? (
							<Icon.DoneCheck height={16} width={16} color="#ffffff" />
						) : (
							<CircularProgressBar percent={completionRate} size={20} strokeWidth={5} backgroundColor="#FFFFFF" useGradient={false} strokeColor="#EAB308" />
						)}
						<p className="text-[12px] text-text-primary">
							{completedTasks}/{totalTasks}
						</p>
					</div>

					{/* 케밥 아이콘 클릭 시 애니메이션으로 수정/삭제 버튼 나타나기 */}
					<div className="no-navigation flex items-center justify-center">
						{!isKebabOpen ? (
							<div onClick={handleKebabClick} className="rounded-[4px] hover:bg-[#3F4752]">
								<Icon.Kebab color="var(--text-primary)" width={16} height={16} />
							</div>
						) : (
							<AnimatePresence>
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									transition={{ duration: 0.2 }}
									className="flex items-center justify-center gap-[8px]"
								>
									<div onClick={handleEditClick} className="cursor-pointer rounded-[4px] pl-[5px]">
										<Icon.Pencil width={16} height={16} color="var(--text-primary)" /> {/* 수정 아이콘 */}
									</div>
									<div onClick={handleDeleteClick} className="cursor-pointer rounded-[4px]">
										<Icon.TrashCan width={16} height={16} color="var(--text-primary)" /> {/* 삭제 아이콘 */}
									</div>
								</motion.div>
							</AnimatePresence>
						)}
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

	const scrollIntervalRef = useRef<number | null>(null); // 스크롤 인터벌 관리 레퍼런스

	const handleReorder = (newTaskLists: TaskListType[]) => {
		queryClient.setQueryData(["groupInfo", { groupId: id }], { ...data, taskLists: newTaskLists });
	};

	const handleEditTasksClick = (taskName: string = "", taskId: number | null = null) => {
		overlay.open(({ close }) => <PostEditTasks groupId={id} close={close} initialTasksName={taskName} taskId={taskId} />);
	};

	// 드래그 중 스크롤 처리
	const handleDrag = (e: any) => {
		const scrollContainer = e.target.closest(".scroll-container");
		if (!scrollContainer) return;

		const { top: containerTop, bottom: containerBottom } = scrollContainer.getBoundingClientRect();
		const { top: elementTop, bottom: elementBottom } = e.target.getBoundingClientRect();

		const scrollSpeed = 30;

		const startScroll = (direction: "up" | "down") => {
			if (scrollIntervalRef.current) return; // 이미 스크롤 중일 때 중복 실행 방지

			scrollIntervalRef.current = window.setInterval(() => {
				if (direction === "up") {
					scrollContainer.scrollBy({
						top: -scrollSpeed,
						behavior: "smooth",
					});
				} else if (direction === "down") {
					scrollContainer.scrollBy({
						top: scrollSpeed,
						behavior: "smooth",
					});
				}
			}, 100); // 100ms마다 스크롤
		};

		if (elementTop < containerTop) {
			startScroll("up"); // 위로 스크롤
		} else if (elementBottom > containerBottom) {
			startScroll("down"); // 아래로 스크롤
		} else if (scrollIntervalRef.current) {
			// 범위를 벗어나지 않으면 스크롤 중단
			clearInterval(scrollIntervalRef.current);
			scrollIntervalRef.current = null;
		}
	};

	const handleDragEnd = (taskList: TaskListType) => {
		// 드래그 종료 시 스크롤 중지
		if (scrollIntervalRef.current) {
			clearInterval(scrollIntervalRef.current);
			scrollIntervalRef.current = null;
		}

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

	useEffect(() => {
		if (!isLoading) {
			Tour.play([
				{
					query: ".report-me",
					content: "오늘의 진척도를 확인할 수 있어요",
					position: "right",
				},
				{
					query: ".add-task",
					content: "이곳을 눌러서 새로운 할일을 추가할 수 있어요",
					position: "left",
				},
				{
					query: ".todo-items",
					content: "할 일 목록을 Drag & Drop으로 재정렬할 수 있어요.",
					position: "bottom",
				},
				{
					query: ".my-member",
					content: "멤버들을 이곳에서 조회할 수 있어요",
					position: "right",
				},
				{
					query: ".add-member",
					content: "이곳을 눌러서 새로운 멤버를 초대할 수 있어요",
					position: "left",
				},
			]);
		}
	}, [isLoading]);

	return (
		<section>
			<section className="mt-[24px] flex max-h-[425px] w-full justify-between text-text-primary tablet:w-full">
				<div className="flex justify-between gap-[8px]">
					<p className="text-[16px] font-semibold">할 일 목록</p>
					<p className="text-[16px]">({data?.taskLists?.length ?? 0}개)</p>
				</div>
				<button
					onClick={() => handleEditTasksClick()}
					type="button"
					aria-label="Add Task List"
					className="add-task text-[14px] font-semibold text-brand-primary"
				>
					+ 할 일 목록 추가
				</button>
			</section>
			<section className="todo-items mt-[16px] min-h-[427px] rounded-[12px] bg-background-tertiary p-[30px] shadow-teamCard tablet:w-full">
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
						onDrag={handleDrag}
					>
						{data?.taskLists.map((taskList) => (
							<Reorder.Item
								key={taskList.id}
								value={taskList}
								id={taskList.id.toString()}
								style={{ cursor: "pointer" }}
								onDragEnd={() => handleDragEnd(taskList)}
								onDrag={handleDrag}
								className="reorder-item"
							>
								<TaskItem key={taskList.id} taskList={taskList} groupId={id} onEditTask={handleEditTasksClick} onDrag={handleDrag} />
							</Reorder.Item>
						))}
					</Reorder.Group>
				)}
			</section>
		</section>
	);
}
