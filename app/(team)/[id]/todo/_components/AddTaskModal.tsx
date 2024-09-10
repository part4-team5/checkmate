"use client";

import React from "react";

import Form from "@/app/_components/Form";
import Button from "@/app/_components/Button";
import ModalWrapper from "@/app/_components/modals/ModalWrapper";

import { useAddTaskMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";

type AddTaskModalProps = {
	groupId: number;
	close: () => void;
};

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function AddTaskModal({ close, groupId }: AddTaskModalProps): JSX.Element {
	const postAddTaskMutation = useAddTaskMutation(groupId);

	if (postAddTaskMutation.isSuccess) {
		close();
	}

	const handleSubmit = (ctx: FormContext) => {
		postAddTaskMutation.mutate(ctx);
	};

	return (
		<ModalWrapper close={close}>
			<div className="mx-auto mt-8 max-w-[280px] tablet:mx-9">
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
							isModal
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
					{postAddTaskMutation.isPending ? (
						<div className="mt-6 h-12">
							<Button disabled type="button">
								목록 생성중...
							</Button>
						</div>
					) : (
						<div className="mt-6 h-12">
							<Form.Submit>만들기</Form.Submit>
						</div>
					)}
				</Form>
			</div>
		</ModalWrapper>
	);
}
