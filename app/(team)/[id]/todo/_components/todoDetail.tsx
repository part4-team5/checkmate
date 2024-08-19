import CloseIcon from "@/public/icons/ic_close";
import Icon from "@/app/_icons/index";
import { useState } from "react";
import Button from "@/app/_components/Button";
import useAuthStore from "@/app/_store/useAuthStore";
import { useGetComments, useGetTodoContent } from "@/app/(team)/[id]/todo/_components/api/useQuery";
import TodoDetailCommentList from "@/app/(team)/[id]/todo/_components/TodoDetailCommentList";
import { useToggleTodoStatusMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import TodoDetailHeader from "@/app/(team)/[id]/todo/_components/TodoDetailHeader";
import TodoDetailInput from "@/app/(team)/[id]/todo/_components/TodoDetailInput";

type TodoDetailProps = {
	todoId: number;
	groupId: number;
	currentTaskId: number;
	doneAt: string;
	currentDate: Date;
	close: () => void;
};

type User = {
	id: number;
	email: string;
	nickname: string;
	image: string | null;
};

export default function TodoDetail({ todoId, close, groupId, currentTaskId, currentDate, doneAt }: TodoDetailProps) {
	const user = useAuthStore((state) => state.user) as User;
	const [isCheck, setIsCheck] = useState(!!doneAt);
	const { data: todoContent } = useGetTodoContent(todoId);
	const { data: comments } = useGetComments(todoId);
	const todoPatchToggleStatusMutation = useToggleTodoStatusMutation(groupId, currentTaskId, currentDate);

	const handleCheckButtonClick = () => {
		setIsCheck((prev) => !prev);
		todoPatchToggleStatusMutation.mutate({ taskId: todoId, done: !isCheck });
	};

	return (
		<div className="px-6 text-text-primary">
			<div className="sticky top-0 flex bg-background-secondary pb-5 pt-6">
				<button type="button" onClick={close} aria-label="버튼" className="">
					<CloseIcon width={24} height={24} />
				</button>
			</div>
			<div>
				<TodoDetailHeader
					groupId={groupId}
					currentTaskId={currentTaskId}
					currentDate={currentDate}
					todoId={todoId}
					todoContent={todoContent}
					isCheck={isCheck}
				/>
				<TodoDetailInput groupId={groupId} currentTaskId={currentTaskId} currentDate={currentDate} todoId={todoId} user={user} />

				<div className="flex flex-col gap-4 scrollbar-thumb:bg-background-tertiary">
					{comments && comments.map((comment) => <TodoDetailCommentList key={comment.id} comment={comment} />)}
				</div>
			</div>

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
	);
}
