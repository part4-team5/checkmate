import React from "react";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import Form from "@/app/_components/Form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/app/_api";

type AddTaskModalProps = {
	groupId: number;
	close: () => void;
};

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function AddTaskModal({ close, groupId }: AddTaskModalProps): JSX.Element {
	const queryClient = useQueryClient();

	const postAddTask = async (id: number, ctx: FormContext) => {
		const name = ctx.values.task as string;
		const response = API["{teamId}/groups/{groupId}/task-lists"].POST(
			{
				groupId: id,
			},
			{
				name,
			},
		);
		return response;
	};

	const addTaskMutation = useMutation({
		mutationFn: (ctx: FormContext) => postAddTask(groupId, ctx),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tasks", { groupId }] });
			close();
		},
		onError: (error) => {
			console.log(error.message);
		},
	});

	const handleSubmit = (ctx: FormContext) => {
		addTaskMutation.mutate(ctx);
	};

	return (
		<ModalWrapper close={close}>
			<div className="mx-9 mt-8 max-w-[280px]">
				<div className="mb-4 font-medium">
					<h1 className="text-center text-lg">새로운 목록 추가</h1>
					<p className="mt-2 text-center text-md text-text-secondary">
						할 일에 대한 목록을 추가하고
						<br />
						목록별 할 일을 만들 수 있습니다.
					</p>
				</div>
				<Form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-2">
						<label htmlFor="task" className="text-lg">
							목록 이름
						</label>
						<Form.Input
							id="task"
							type="text"
							tests={[
								{
									type: "minlength",
									data: 2,
									error: "목록은 최소 2자입니다.",
								},
								{
									type: "maxlength",
									data: 20,
									error: "목록은 최대 영문10자, 한글 20자입니다.",
								},
							]}
							placeholder="할 일 제목을 입력해주세요."
						/>
						<Form.Error htmlFor="task" />
					</div>
					<div className="mt-6 h-12">
						<Form.Submit>만들기</Form.Submit>
					</div>
				</Form>
			</div>
		</ModalWrapper>
	);
}
