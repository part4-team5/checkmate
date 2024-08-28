import { useAddCommentMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import Image from "next/image";
import { useState } from "react";
import addComment from "@/public/icons/addComment.svg";
import disabledAddComment from "@/public/icons/disableAddComment.svg";

type User = {
	id: number;
	email: string;
	nickname: string;
	image: string | null;
};

type TodoDetailInputProps = {
	groupId: number;
	currentTaskId: number;
	currentDate: Date;
	todoId: number;
	user: User;
};

export default function TodoDetailInput({ groupId, currentTaskId, currentDate, todoId, user }: TodoDetailInputProps) {
	const [commentText, setCommentText] = useState("");
	const addCommentMutation = useAddCommentMutation(groupId, currentTaskId, todoId, currentDate, user, setCommentText);

	const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentText(e.target.value);
	};

	const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (commentText.length === 0) return;
		if (addCommentMutation.isPending) return;
		addCommentMutation.mutate(commentText);
	};

	return (
		<form className="mb-6" onSubmit={handleCommentSubmit}>
			<label htmlFor="add-comment" className="sr-only">
				댓글
			</label>

			<div className="flex gap-3 rounded-md">
				<input
					onChange={handleCommentChange}
					className="h-[50px] w-full rounded-md bg-todo-primary pl-2 shadow-input focus:outline-none"
					id="add-comment"
					type="text"
					value={commentText}
					placeholder="댓글을 달아주세요"
					onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(e)}
				/>
				{addCommentMutation.isPending && <Image src="/icons/loading.svg" alt="spinner" width={24} height={24} className="animate-spin" />}
				{!addCommentMutation.isPending && (
					<button type="submit">
						{commentText.trim().length > 0 ? (
							<Image src={addComment} alt="add-comment" width={24} height={24} />
						) : (
							<Image src={disabledAddComment} alt="add-comment" width={24} height={24} />
						)}
					</button>
				)}
			</div>
		</form>
	);
}
