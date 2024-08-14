import tasksKey from "@/app/(team)/[id]/todo/_components/api/queryFactory";
import API from "@/app/_api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const patchToggleTodoStatus = async (id: number, done: boolean) => {
	const body = {
		done,
	};
	const response = API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"].PATCH(
		{
			taskId: id,
		},
		body,
	);
	return response;
};

const postAddComment = async (newComment: string, todoId: number) => {
	const body = { content: newComment };
	// API 호출
	const response = await API["{teamId}/tasks/{taskId}/comments"].POST(
		{
			taskId: todoId,
		},
		body,
	);
	return response;
};

const patchTodoEdit = async (todoId: number, name: string, description: string) => {
	const body = {
		name,
		description,
	};
	const response = API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"].PATCH(
		{
			taskId: todoId,
		},
		body,
	);
	return response;
};

type TaskListType = Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"]["GET"]>>;
export const useToggleTodoStatusMutation = (groupId: number, currentTaskId: number, currentDate: Date) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ taskId, done }: { taskId: number; done: boolean }) => patchToggleTodoStatus(taskId, done),
		onMutate: async ({ taskId, done }) => {
			// 최신 데이터로 업데이트하기 위해 쿼리 캔슬
			await queryClient.cancelQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
			// 이전 데이터를 저장
			const oldData = queryClient.getQueryData<TaskListType>(tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")));
			// 새로운 데이터로 업데이트
			const newData = oldData?.map((todo) => {
				if (todo.id === taskId) {
					return { ...todo, doneAt: done ? new Date().toISOString() : null } as TaskListType[0];
				}
				return todo; // 기존 값 반환
			});

			queryClient.setQueryData<TaskListType>(tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")), newData);

			// 이전 데이터를 반환
			return { oldData };
		},
		// 요청 실패 시 이전 데이터로 롤백
		onError: (error, variables, context) => {
			if (context?.oldData) {
				queryClient.setQueryData(tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")), context.oldData);
			}
			alert(`오류: ${error.message} - ${variables.done ? "완료" : "미완료"} 처리에 실패했습니다.`);
		},
		// 요청이 성공하던 실패하던 무효화해서 최신 데이터로 업데이트
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
			queryClient.invalidateQueries({ queryKey: ["tasks", { taskId: currentTaskId }] });
		},
	});
};

type TodoType = Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"]["GET"]>>;
type CommentType = Awaited<ReturnType<(typeof API)["{teamId}/tasks/{taskId}/comments"]["GET"]>>[number];
type User = {
	id: number;
	email: string;
	nickname: string;
	image: string | null;
};

export const useAddCommentMutation = (
	groupId: number,
	currentTaskId: number,
	todoId: number,
	currentDate: Date,
	user: User,
	setCommentInput: React.Dispatch<React.SetStateAction<string>>,
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (commentInputText: string) => {
			setCommentInput("");
			return postAddComment(commentInputText, todoId);
		},
		onMutate: async (commentInputText) => {
			// 최신 데이터로 업데이트하기 위해 쿼리 캔슬
			await queryClient.cancelQueries({ queryKey: ["todo", { todoId, comments: true }] });
			// 이전 데이터를 저장
			const oldData = queryClient.getQueryData<CommentType[]>(["todo", { todoId, comments: true }]);
			const ids = oldData?.map((comment) => comment.id) || [];
			const maxId = Math.max(...ids, 0);
			// 새로운 데이터로 업데이트
			// TODO: id검증 로직 정교하게 수정, 실패 시 재시도 로직 추가
			const newComment = {
				id: maxId + 1,
				content: commentInputText,
				createdAt: currentDate.toISOString(),
				updatedAt: currentDate.toDateString(),
				taskId: todoId,
				userId: user.id,
				user: { id: user.id, nickname: user.nickname, image: user.image },
			};
			const newData = oldData ? [...oldData, newComment] : [newComment];
			queryClient.setQueryData<CommentType[]>(["todo", { todoId, comments: true }], newData);

			// 이전 데이터를 반환
			return { oldData };
		},
		// 요청 실패 시 이전 데이터로 롤백
		onError: (error, variables, context) => {
			if (context?.oldData) {
				queryClient.setQueryData(["todo", { todoId, comment: true }], context.oldData);
			}
			alert(`오류: ${error.message} - 댓글 작성에 실패했습니다.`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")), refetchType: "all" });
		},
		// 요청이 성공하던 실패하던 무효화해서 최신 데이터로 업데이트
		onSettled: () => {
			queryClient.refetchQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
			queryClient.invalidateQueries({ queryKey: ["todo", { todoId, comments: true }] });
		},
	});
};

export const useEditTodoMutation = (groupId: number, currentTaskId: number, currentDate: Date) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ todoId, name, description }: { todoId: number; name: string; description: string }) => patchTodoEdit(todoId, name, description),
		onMutate: async ({ todoId, name, description }) => {
			// 최신 데이터로 업데이트하기 위해 쿼리 캔슬
			await queryClient.cancelQueries({ queryKey: ["todo", { todoId }] });
			// 이전 데이터를 저장
			const oldData = queryClient.getQueryData<TodoType>(["todo", { todoId }]);
			// 새로운 데이터로 업데이트
			const newData = { ...oldData, name, description };
			console.log(newData);
			queryClient.setQueryData<TodoType>(["todo", { todoId }], newData as TodoType);

			// 이전 데이터를 반환
			return { oldData };
		},
		// 요청 실패 시 이전 데이터로 롤백
		onError: (error, variables, context) => {
			if (context?.oldData) {
				queryClient.setQueryData(["todo", { todoId: variables.todoId }], context.oldData);
			}
			alert(`오류: ${error.message} - 할 일 수정에 실패했습니다.`);
		},
		// 요청이 성공하던 실패하던 무효화해서 최신 데이터로 업데이트
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
		},
	});
};
