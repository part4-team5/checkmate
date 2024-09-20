import DropDown from "@/app/_components/Dropdown";
import { calculateTimeDifference } from "@/app/_utils/IsoToFriendlyDate";
import Image from "next/image";
import { useState } from "react";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import Button from "@/app/_components/Button";
import API from "@/app/_api";
import { useDeleteTodoCommentMutation, usePatchTodoCommentEditMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import Icon from "@/app/_icons";
import toast from "@/app/_utils/Toast";

type CommentListType = Awaited<ReturnType<(typeof API)["{teamId}/tasks/{taskId}/comments"]["GET"]>>;
type CommentType = CommentListType[number];

type User = {
	id: number;
	email: string;
	nickname: string;
	image: string | null;
};

type TodoDetailCommentListProps = {
	comment: CommentType;
	todoId: number;
	groupId: number;
	currentTaskId: number;
	currentDate: Date;
	user: User;
};

export default function TodoDetailCommentList({ comment, todoId, groupId, currentDate, currentTaskId, user }: TodoDetailCommentListProps) {
	const [isCommentEdit, setIsCommentEdit] = useState(false);
	const [editedComment, setEditedComment] = useState(comment.content);
	const patchTodoCommentEditMutation = usePatchTodoCommentEditMutation(setIsCommentEdit, todoId);
	const deleteTodoCommentMutation = useDeleteTodoCommentMutation(todoId, groupId, currentTaskId, currentDate);

	const currentTime = new Date();
	const options = [
		{
			text: "수정",
			onClick: () => {
				setIsCommentEdit(true);
			},
		},
		{
			text: "삭제",
			onClick: () => {
				deleteTodoCommentMutation.mutate(comment.id);
			},
		},
	];

	const handleEditCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditedComment(e.target.value);
	};

	const handleTodoCommentEditSubmit = (e: React.FormEvent<HTMLFormElement>, commentId: number) => {
		e.preventDefault();
		if (editedComment.trim().length === 0) return;

		if (editedComment === comment.content) {
			toast.error("수정된 내용이 없습니다.");
			return;
		}
		patchTodoCommentEditMutation.mutate({ commentId, content: editedComment });
	};

	const timeDifference = calculateTimeDifference(comment.createdAt, currentTime);

	return (
		<div className="border-gray-300 flex min-h-28 items-center rounded-xl bg-background-list px-5 py-4 drop-shadow-md">
			{comment && (
				<form onSubmit={(e) => handleTodoCommentEditSubmit(e, comment.id)} id="test" className="w-full">
					<div className="flex justify-between">
						{isCommentEdit ? (
							<textarea
								className={`${editedComment.length > 0 ? "" : "border-status-danger"} w-full rounded-lg border border-border-primary bg-todo-primary p-2 shadow-input focus:outline-none`}
								onChange={handleEditCommentChange}
								value={editedComment}
							/>
						) : (
							<div className="flex w-full justify-between">
								<div style={{ maxWidth: "calc(100% - 24px)" }} className="min-h-14 whitespace-pre-line break-words text-md font-normal">
									{comment.content}
								</div>
								<div className="flex size-[20px] items-center justify-center">
									{comment.user?.id === user.id && (
										<DropDown options={options} align="RR">
											<button type="button" aria-label="dropdown" className="">
												<Icon.Kebab width={16} height={16} />
											</button>
										</DropDown>
									)}
								</div>
							</div>
						)}
					</div>

					<div className="pt-2" />

					<div>
						{!isCommentEdit ? (
							<div className="flex items-center justify-between">
								{comment.user && (
									<div className="flex items-center gap-2">
										{comment.user.image ? (
											<div className="relative h-8 w-8 overflow-hidden rounded-full">
												<Image src={comment.user.image} alt={comment.user.nickname} layout="fill" objectFit="cover" />
											</div>
										) : (
											<Image src={defaultImage} alt={comment.user.nickname} width={32} height={32} />
										)}
										<div>{comment.user.nickname}</div>
									</div>
								)}
								<div className="whitespace-nowrap text-text-secondary">{timeDifference}</div>
							</div>
						) : (
							<div className="flex justify-end gap-2">
								<button onClick={() => setIsCommentEdit(false)} type="button">
									취소
								</button>
								<div className="w-[74px]">
									<Button variant="outline" type="submit">
										수정
									</Button>
								</div>
							</div>
						)}
					</div>
				</form>
			)}
		</div>
	);
}
