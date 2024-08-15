import CloseIcon from "@/public/icons/ic_close";
import Icon from "@/app/_icons/index";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import Image from "next/image";
import { useState } from "react";
import disabledAddComment from "@/public/icons/disableAddComment.svg";
import addComment from "@/public/icons/addComment.svg";
import Button from "@/app/_components/Button";
import KebabIcon from "@/public/icons/KebabIcon";
import { calculateTimeDifference, convertIsoToDateAndTime } from "@/app/_utils/IsoToFriendlyDate";
import useAuthStore from "@/app/_store/useAuthStore";
import { useAddCommentMutation, useEditTodoMutation, useToggleTodoStatusMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import DateTimeFrequency from "@/app/(team)/[id]/todo/_components/DateTimeFrequency";
import { useGetComments, useGetTodoContent } from "@/app/(team)/[id]/todo/_components/api/useQuery";

type TodoDetailProps = {
	todoId: number;
	groupId: number;
	currentTaskId: number;
	doneAt: string;
	currentDate: Date;
	close: () => void;
};

type FrequencyType = "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";
const frequency: Record<FrequencyType, string> = {
	DAILY: "매일 반복",
	WEEKLY: "매주 반복",
	MONTHLY: "매월 반복",
	ONCE: "반복 없음",
};

type User = {
	id: number;
	email: string;
	nickname: string;
	image: string | null;
};

export default function TodoDetail({ todoId, close, groupId, currentTaskId, currentDate, doneAt }: TodoDetailProps) {
	const user = useAuthStore((state) => state.user) as User;
	const [commentText, setCommentText] = useState("");
	const [isCheck, setIsCheck] = useState(!!doneAt);
	const [isEdit, setIsEdit] = useState(false);
	const [editedTitle, setEditedTitle] = useState("");
	const [editedDescription, setEditedDescription] = useState("");
	const { data: todoContent } = useGetTodoContent(todoId);
	const { data: comments } = useGetComments(todoId);
	const todoPatchMutation = useToggleTodoStatusMutation(groupId, currentTaskId, currentDate);
	const addCommentMutation = useAddCommentMutation(groupId, currentTaskId, todoId, currentDate, user, setCommentText);
	const todoEditMutation = useEditTodoMutation(groupId, currentTaskId, currentDate);
	const currentTime = new Date();

	const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentText(e.target.value);
	};

	const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (commentText.length === 0) return;
		if (addCommentMutation.isPending) return;
		addCommentMutation.mutate(commentText);
	};

	const handleCheckButtonClick = () => {
		setIsCheck((prev) => !prev);
		todoPatchMutation.mutate({ taskId: todoId, done: !isCheck });
	};

	const handleEditButtonClick = () => {
		if (!todoContent) return;
		setEditedTitle(todoContent?.name);
		setEditedDescription(todoContent?.description);
		setIsEdit((prev) => !prev);
	};

	const handleCancelClick = () => {
		setIsEdit(false);
	};

	const handleEditTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedTitle(e.target.value);
	};

	const handleEditDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditedDescription(e.target.value);
	};

	const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>, done: string | null) => {
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
		<div className="px-6 text-text-primary">
			<div className="sticky top-0 flex bg-background-secondary pb-5 pt-6">
				<button type="button" onClick={close} aria-label="버튼" className="">
					<CloseIcon width={24} height={24} />
				</button>
			</div>
			{todoContent && (
				<div>
					<div className="h-80">
						{isCheck && (
							<div className="mb-[13px] flex items-center gap-[6px]">
								<Icon.TodoCheck width={16} height={16} />
								<div className="text-text-lime">완료</div>
							</div>
						)}
						<form className="text-text-primary" onSubmit={(e) => handleEditSubmit(e, todoContent.doneAt)}>
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
										<button type="button" onClick={handleCancelClick} aria-label="todo-edit-cancel">
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
									<div className="text-md font-medium">{todoContent.user?.nickname}</div>
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
										className="w-full rounded-lg bg-background-secondary p-2 shadow-sm shadow-brand-secondary focus:outline-none"
									/>
								) : (
									<div className="break-words">{todoContent.description}</div>
								)}
							</div>
						</form>
					</div>

					<form className="mb-6" onSubmit={handleCommentSubmit}>
						<label htmlFor="add-comment" className="sr-only">
							댓글
						</label>
						<hr className="border-icon-primary" />
						<div className="flex">
							<input
								onChange={handleCommentChange}
								className="h-[50px] w-full bg-background-secondary focus:outline-none"
								id="add-comment"
								type="text"
								value={commentText}
								placeholder="댓글을 달아주세요"
								onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(e)}
							/>
							{addCommentMutation.isPending && <Image src="/icons/loading.svg" alt="spinner" width={24} height={24} className="animate-spin" />}
							{!addCommentMutation.isPending && (
								<button type="submit">
									{commentText.length > 0 ? (
										<Image src={addComment} alt="add-comment" width={24} height={24} />
									) : (
										<Image src={disabledAddComment} alt="add-comment" width={24} height={24} />
									)}
								</button>
							)}
						</div>
						<hr className="border-icon-primary" />
					</form>

					<div className="flex flex-col gap-4 scrollbar-thumb:bg-background-tertiary">
						{comments &&
							comments.map((comment) => {
								const timeDifference = calculateTimeDifference(comment.createdAt, currentTime);
								return (
									<div key={comment.id}>
										<div className="flex justify-between">
											<div className="text-md font-normal">{comment.content}</div>
											<button type="button" aria-label="dropdown">
												<KebabIcon />
											</button>
										</div>
										<div className="my-4 flex items-center justify-between">
											{comment.user && (
												<div className="flex items-center gap-3">
													<Image src={defaultImage} alt={todoContent.name} width={32} height={32} />
													<div>{comment.user.nickname}</div>
												</div>
											)}
											<div className="text-text-secondary">{timeDifference}</div>
										</div>
										<hr className="border-icon-primary" />
									</div>
								);
							})}
					</div>
				</div>
			)}
			<div>
				<div className="fixed bottom-10 right-10">
					<div className="h-[48px] w-[125px]">
						{isCheck ? (
							<Button variant="secondary" rounded="full" onClick={handleCheckButtonClick}>
								<div className="flex items-center gap-1">
									<Icon.CheckButton width={16} height={16} color="#10b981" />
									<div className="text-xs font-semibold text-text-emerald">완료 취소하기</div>
								</div>
							</Button>
						) : (
							<Button rounded="full" onClick={handleCheckButtonClick}>
								<div className="flex items-center gap-1">
									<Icon.CheckButton width={16} height={16} />
									<div className="text-xs font-semibold">완료하기</div>
								</div>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
