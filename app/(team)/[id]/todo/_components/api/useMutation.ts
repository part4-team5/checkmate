import tasksKey from "@/app/(team)/[id]/todo/_components/api/queryFactory";
import API from "@/app/_api";
import Form from "@/app/_components/Form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

const patchToggleTodoStatus = async (id: number, done: boolean) => {
	const body = {
		done,
	};
	return API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"].PATCH(
		{
			taskId: id,
		},
		body,
	);
};

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];
const postAddTask = async (id: number, ctx: FormContext) => {
	const name = ctx.values.task as string;
	return API["{teamId}/groups/{groupId}/task-lists"].POST(
		{
			groupId: id,
		},
		{
			name,
		},
	);
};

const postAddComment = async (newComment: string, todoId: number) => {
	const body = { content: newComment };
	// API 호출
	return API["{teamId}/tasks/{taskId}/comments"].POST(
		{
			taskId: todoId,
		},
		body,
	);
};

const patchTodoEdit = async (todoId: number, name: string, description: string, doneAt: string | null) => {
	const body = {
		name,
		description,
		done: !!doneAt,
	};
	return API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"].PATCH(
		{
			taskId: todoId,
		},
		body,
	);
};

const patchTodoOrder = async (todoId: number, displayIndex: number) => {
	const body = {
		displayIndex,
	};
	return API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{id}/order"].PATCH(
		{
			id: todoId,
		},
		body,
	);
};

const patchTodoCommentEdit = async (commentId: number, content: string) => {
	const body = {
		content,
	};
	return API["{teamId}/tasks/{taskId}/comments/{commentId}"].PATCH(
		{
			commentId,
		},
		body,
	);
};

const deleteTodo = async (todoId: number) =>
	API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"].DELETE({
		taskId: todoId,
	});

const deleteTodoComment = async (commentId: number) =>
	API["{teamId}/tasks/{taskId}/comments/{commentId}"].DELETE({
		commentId,
	});

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
			await queryClient.cancelQueries({ queryKey: ["todo", { todoId, comments: true }] });
			const oldData = queryClient.getQueryData<CommentType[]>(["todo", { todoId, comments: true }]);
			const ids = oldData?.map((comment) => comment.id) || [];
			const maxId = Math.max(...ids, 0);
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
			return { oldData };
		},
		onError: (error, variables, context) => {
			if (context?.oldData) {
				queryClient.setQueryData(["todo", { todoId, comment: true }], context.oldData);
			}
			alert(`오류: ${error.message} - 댓글 작성에 실패했습니다.`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")), refetchType: "all" });
		},
		onSettled: () => {
			queryClient.refetchQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
			queryClient.invalidateQueries({ queryKey: ["todo", { todoId, comments: true }] });
		},
	});
};

export const useEditTodoMutation = (groupId: number, currentTaskId: number, currentDate: Date) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ todoId, name, description, doneAt }: { todoId: number; name: string; description: string; doneAt: string | null }) =>
			patchTodoEdit(todoId, name, description, doneAt),
		onMutate: async ({ todoId, name, description }) => {
			await queryClient.cancelQueries({ queryKey: ["todo", { todoId }] });
			const oldData = queryClient.getQueryData<TodoType>(["todo", { todoId }]);
			const newData = { ...oldData, name, description };
			queryClient.setQueryData<TodoType>(["todo", { todoId }], newData as TodoType);
			return { oldData };
		},
		onError: (error, variables, context) => {
			if (context?.oldData) {
				queryClient.setQueryData(["todo", { todoId: variables.todoId }], context.oldData);
			}
			alert(`오류: ${error.message} - 할 일 수정에 실패했습니다.`);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
		},
	});
};

type MutationVariables = {
	todoId: number;
	displayIndex: number;
};

export const useTodoOrderMutation = () =>
	useMutation({
		mutationFn: ({ todoId, displayIndex }: MutationVariables) => patchTodoOrder(todoId, displayIndex),
	});
