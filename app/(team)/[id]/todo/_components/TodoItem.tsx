import DateTimeFrequency from "@/app/(team)/[id]/todo/_components/DateTimeFrequency";
import API from "@/app/_api";
import { convertIsoToDateAndTime } from "@/app/_utils/IsoToFriendlyDate";
import Image from "next/image";

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
	onClick: (groupId: number, taskId: number, todoId: number, date: Date, doneAt: string) => void;
};

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

export default function TodoItem({ taskId, todoItem, groupId, currentDate, onToggleTodo, onClick }: TodoItemProps) {
	const { date, time } = convertIsoToDateAndTime(todoItem.date); // 날짜 변환
	return (
		<div
			className="flex w-full flex-col gap-[11px] rounded-lg bg-background-secondary px-[14px] py-3 hover:bg-background-tertiary"
			key={todoItem.id}
			onClick={() => onClick(groupId, taskId, todoItem.id, currentDate, todoItem.doneAt)}
		>
			<div className="flex items-center justify-between">
				<div className="flex gap-3">
					<button
						type="button"
						aria-label="todo-done"
						onClick={(event) => {
							event.stopPropagation();
							onToggleTodo(todoItem.id, todoItem.doneAt);
						}}
					>
						{todoItem.doneAt ? (
							<Image src="/icons/checkBox.svg" alt="done" width={24} height={24} />
						) : (
							<Image src="/icons/uncheckBox.svg" alt="not done" width={24} height={24} />
						)}
					</button>
					<div className={`${todoItem.doneAt ? "line-through" : ""} text-text-primary`}>{todoItem.name}</div>
					<div className="flex items-center justify-center gap-1 text-xs font-normal text-text-default">
						<Image src="/icons/comment.svg" alt="comment" width={16} height={16} />
						{todoItem.commentCount}
					</div>
				</div>
			</div>
			<DateTimeFrequency date={date} time={time} frequency={frequency[todoItem.frequency]} />
		</div>
	);
}
