/* eslint-disable no-restricted-syntax */

"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import Form from "@/app/_components/Form";
import Icon from "@/app/_icons";
import toast from "@/app/_utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function CreateTeamPage() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const imageUpload = async (file: File) => {
		if (typeof file === "string") return { url: undefined };

		return API["{teamId}/images/upload"].POST({}, file);
	};

	const createTeamMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/groups"]["POST"]>>, Error, FormContext>({
		mutationFn: async (ctx: FormContext): Promise<Awaited<ReturnType<(typeof API)["{teamId}/groups"]["POST"]>>> => {
			const file = ctx.values.profileImage as File;
			const teamName = ctx.values.teamName as string;

			const { url } = await imageUpload(file);

			const payload: Parameters<(typeof API)["{teamId}/groups"]["POST"]>[1] = {
				image: url,
				name: teamName,
			};

			return API["{teamId}/groups"].POST({}, payload);
		},
		onSuccess: (data) => {
			const user = queryClient.getQueryData<{ id: number }>(["user"]) ?? { id: 0 };

			// 몽고 DB에서 사용자 그룹 정보 업데이트
			API["api/users/{id}"].PATCH({ id: user.id }, { groupId: data.id });

			toast.success("팀이 생성되었습니다.");

			// 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ["user"] });

			router.push(`/${data.id}`);
		},
		onError: (error, ctx) => {
			ctx.setError("teamName", "팀 생성에 실패했습니다.");
		},
	});

	const handleTeamCreation = useCallback(
		(ctx: FormContext) => {
			if (createTeamMutation.isPending) return;

			createTeamMutation.mutate(ctx);
		},
		[createTeamMutation],
	);

	return (
		<main className="size-full min-w-[20rem] pt-20">
			<section className="flex size-full flex-col items-center justify-center">
				<div className="pb-20">
					<h1 className="text-[2.5rem] font-medium leading-[3rem] text-brand-primary">팀 생성하기</h1>
				</div>

				<div className="w-full">
					<Form onSubmit={handleTeamCreation}>
						<div className="mx-auto flex w-full max-w-[21.25rem] flex-col tablet:max-w-[28.75rem]">
							<div className="w-full">
								<div className="pb-3" />
								<Form.ImageInput id="profileImage" tests={[{ type: "file_size", data: 4 * 1048576, error: "이미지 파일 크기는 4MB 이하여야 합니다" }]}>
									{(file) => (
										// eslint-disable-next-line react/jsx-no-useless-fragment
										<div className="flex w-full items-center justify-center">
											{file ? (
												<div className="relative flex size-[140px] min-h-[140px] min-w-[140px] items-center justify-center rounded-[.75rem] border-2 border-brand-primary">
													<Image src={file as string} alt="Profile Preview" fill className="rounded-[.75rem] object-cover object-center" />
												</div>
											) : (
												<div className="relative flex size-[140px] items-center justify-center rounded-[.75rem] border-2 border-brand-primary bg-background-secondary">
													<div className="relative size-[56px]">
														<Icon.EmptyImage width={56} height={56} />
													</div>
												</div>
											)}
										</div>
									)}
								</Form.ImageInput>
							</div>
							<div className="pt-3" />
							<Form.Error htmlFor="profileImage" />

							<div className="pt-6" />

							<label htmlFor="teamName" className="w-full pb-3 text-start font-medium text-text-primary">
								팀 이름
							</label>
							<Form.Input
								id="teamName"
								type="text"
								placeholder="팀 이름을 입력하세요"
								tests={[{ type: "require", data: true, error: "팀 이름은 필수입니다" }]}
							/>
							<div className="pt-3" />
							<Form.Error htmlFor="teamName" />

							<div className="pt-10" />

							<div className="h-12">{createTeamMutation.isPending ? <Button disabled>팀 생성 중</Button> : <Form.Submit>생성하기</Form.Submit>}</div>
						</div>
					</Form>
				</div>

				<div className="max-w-[21.25rem] pt-6 tablet:max-w-[28.75rem]">
					<p className="text-md font-normal text-text-primary tablet:text-lg">팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.</p>
				</div>
			</section>
		</main>
	);
}
