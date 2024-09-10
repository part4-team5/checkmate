/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import API from "@/app/_api";

import Icon from "@/app/_icons";

import useOverlay from "@/app/_hooks/useOverlay";

import { convertIsoToDateAndTime } from "@/app/_utils/IsoToFriendlyDate";

import DateTimeFrequency from "@/app/(team)/[id]/todo/_components/DateTimeFrequency";

const DeleteModal = dynamic(() => import("@/app/_components/modals/modal-containers/Delete"));

type FrequencyType = "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";

const frequency: Record<FrequencyType, string> = {
	DAILY: "매일 반복",
	WEEKLY: "매주 반복",
	MONTHLY: "매월 반복",
	ONCE: "반복 없음",
};

type TodoList = Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"]["GET"]>>;
type Todo = TodoList[number];
type TodoItemProps = {
	todoItem: Todo;
	groupId: number;
	currentDate: Date;
	taskId: number;
	onToggleTodo: (todoId: number, doneAt: string) => void;
	onTodoClick: (groupId: number, taskId: number, todoId: number, date: Date, doneAt: string) => void;
	onTodoDelete: (todoId: number) => void;
};

export default function TodoItem({ taskId, todoItem, groupId, currentDate, onToggleTodo, onTodoClick, onTodoDelete }: TodoItemProps) {
	const [isLongPress, setIsLongPress] = useState(false);
	const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const overlay = useOverlay();

	const handleTodoDelete = (todoId: number, name: string) => {
		overlay.open(({ close }) => <DeleteModal onClick={() => onTodoDelete(todoId)} close={close} modalName={name} modalContent="삭제하시겠습니까?" />);
	};
	const handleMouseDown = () => {
		setIsLongPress(false);
		const id = setTimeout(() => {
			setIsLongPress(true);
			setIsDragging(true); // Long press 시 드래그 상태로 전환
		}, 200); // 200ms 이상 눌리면 long press로 간주
		setTimerId(id);
	};

	const handleMouseUp = () => {
		if (timerId) {
			clearTimeout(timerId);
			setTimerId(null);
		}
		setIsDragging(false); // 마우스를 뗄 때 드래그 상태 종료
	};

	const { date } = convertIsoToDateAndTime(todoItem.date); // 날짜 변환
	return (
		<div
			className={`flex w-full justify-between rounded-lg bg-background-tertiary px-[14px] py-3 shadow-listPage hover:bg-background-tertiary ${
				isDragging ? "cursor-grabbing" : "cursor-pointer"
			}`}
			key={todoItem.id}
			onClick={(e) => {
				e.stopPropagation();
				if (isLongPress) return;
				onTodoClick(groupId, taskId, todoItem.id, currentDate, todoItem.doneAt);
			}}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			<div className="flex flex-col gap-[11px]">
				<div className="flex items-center justify-between">
					<div className="flex gap-3">
						<button
							id="todo-done"
							className="group relative"
							type="button"
							aria-label="todo-done"
							onClick={(event) => {
								event.stopPropagation();
								onToggleTodo(todoItem.id, todoItem.doneAt);
							}}
						>
							{todoItem.doneAt ? <Image src="/icons/checkBox.svg" alt="Todo status" width={24} height={24} /> : <Icon.UnCheckBox width={24} height={24} />}

							{/* 호버 시 나타나는 오버레이 */}
							<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-90">
								<Image src="/icons/checkBox.svg" alt="Preview" width={24} height={24} className="opacity-100" />
							</div>
						</button>
						<div className="group relative inline-block">
							<button type="button" className={`${todoItem.doneAt ? "line-through" : ""} text-text-primary`}>
								{todoItem.name}
							</button>

							{/* 툴팁 */}
							<div className="pointer-events-none absolute bottom-3/4 left-10 mb-2 w-max -translate-x-1/2 transform rounded bg-background-secondary p-2 text-sm text-text-primary opacity-0 shadow-board transition-opacity duration-200 ease-in-out group-hover:opacity-100">
								할일 상세 보기
							</div>
						</div>

						<div className="flex items-center justify-center gap-1 text-xs font-normal text-text-secondary">
							<Icon.CommentCount width={16} height={16} />
							{todoItem.commentCount}
						</div>
					</div>
				</div>
				<DateTimeFrequency date={date} frequency={frequency[todoItem.frequency]} />
			</div>
			<button
				id="todo-delete"
				className="pr-2"
				aria-label="할 일 삭제"
				type="submit"
				onClick={(event) => {
					event.stopPropagation();
					handleTodoDelete(todoItem.id, todoItem.name);
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<Icon.TodoDelete width={24} height={24} color={isHovered ? "#EF4444" : "var(--text-secondary)"} />
			</button>
		</div>
	);
}
