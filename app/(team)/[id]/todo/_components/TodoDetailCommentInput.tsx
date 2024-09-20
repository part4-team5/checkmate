import { useAddCommentMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import Image from "next/image";
import { useState, useRef } from "react";
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
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCommentText(e.target.value);
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
		}
	};

	const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
		e.preventDefault();
		if (commentText.trim().length === 0) return;
		if (addCommentMutation.isPending) return;
		if (textareaRef.current) textareaRef.current.style.height = "auto";
		addCommentMutation.mutate(commentText);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleCommentSubmit(e);
		}
	};

	return (
		<form className="mb-6" onSubmit={handleCommentSubmit}>
			<label htmlFor="add-comment" className="sr-only">
				댓글
			</label>

			<div className="flex gap-3 rounded-md">
				<textarea
					ref={textareaRef}
					onChange={handleCommentChange}
					onKeyDown={handleKeyDown}
					className="max-h-[200px] w-full resize-none rounded-md bg-todo-primary px-4 py-2 shadow-input focus:outline-none scrollbar:w-2 scrollbar:rounded-full scrollbar:bg-background-secondary scrollbar-thumb:rounded-full scrollbar-thumb:bg-background-primary"
					id="add-comment"
					value={commentText}
					placeholder="댓글을 달아주세요"
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
