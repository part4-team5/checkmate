/* eslint-disable indent */

"use client";

import { useCallback } from "react";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import Form from "@/app/_components/Form";
import API from "@/app/_api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloseIcon from "@/public/icons/ic_close";
import toast from "@/app/_utils/Toast";

type PostEditTasksProps = {
	initialTasksName?: string;
	close: () => void;
	groupId: number;
	taskId?: number | null;
};

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

type TaskList = {
	id: number;
	name: string;
	tasks: { doneAt: string | null }[];
};

type MutationContext = {
	previousGroupInfo?: { taskLists: TaskList[] };
};

// Tasks를 Post 하거나 Edit하는 모달
export default function PostEditTasks({ initialTasksName, close, groupId, taskId }: PostEditTasksProps): JSX.Element {
	const queryClient = useQueryClient();

	const postTasksMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists"]["POST"]>>, Error, FormContext, MutationContext>(
		{
			mutationFn: async (ctx: FormContext) => {
				const postTasks = ctx.values.postTasks as string;

				const payload: Parameters<(typeof API)["{teamId}/groups/{groupId}/task-lists"]["POST"]>[1] = {
					name: postTasks,
				};

				const response = await API["{teamId}/groups/{groupId}/task-lists"].POST({ groupId }, payload);

				return response;
			},
			onMutate: async (ctx) => {
				// 모달을 바로 닫기
				close();

				// 낙관적 업데이트 수행
				await queryClient.cancelQueries({ queryKey: ["groupInfo", { groupId }], exact: true });

				const previousGroupInfo = queryClient.getQueryData<{ taskLists: TaskList[] }>(["groupInfo", { groupId }]);

				queryClient.setQueryData(["groupInfo", { groupId }], (oldData: any) => {
					const newTaskList = { id: Date.now(), name: ctx.values.postTasks, tasks: [] };
					const updatedTaskLists = oldData?.taskLists ? [...oldData.taskLists, newTaskList] : [newTaskList];
					return {
						...oldData,
						taskLists: updatedTaskLists,
					};
				});

				return { previousGroupInfo };
			},
			onError: (error, ctx, context) => {
				if (context?.previousGroupInfo) {
					queryClient.setQueryData(["groupInfo", { groupId }], context.previousGroupInfo);
				}

				if (error.message === "이미 존재하는 할 일 목록입니다.") {
					toast.error("이미 존재하는 할 일 목록입니다.");
				} else {
					toast.error("목록 추가에 실패했습니다.");
				}
			},
			onSettled: () => {
				queryClient.invalidateQueries({ queryKey: ["groupInfo", { groupId }], exact: true });
			},
		},
	);

	const editTasksMutation = useMutation<
		Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{id}"]["PATCH"]>>,
		Error,
		FormContext,
		MutationContext
	>({
		mutationFn: async (ctx: FormContext) => {
			const editTasks = ctx.values.postTasks as string;

			const payload: Parameters<(typeof API)["{teamId}/groups/{groupId}/task-lists/{id}"]["PATCH"]>[1] = { name: editTasks };

			const response = await API["{teamId}/groups/{groupId}/task-lists/{id}"].PATCH(
				{
					groupId,
					id: taskId!,
				},
				payload,
			);

			return response;
		},
		onMutate: async (ctx) => {
			close();

			// 낙관적 업데이트 수행
			await queryClient.cancelQueries({ queryKey: ["groupInfo", groupId], exact: true });

			const previousGroupInfo = queryClient.getQueryData<{ taskLists: TaskList[] }>(["groupInfo", groupId]);

			queryClient.setQueryData(["groupInfo", groupId], (oldData: any) => {
				if (!oldData?.taskLists) return oldData;

				const updatedTaskLists = oldData.taskLists.map((taskList: any) => (taskList.id === taskId ? { ...taskList, name: ctx.values.postTasks } : taskList));

				return {
					...oldData,
					taskLists: updatedTaskLists,
				};
			});

			return { previousGroupInfo };
		},
		onError: (error, ctx, context) => {
			if (context?.previousGroupInfo) {
				queryClient.setQueryData(["groupInfo", groupId], context.previousGroupInfo);
			}

			if (error.message === "이미 존재하는 할 일 목록입니다.") {
				toast.error("이미 존재하는 할 일 목록입니다.");
			} else {
				toast.error("목록 수정에 실패했습니다.");
			}

			ctx.setError("postTasks", "목록 수정에 실패했습니다.");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["groupInfo", groupId], exact: true });
		},
	});

	const handlePostOrEditTasks = useCallback(
		(ctx: FormContext) => {
			if (taskId) {
				editTasksMutation.mutate(ctx);
			} else {
				postTasksMutation.mutate(ctx);
			}
		},
		[editTasksMutation, postTasksMutation, taskId],
	);

	return (
		<ModalWrapper close={close}>
			<div className="flex w-full justify-end">
				<button onClick={close} type="button" aria-label="Close modal">
					<CloseIcon width={24} height={24} />
				</button>
			</div>
			<Form onSubmit={handlePostOrEditTasks}>
				<div className="flex h-auto min-h-[160px] flex-col justify-between gap-[24px] px-[36px]">
					<div className="flex flex-col items-center gap-[16px]">
						<label htmlFor="post-tasks" className="w-full text-center text-text-primary">
							할 일 목록
						</label>
						<div className="w-full">
							<Form.Input
								isModal
								id="postTasks"
								type="text"
								placeholder="목록 명을 입력해주세요."
								init={taskId ? initialTasksName : undefined}
								tests={[
									{ type: "require", data: true, error: "목록 이름은 필수입니다" },
									{ type: "maxlength", data: 30, error: "목록 이름은 30자 이하로 생성해주세요" },
								]}
							/>
							<div className="flex w-full justify-center pt-[10px]">
								<Form.Error htmlFor="postTasks" />
							</div>
						</div>
					</div>

					<div className="h-12">
						<Form.Submit>{taskId ? "수정하기" : "만들기"}</Form.Submit>
					</div>
				</div>
			</Form>
		</ModalWrapper>
	);
}
