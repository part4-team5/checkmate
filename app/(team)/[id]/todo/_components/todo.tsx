"use client";

import API from "@/app/_api";
import Calendar from "@/app/_components/Calendar";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useOverlay from "@/app/_hooks/useOverlay";
import SideBarWrapper from "@/app/_components/sidebar";
import { convertIsoToDateToKorean } from "@/app/_utils/IsoToFriendlyDate";
import tasksKey from "@/app/(team)/[id]/todo/_components/api/queryFactory";
import Popover from "@/app/_components/Popover";
import TodoItem from "@/app/(team)/[id]/todo/_components/TodoItem";
import { useGetGroupList, useGetTodoItems } from "@/app/(team)/[id]/todo/_components/api/useQuery";
import AddTaskModal from "@/app/(team)/[id]/todo/_components/AddTask";
import TodoDetail from "@/app/(team)/[id]/todo/_components/todoDetail";
import { useDeleteTodoMutation, useTodoOrderMutation, useToggleTodoStatusMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import { Reorder, motion } from "framer-motion";
import AddTodo from "@/app/(team)/[id]/todo/_components/AddTodo";
import Icon from "@/app/_icons";
import Tour from "@/app/_utils/Tour";

type ClientTodoProps = {
	groupId: number;
	taskListId: number;
};

function CalendarPopoverContent() {
	return (
		<div className="shadow-lg absolute rounded">
			<Calendar.Picker />
		</div>
	);
}

type TaskListType = Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"]["GET"]>>;
export default function ClientTodo({ groupId, taskListId }: ClientTodoProps) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [currentTaskId, setCurrentTaskId] = useState<number>(taskListId);
	const queryClient = useQueryClient();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const overlay = useOverlay();
	const { data: groupList } = useGetGroupList(groupId);
	const { data: todoItems, isLoading: isTodoItemsLoading } = useGetTodoItems(groupId, currentTaskId, currentDate);
	const todoPatchMutation = useToggleTodoStatusMutation(groupId, currentTaskId, currentDate);
	const todoOrderMutation = useTodoOrderMutation();
	const todoDeleteMutation = useDeleteTodoMutation(groupId, currentTaskId, currentDate);
	const containerRef = useRef(null);
	const tasks = groupList?.taskLists;

	useEffect(() => {
		const taskIdFromURL = searchParams.get("taskId");
		if (taskIdFromURL && Number(taskIdFromURL) !== currentTaskId) {
			setCurrentTaskId(Number(taskIdFromURL));
		}
	}, [searchParams]);

	const updateSearchParams = (value: number) => {
		if (value === currentTaskId) return;
		setCurrentTaskId(value);
		window.history.pushState(null, "", `${pathname}?taskId=${value}`);
	};

	const handleCurrentDate = (date: Date) => {
		setCurrentDate(() => date);
	};

	const handleToggleTodoStatus = (todoId: number, doneAt: string) => {
		todoPatchMutation.mutate({ taskId: todoId, done: !doneAt });
	};

	const handleTodoDelete = (todoId: number) => {
		todoDeleteMutation.mutate(todoId);
	};

	const handleAddTaskClick = () => {
		overlay.open(({ close }) => <AddTaskModal close={close} groupId={groupId} />);
	};

	const handleTodoClick = (gid: number, taskId: number, todoId: number, date: Date, doneAt: string) => {
		overlay.open(({ close }) => (
			<SideBarWrapper close={close}>
				<TodoDetail todoId={todoId} currentTaskId={taskId} close={close} currentDate={date} groupId={gid} doneAt={doneAt} />
			</SideBarWrapper>
		));
	};

	useEffect(() => {
		Tour.play([
			{
				query: "#daypicker",
				content: "원하는 날짜를 골라 해당 날짜에 할 일을 볼 수 있어요.",
				position: "bottom",
			},
			{
				query: "#left",
				content: "이전 날짜로 이동할 수 있어요.",
				position: "bottom",
			},
			{
				query: "#right",
				content: "다음 날짜로 이동할 수 있어요.",
				position: "bottom",
			},
			{
				query: "#calendar",
				content: "원하는 날짜를 선택할 수 있는 달력이 있어요.",
				position: "bottom",
			},
			{
				query: "#addTaskButton",
				content: "새로운 할 일 목록을 추가할 수 있어요.",
				position: "bottom",
			},
			{
				query: "#tasks",
				content: "할 일 목록을 선택할 수 있어요.",
				position: "bottom",
			},
			{
				query: "#addtodo",
				content: "할 일을 추가할 수 있어요.",
				position: "top",
			},
		]);
	}, []);

	const handleReorder = (ReorderItems: TaskListType) => {
		queryClient.setQueryData<TaskListType>(tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")), ReorderItems);
	};

	const handleDragEnd = (todoItem: TaskListType[number]) => {
		if (!todoItems) return;
		// 변경한 순서를 순회
		for (let index = 0; index < todoItems.length; index += 1) {
			const item = todoItems[index];
			// 잡은 요소와 일치하는지
			if (todoItem.id === item.id) {
				todoOrderMutation.mutate({ taskListId: currentTaskId, todoId: item.id, displayIndex: index });
				break; // 일치하는 항목을 찾으면 순회를 종료
			}
		}
	};

	const buttonAnimation = {
		whileTap: {
			scale: 0.8,
		},
		hover: {
			scale: 1.1,
		},
	};

	return (
		<>
			<div className="my-6 flex justify-between" ref={containerRef}>
				<Calendar onChange={(date) => handleCurrentDate(date)}>
					<div className="flex gap-3" id="daypicker">
						<div className="flex min-w-[98px] items-center text-lg font-medium text-text-primary">
							<Calendar.Date>{(date) => convertIsoToDateToKorean(date)}</Calendar.Date>
						</div>
						<div className="flex gap-2">
							<Calendar.Jump to={{ unit: "day", times: -1 }}>
								<motion.div id="left" whileTap={buttonAnimation.whileTap} whileHover={buttonAnimation.hover} className="rounded-full shadow-loginButton">
									<Icon.CalendarLeftArrow width={20} height={20} />
								</motion.div>
							</Calendar.Jump>
							<Calendar.Jump to={{ unit: "day", times: 1 }}>
								<motion.div id="right" whileTap={buttonAnimation.whileTap} whileHover={buttonAnimation.hover} className="rounded-full shadow-loginButton">
									<Icon.CalendarRightArrow width={20} height={20} />
								</motion.div>
							</Calendar.Jump>
						</div>
						<div className="relative flex h-fit w-fit items-center">
							<Popover
								gapX={6} // X축 간격 조절
								gapY={-3} // Y축 간격 조절
								anchorOrigin={{ vertical: "top", horizontal: "right" }}
								overlayOrigin={{ vertical: "top", horizontal: "left" }}
								overlay={CalendarPopoverContent}
							>
								<div className="flex items-center">
									<button type="button" aria-label="Open calendar">
										<motion.div
											id="calendar"
											whileHover={buttonAnimation.hover}
											whileTap={buttonAnimation.whileTap}
											className="rounded-full shadow-loginButton"
										>
											<Icon.CalendarButton width={24} height={24} />
										</motion.div>
									</button>
								</div>
							</Popover>
						</div>
					</div>
				</Calendar>
				<motion.button
					onClick={handleAddTaskClick}
					type="button"
					className="text-brand-primary"
					aria-label="addtask"
					whileHover={{ scale: 1.07 }}
					whileTap={{ scale: 0.95 }}
					transition={{ type: "spring", stiffness: 300 }}
					id="addTaskButton"
				>
					+새로운 목록 추가하기
				</motion.button>
			</div>

			<motion.div
				id="tasks"
				className="layout layoutRoot flex flex-wrap gap-3 overflow-x-scroll rounded-lg bg-background-secondary px-5 py-3 text-lg font-medium shadow-listPage scrollbar-hide tablet:px-8"
				style={{ maxHeight: "calc(2 * (2rem + 6px))", flexWrap: "wrap" }} // 2줄까지만 내려갈 수 있도록 maxHeight 설정
			>
				{tasks &&
					tasks.map((task) => (
						<motion.div
							whileHover={buttonAnimation.hover}
							layout
							className="relative cursor-pointer rounded-md p-1"
							key={task.id}
							onClick={() => updateSearchParams(task.id)}
						>
							<motion.span className={task.id === currentTaskId ? "text-text-primary" : "text-text-secondary"}>{task.name}</motion.span>
							{task.id === currentTaskId && (
								<motion.div
									layoutId="underline"
									className="absolute bottom-0 left-0 right-0 h-[2px] bg-text-primary" // 밑줄 두께를 줄임
									initial={{ opacity: 0, translateY: 10 }}
									animate={{ opacity: 1, translateY: 0 }}
									exit={{ opacity: 0, translateY: 10 }}
									transition={{
										type: "spring",
										stiffness: 500,
										damping: 30,
										duration: 0.3,
									}}
								/>
							)}
						</motion.div>
					))}
			</motion.div>

			{isTodoItemsLoading && (
				<div>
					{Array.from({ length: 5 }).map((_, i) => (
						/* eslint-disable react/no-array-index-key */
						<motion.div
							key={i}
							className="mt-4 flex h-[75px] w-full flex-col gap-[11px] rounded-lg bg-background-secondary px-[14px] py-3 shadow-listPage"
							initial={{ opacity: 0.2 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: 0.2, // 빠르고 간결한 애니메이션 속도
								ease: "easeInOut",
							}}
						>
							<div className="h-3 w-28 rounded-sm bg-background-tertiary" />
							<div className="h-3 w-48 rounded-sm bg-background-tertiary" />
						</motion.div>
					))}
				</div>
			)}

			{todoItems && (
				<div className="mt-6 rounded-lg bg-background-secondary px-3 py-2 shadow-board tablet:px-9 tablet:py-8">
					<Reorder.Group values={todoItems} onReorder={(e) => handleReorder(e)} className="mb-44">
						{todoItems.map((todoItem) => (
							<Reorder.Item
								id="todoItem"
								value={todoItem}
								key={todoItem.id}
								onDragEnd={() => handleDragEnd(todoItem)}
								whileHover={{ scale: 1.015 }}
								whileTap={{ boxShadow: "0px 0px 15px rgba(0,0,0,0.2)" }}
								dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
								dragConstraints={{
									top: -150,
									left: -150,
									right: 150,
									bottom: 150,
								}}
							>
								<div className="mt-4 flex flex-col gap-4">
									<TodoItem
										key={todoItem.id}
										todoItem={todoItem}
										onToggleTodo={handleToggleTodoStatus}
										onTodoClick={handleTodoClick}
										onTodoDelete={handleTodoDelete}
										groupId={groupId}
										taskId={currentTaskId}
										currentDate={currentDate}
									/>
								</div>
							</Reorder.Item>
						))}
						{!isTodoItemsLoading && todoItems && todoItems.length === 0 && (
							<div className="h-vh mt-40 flex items-center justify-center text-text-default">
								<div className="text-center">
									아직 할 일이 없습니다.
									<br />
									새로운 할일을 추가해주세요.
								</div>
							</div>
						)}
					</Reorder.Group>
				</div>
			)}
			<AddTodo containerRef={containerRef} />
		</>
	);
}
