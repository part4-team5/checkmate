import tasksKey from "@/app/(team)/[id]/todo/queryFactory";
import API from "@/app/_api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PatchTodo = async (id: number, done: boolean) => {
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

type TaskListType = Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"]["GET"]>>;
export const useTodoCheckMutation = (groupId: number, currentTaskId: number, currentDate: Date) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ taskId, done }: { taskId: number; done: boolean }) => PatchTodo(taskId, done),
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
type TodoType = Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"]["GET"]>>;
export const useAddCommentMutation = (comment: string, todoId: number, userName: string, userId: number, groupId: number, currentTaskId: number) => {
	const queryClient = useQueryClient();
	const currentDate = new Date();

	return useMutation({
		mutationFn: () => postAddComment(comment, todoId),
		onMutate: async () => {
			// 최신 데이터로 업데이트하기 위해 쿼리 캔슬
			await queryClient.cancelQueries({ queryKey: ["tasks", { taskId: todoId }] });
			// 이전 데이터를 저장
			const oldData = queryClient.getQueryData<TodoType>(["tasks", { taskId: todoId }]);
			// 새로운 데이터로 업데이트
			const id = oldData?.comments[oldData.comments.length - 1].id || 999;
			const newComment = {
				id: id + 1,
				content: comment,
				createdAt: currentDate.toISOString(),
				updatedAt: currentDate.toISOString(),
				taskId: todoId,
				userId,
				user: { id: userId, nickname: userName, image: "" },
			};

			const newData = {
				...oldData, // oldData의 다른 속성을 유지
				comments: [...(oldData?.comments || []), newComment], // 기존 comments 배열에 newComment 추가
			};

			// 이전 데이터를 반환
			return { oldData };
		},
		// 요청 실패 시 이전 데이터로 롤백
		onError: (error, variables, context) => {
			if (context?.oldData) {
				queryClient.setQueryData(["tasks", { taskId: todoId }], context.oldData);
			}
			alert(`오류: ${error.message} - 댓글 작성에 실패했습니다.`);
		},
		// 요청이 성공하던 실패하던 무효화해서 최신 데이터로 업데이트
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
			queryClient.invalidateQueries({ queryKey: ["tasks", { taskId: todoId }] });
		},
	});
};
