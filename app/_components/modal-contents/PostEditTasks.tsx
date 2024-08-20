/* eslint-disable no-nested-ternary */

"use client";

import React, { useState, useCallback } from "react";
import Button from "@/app/_components/Button";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import Form from "@/app/_components/Form";
import API from "@/app/_api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloseIcon from "@/public/icons/ic_close";
import ToastPopup from "@/app/(team)/[id]/_component/ToastPopup";

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

// Tasks를 Post 하거나 Edit하는 모달
export default function PostEditTasks({ initialTasksName, close, groupId, taskId }: PostEditTasksProps): JSX.Element {
	const queryClient = useQueryClient();
	const [toast, setToast] = useState(false);
	// post, edit에 따라 메시지 다르게 설정
	const [toastMessage, setToastMessage] = useState("");

	const postTasksMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists"]["POST"]>>, Error, FormContext>({
		mutationFn: async (ctx: FormContext) => {
			const postTasks = ctx.values.postTasks as string;

			const payload: Parameters<(typeof API)["{teamId}/groups/{groupId}/task-lists"]["POST"]>[1] = {
				name: postTasks,
			};

			const response = await API["{teamId}/groups/{groupId}/task-lists"].POST({ groupId }, payload);

			return response;
		},
		onSuccess: (data) => {
			// 새로운 할 일 목록을 추가한 후에 캐시 업데이트
			queryClient.setQueryData(["groupInfo", groupId], (oldData: any) => {
				const updatedTaskLists = oldData?.taskLists ? [...oldData.taskLists, data] : [data];
				return {
					...oldData,
					taskLists: updatedTaskLists,
				};
			});
			close();
		},
		onError: (error, ctx) => {
			console.log("onError called", error);
			console.log("Error message:", error.message);

			if (error.message === "이미 존재하는 할 일 목록입니다.") {
				setToastMessage("이미 존재하는 할 일 목록입니다.");
				setToast(false);
				setTimeout(() => {
					setToast(true);
				}, 10);
			} else {
				ctx.setError("postTasks", "목록 추가에 실패했습니다.");
			}
		},
	});

	const editTasksMutation = useMutation<
		Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{id}"]["PATCH"]>>,
		Error,
		FormContext,
		{ previousGroupInfo: { taskLists: TaskList[] } | undefined }
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
					// 캐시 쿼리 취소 (낙관적 업데이트시 최신 데이터 반영 목적)
					await queryClient.cancelQueries({
						queryKey: ["groupInfo", groupId],
						exact: true,
					});

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
						setToastMessage("이미 존재하는 할 일 목록입니다.");
					} else {
						setToastMessage("목록 수정에 실패했습니다. 다시 시도해주세요.");
					}

					setToast(false);
					setTimeout(() => {
						setToast(true);
					}, 10);
					ctx.setError("postTasks", "목록 수정에 실패했습니다.");
				},
				onSuccess: () => {
					close();
				},
				onSettled: () => {
					queryClient.invalidateQueries({
						queryKey: ["groupInfo", groupId],
						exact: true,
					});
				},
			});

	const handlePostOrEditTasks = useCallback(
		(ctx: FormContext) => {
			if (taskId) {
				if (editTasksMutation.isPending) return;
				editTasksMutation.mutate(ctx);
			} else {
				if (postTasksMutation.isPending) return;
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
						{taskId ? (
							editTasksMutation.status === "pending" ? (
								<Button disabled>수정 중...</Button>
							) : (
								<Form.Submit>수정하기</Form.Submit>
							)
						) : postTasksMutation.status === "pending" ? (
							<Button disabled>추가 중...</Button>
						) : (
							<Form.Submit>만들기</Form.Submit>
						)}
					</div>
				</div>
			</Form>
			{toast && <ToastPopup message={toastMessage} position="top" />}
		</ModalWrapper>
	);
}
