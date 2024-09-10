import Icon from "@/app/_icons/index";
import { useRef, useState } from "react";
import Button from "@/app/_components/Button";
import useAuthStore from "@/app/_store/AuthStore";
import { useGetComments, useGetTodoContent } from "@/app/(team)/[id]/todo/_components/api/useQuery";
import TodoDetailCommentList from "@/app/(team)/[id]/todo/_components/TodoDetailCommentList";
import { useToggleTodoStatusMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import TodoDetailHeader from "@/app/(team)/[id]/todo/_components/TodoDetailHeader";
import TodoDetailInput from "@/app/(team)/[id]/todo/_components/TodoDetailInput";
import { motion } from "framer-motion";

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
	const containerRef = useRef(null);

	const handleCheckButtonClick = () => {
		setIsCheck((prev) => !prev);
		todoPatchToggleStatusMutation.mutate({ taskId: todoId, done: !isCheck });
	};

	return (
		<div>
			<div className="sticky top-0 z-50 flex pb-3 pl-6 pt-3">
				<button type="button" onClick={close} aria-label="버튼" className="">
					<Icon.Close width={24} height={24} />
				</button>
			</div>
			<div className="px-6 pt-9 text-text-primary" ref={containerRef}>
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

					<div className="flex flex-col gap-4">
						{comments &&
							comments.map((comment) => (
								<TodoDetailCommentList
									key={comment.id}
									comment={comment}
									todoId={todoId}
									groupId={groupId}
									currentTaskId={currentTaskId}
									currentDate={currentDate}
									user={user}
								/>
							))}
					</div>
				</div>

				<motion.div drag="x" className="fixed bottom-10 right-10" dragConstraints={containerRef}>
					<div className="h-[48px] w-[125px]">
						{isCheck ? (
							<Button variant="secondary" rounded="full" onClick={handleCheckButtonClick}>
								<div className="flex items-center gap-1">
									<Icon.Check width={24} height={24} color="#10b981" />
									<div className="text-md font-semibold text-text-emerald">완료 취소하기</div>
								</div>
							</Button>
						) : (
							<Button rounded="full" onClick={handleCheckButtonClick}>
								<div className="flex items-center gap-1">
									<Icon.Check width={24} height={24} color="#fff" />
									<div className="text-md font-semibold">완료하기</div>
								</div>
							</Button>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