export const useCreateTodoMutation = (groupId: number, taskListId: number) => {
	const queryClient = useQueryClient();
	const currentDate = new Date();

	return useMutation({
		mutationFn: ({
			name,
			description,
			startDate,
			frequencyType,
			weekDays,
			monthDay,
		}: Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/recurring"]["POST"]>>) => {
			const body = {
				name,
				description,
				startDate: startDate ?? new Date().toISOString(),
				frequencyType,
				weekDays: frequencyType === "WEEKLY" ? weekDays : undefined,
				monthDay: frequencyType === "MONTHLY" ? monthDay : undefined,
			};
			return API["{teamId}/groups/{groupId}/task-lists/{taskListId}/recurring"].POST(
				{
					groupId,
					taskListId,
				},
				body,
			);
		},
		onMutate: async ({ name, description, startDate, frequencyType, weekDays, monthDay }) => {
			// 최신 데이터로 업데이트하기 위해 쿼리 캔슬
			await queryClient.cancelQueries({ queryKey: tasksKey.detail(groupId, taskListId, currentDate.toLocaleDateString("ko-KR")) });
			// 이전 데이터를 저장
			const oldData = queryClient.getQueryData<TaskListType>(tasksKey.detail(groupId, taskListId, currentDate.toLocaleDateString("ko-KR")));
			// 새로운 데이터로 업데이트
			const newData = oldData
				? [...oldData, { id: 1, name, description, date: startDate, frequency: frequencyType, weekDays, monthDay }]
				: [{ id: 1, name, description, date: startDate, frequency: frequencyType, weekDays, monthDay }];

			queryClient.setQueryData<TaskListType>(tasksKey.detail(groupId, taskListId, currentDate.toLocaleDateString("ko-KR")), newData as TaskListType);

			// 이전 데이터를 반환
			return { oldData };
		},
		// 요청 실패 시 이전 데이터로 롤백
		onError: (error, variables, context) => {
			if (context?.oldData) {
				queryClient.setQueryData(tasksKey.detail(groupId, taskListId, currentDate.toLocaleDateString("ko-KR")), context.oldData);
			}
			alert(`오류: ${error.message} - 할 일 추가에 실패했습니다.`);
		},
		// 요청이 성공하던 실패하던 무효화해서 최신 데이터로 업데이트
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.detail(groupId, taskListId, currentDate.toLocaleDateString("ko-KR")) });
		},
	});
};

export const useDeleteTodoMutation = (groupId: number, currentTaskId: number, currentDate: Date) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (todoId: number) => deleteTodo(todoId),
		onMutate: async (todoId) => {
			await queryClient.cancelQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
			const oldData = queryClient.getQueryData<TaskListType>(tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")));
			console.log(oldData);
			const newData = oldData?.filter((todo) => todo.id !== todoId);
			queryClient.setQueryData<TaskListType>(tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")), newData);
			return { oldData };
		},
		onError: (error, variables, context) => {
			if (context?.oldData) {
				queryClient.setQueryData(tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")), context.oldData);
			}
			alert(`오류: ${error.message} - 할 일 삭제에 실패했습니다.`);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
		},
	});
};

export const usePatchTodoCommentEditMutation = (setter: Dispatch<SetStateAction<boolean>>, todoId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ commentId, content }: { commentId: number; content: string }) => {
			setter(false);
			return patchTodoCommentEdit(commentId, content);
		},
		onMutate: async ({ commentId, content }) => {
			await queryClient.cancelQueries({ queryKey: ["todo", { todoId, comments: true }] });
			const oldData = queryClient.getQueryData<CommentType[]>(["todo", { todoId, comments: true }]);
			const newData = oldData?.map((comment) => {
				if (comment.id === commentId) {
					return { ...comment, content } as CommentType;
				}
				return comment;
			});
			queryClient.setQueryData<CommentType[]>(["todo", { todoId, comments: true }], newData);
			return { oldData };
		},
		onError: (error) => {
			alert(`오류: ${error.message} - 댓글 수정에 실패했습니다.`);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["todo", { todoId, comments: true }] });
		},
	});
};

export const useDeleteTodoCommentMutation = (todoId: number, groupId: number, currentTaskId: number, currentDate: Date) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (commentId: number) => deleteTodoComment(commentId),
		onMutate: async (commentId) => {
			await queryClient.cancelQueries({ queryKey: ["todo", { todoId, comments: true }] });
			const oldData = queryClient.getQueryData<CommentType[]>(["todo", { todoId, comments: true }]);
			const newData = oldData?.filter((comment) => comment.id !== commentId);
			queryClient.setQueryData<CommentType[]>(["todo", { todoId, comments: true }], newData);
			return { oldData };
		},
		onError: (error) => {
			alert(`오류: ${error.message} - 댓글 삭제에 실패했습니다.`);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")) });
		},
	});
};

export const useAddTaskMutation = (groupId: number) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (ctx: FormContext) => postAddTask(groupId, ctx),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks", { groupId }] });
		},
		onError: (error) => {
			alert(`오류: ${error.message} - 할 일 추가에 실패했습니다.`);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks", { groupId }] });
		},
	});
};
