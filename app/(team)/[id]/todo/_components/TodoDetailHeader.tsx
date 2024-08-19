import DateTimeFrequency from "@/app/(team)/[id]/todo/_components/DateTimeFrequency";
import Icon from "@/app/_icons";
import { convertIsoToDateAndTime } from "@/app/_utils/IsoToFriendlyDate";
import Image from "next/image";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import { useState } from "react";
import { useEditTodoMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import API from "@/app/_api";

type FrequencyType = "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";
const frequency: Record<FrequencyType, string> = {
	DAILY: "매일 반복",
	WEEKLY: "매주 반복",
	MONTHLY: "매월 반복",
	ONCE: "반복 없음",
};

type TodoType = Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"]["GET"]>>;

type TodoDetailHeaderProps = {
	groupId: number;
	currentTaskId: number;
	currentDate: Date;
	todoId: number;
	todoContent?: TodoType;
	isCheck: boolean;
};

export default function TodoDetailHeader({ groupId, currentTaskId, currentDate, todoId, todoContent, isCheck }: TodoDetailHeaderProps) {
	const [isEdit, setIsEdit] = useState(false);
	const [editedTitle, setEditedTitle] = useState("");
	const [editedDescription, setEditedDescription] = useState("");
	const todoEditMutation = useEditTodoMutation(groupId, currentTaskId, currentDate);

	const handleEditButtonClick = () => {
		if (!todoContent) return;
		setEditedTitle(todoContent?.name);
		setEditedDescription(todoContent?.description);
		setIsEdit((prev) => !prev);
	};

	const handleEditCancelClick = () => {
		setIsEdit(false);
	};

	const handleEditTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedTitle(e.target.value);
	};

	const handleEditDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditedDescription(e.target.value);
	};

	const handleTodoEditSubmit = (e: React.FormEvent<HTMLFormElement>, done: string | null) => {
		e.preventDefault();
		if (!todoContent) return;
		todoEditMutation.mutate({
			todoId,
			name: editedTitle,
			description: editedDescription,
			doneAt: done,
		});
		setIsEdit(false);
	};

	const { date, time } = convertIsoToDateAndTime(todoContent?.date);
	return (
		<div>
			{todoContent && (
				<div className="mb-48">
					{isCheck && (
						<div className="mb-[13px] flex items-center gap-[6px]">
							<Icon.TodoCheck width={16} height={16} />
							<div className="text-text-lime">완료</div>
						</div>
					)}
					<form className="text-text-primary" onSubmit={(e) => handleTodoEditSubmit(e, todoContent.doneAt)}>
						<div className="flex justify-between">
							{isEdit ? (
								<input
									type="text"
									onChange={handleEditTitleChange}
									value={editedTitle}
									className="rounded-md bg-background-secondary p-1 shadow-sm shadow-brand-secondary focus:outline-none"
								/>
							) : (
								<div className={`${isCheck ? "line-through" : ""} text-xl font-bold text-text-primary`}>{todoContent.name}</div>
							)}
							{isEdit ? (
								<div className="flex gap-2">
									<button type="button" onClick={handleEditCancelClick} aria-label="todo-edit-cancel">
										<Icon.EditCancel width={24} height={24} color="#34D399" />
									</button>
									<button type="submit" aria-label="todo-edit-submit">
										<Icon.EditCheck width={24} height={24} color="#34D399" />
									</button>
								</div>
							) : (
								<button type="button" onClick={handleEditButtonClick} aria-label="todo-edit">
									<Icon.Edit width={24} height={24} color="#34D399" />
								</button>
							)}
						</div>
						<div className="my-4 flex justify-between">
							<div className="flex items-center gap-3">
								<Image src={defaultImage} alt={todoContent.name} width={32} height={32} />
								<div className="text-md font-medium">{todoContent.writer.nickname}</div>
							</div>
							{/**
							 * 어떤 날짜를 사용할지 나중에 수정
							 * */}
							<div className="flex items-center text-md font-normal text-text-secondary">
								{todoContent.recurring.createdAt.split("T")[0].split("-").join(".")}
							</div>
						</div>
						<DateTimeFrequency date={date} time={time} frequency={frequency[todoContent.frequency as FrequencyType]} />
						<div className="mt-6">
							{isEdit ? (
								<textarea
									onChange={handleEditDescriptionChange}
									value={editedDescription}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleEditDescriptionChange({ target: { value: `${editedDescription}\n` } } as React.ChangeEvent<HTMLTextAreaElement>);
										}
									}}
									className="w-full rounded-lg bg-background-secondary p-2 shadow-sm shadow-brand-secondary focus:outline-none"
								/>
							) : (
								<div className="whitespace-pre-line break-words">{todoContent.description}</div>
							)}
						</div>
					</form>
				</div>
			)}
		</div>
	);
}
