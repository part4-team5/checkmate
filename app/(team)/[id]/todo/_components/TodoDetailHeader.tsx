import DateTimeFrequency from "@/app/(team)/[id]/todo/_components/DateTimeFrequency";
import Icon from "@/app/_icons";
import { convertIsoToDateAndTime } from "@/app/_utils/IsoToFriendlyDate";
import Image from "next/image";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import { useState } from "react";
import { useEditTodoMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import API from "@/app/_api";
import { motion } from "framer-motion";

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
		if (editedTitle.length === 0 || editedDescription.length === 0) return;
		todoEditMutation.mutate({
			todoId,
			name: editedTitle,
			description: editedDescription,
			doneAt: done,
		});
		setIsEdit(false);
	};

	const buttonAnimation = {
		whileTap: {
			scale: 0.8,
		},
		hover: {
			scale: 1.2,
		},
	};

	const { date } = convertIsoToDateAndTime(todoContent?.date);
	return (
		<div>
			{!todoContent && (
				<div className="flex h-64 w-full items-center justify-center">
					<Image src="/icons/spinner.svg" alt="spinner" width={30} height={30} className="animate-spin" />
				</div>
			)}

			{todoContent && (
				<div className="mb-36">
					{isCheck && (
						<div className="mb-[13px] flex items-center gap-[6px]">
							<Icon.TodoCheck width={16} height={16} />
							<div className="text-text-lime">완료</div>
						</div>
					)}
					<form className="text-text-primary" onSubmit={(e) => handleTodoEditSubmit(e, todoContent.doneAt)}>
						<div className="flex items-center justify-between gap-7">
							{isEdit ? (
								<input
									type="text"
									onChange={handleEditTitleChange}
									value={editedTitle}
									className={`${editedTitle.length > 0 ? "" : "border-status-danger"} w-full rounded-lg border border-border-primary bg-todo-primary p-3 shadow-input focus:outline-none`}
								/>
							) : (
								<div className={`${isCheck ? "line-through" : ""} text-xl font-bold text-text-primary`}>{todoContent.name}</div>
							)}
							{isEdit ? (
								<div className="flex gap-2">
									<motion.button
										whileTap={buttonAnimation.whileTap}
										whileHover={buttonAnimation.hover}
										type="button"
										onClick={handleEditCancelClick}
										aria-label="todo-edit-cancel"
										className="h-fit w-fit rounded-full shadow-buttonPrimary"
									>
										<Icon.EditCancel width={22} height={22} />
									</motion.button>
									<motion.button
										whileTap={buttonAnimation.whileTap}
										whileHover={buttonAnimation.hover}
										type="submit"
										aria-label="todo-edit-submit"
										className="h-fit w-fit rounded-full shadow-buttonPrimary"
									>
										<Icon.EditCheck width={24} height={24} />
									</motion.button>
								</div>
							) : (
								<motion.button
									whileTap={buttonAnimation.whileTap}
									whileHover={buttonAnimation.hover}
									type="button"
									onClick={handleEditButtonClick}
									aria-label="todo-edit"
									className="h-fit w-fit rounded-full bg-background-Senary p-3 shadow-buttonPrimary"
								>
									<Icon.Edit width={24} height={24} />
								</motion.button>
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
						<DateTimeFrequency date={date} frequency={frequency[todoContent.frequency as FrequencyType]} />
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
									className={`${editedDescription.length > 0 ? "" : "border-status-danger"} w-full rounded-lg border border-border-primary bg-todo-primary p-2 shadow-input focus:outline-none`}
									rows={5}
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
