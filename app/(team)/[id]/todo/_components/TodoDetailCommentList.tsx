import DropDown from "@/app/_components/Dropdown";
import { calculateTimeDifference } from "@/app/_utils/IsoToFriendlyDate";
import KebabIcon from "@/public/icons/KebabIcon";
import Image from "next/image";
import { useState } from "react";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import Button from "@/app/_components/Button";
import API from "@/app/_api";
import { usePatchTodoCommentEditMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";

type CommnetListType = Awaited<ReturnType<(typeof API)["{teamId}/tasks/{taskId}/comments"]["GET"]>>;
type CommentType = CommnetListType[number];

type TodoDetailCommentListProps = {
	comment: CommentType;
	todoId: number;
};

export default function TodoDetailCommentList({ comment, todoId }: TodoDetailCommentListProps) {
	const [isCommentEdit, setIsCommentEdit] = useState(false);
	const [editedComment, setEditedComment] = useState("");
	const patchTodoCommentEditMutation = usePatchTodoCommentEditMutation(setIsCommentEdit, todoId);

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
				alert("삭제");
			},
		},
	];

	const handleEditCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditedComment(e.target.value);
	};

	const handleTodoCommentEditSubmit = (e: React.FormEvent<HTMLFormElement>, commentId: number) => {
		e.preventDefault();
		patchTodoCommentEditMutation.mutate({ commentId, content: editedComment });
	};

	const timeDifference = calculateTimeDifference(comment.createdAt, currentTime);
	return (
		<div>
			{comment && (
				<form onSubmit={(e) => handleTodoCommentEditSubmit(e, comment.id)} id="test">
					<div className="flex justify-between">
						{isCommentEdit ? (
							<textarea
								className="w-full rounded-lg bg-background-secondary p-2 shadow-sm shadow-brand-secondary focus:outline-none"
								onChange={handleEditCommentChange}
								value={editedComment}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleEditCommentChange({ target: { value: `${editedComment + "\n"}` } } as React.ChangeEvent<HTMLTextAreaElement>);
									}
								}}
							/>
						) : (
							<div className="flex w-full justify-between">
								<div className="whitespace-pre-line text-md font-normal">{comment.content}</div>
								<DropDown options={options}>
									<button type="button" aria-label="dropdown">
										<KebabIcon />
									</button>
								</DropDown>
							</div>
						)}
					</div>

					<div className="my-4">
						{!isCommentEdit ? (
							<div className="flex items-center justify-between">
								{comment.user && (
									<div className="flex items-center gap-3">
										{comment.user.image ? "" : <Image src={defaultImage} alt={comment.user.nickname} width={32} height={32} />}
										<div>{comment.user.nickname}</div>
									</div>
								)}
								<div className="text-text-secondary">{timeDifference}</div>
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
					<hr className="border-icon-primary" />
				</form>
			)}
		</div>
	);
}
