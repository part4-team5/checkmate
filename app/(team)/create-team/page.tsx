/* eslint-disable no-restricted-syntax */

"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import Form from "@/app/_components/Form";
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

		const response = await API["{teamId}/images/upload"].POST({}, file);
		return response;
	};

	const teamManagementMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/groups"]["POST"]>>, Error, FormContext>({
		mutationFn: async (ctx: FormContext): Promise<Awaited<ReturnType<(typeof API)["{teamId}/groups"]["POST"]>>> => {
			const formData = new FormData();
			for (const [key, value] of Object.entries(ctx.values)) {
				formData.append(key, value as string);
			}

			const file = formData.get("profileImage") as File;
			const teamName = formData.get("teamName") as string;

			const { url } = await imageUpload(file);

			const payload: Parameters<(typeof API)["{teamId}/groups"]["POST"]>[1] = {
				image: url,
				name: teamName,
			};

			const response = await API["{teamId}/groups"].POST({}, payload);

			return response;
		},
		onSuccess: (data) => {
			// 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ["team"] });

			router.push(`/${data.teamId}`);
		},
		onError: (error, ctx) => {
			// TODO: 팀 생성 실패 시 에러 메시지 표시
			ctx.setError("teamName", "팀 생성에 실패했습니다.");
		},
	});

	const handleTeamManagement = useCallback(
		(ctx: FormContext) => {
			if (teamManagementMutation.isPending) return;

			teamManagementMutation.mutate(ctx);
		},
		[teamManagementMutation],
	);

	return (
		<section className="flex size-full flex-col items-center justify-center">
			<div className="pb-20">
				<h1 className="text-[40px] font-medium leading-[48px] text-white">팀 생성하기</h1>
			</div>

			<div className="w-full">
				<Form onSubmit={handleTeamManagement}>
					<div className="mx-auto flex w-full max-w-[340px] flex-col tablet:max-w-[460px]">
						<div className="w-fit">
							<label htmlFor="team-image" className="w-full pb-3 text-start text-text-primary">
								팀 프로필
							</label>
							<div className="pb-3" />
							<Form.ImageInput id="profileImage" tests={[{ type: "file_size", data: 1048576, error: "이미지 파일 크기는 1MB 이하여야 합니다" }]}>
								{(file) => (
									// eslint-disable-next-line react/jsx-no-useless-fragment
									<>
										{file ? (
											<div className="relative flex size-16 items-center justify-center rounded-[12px] border-2 border-border-primary/10">
												<Image src={file as string} alt="Profile Preview" fill className="rounded-[12px] object-cover object-center" />
												<div className="relative size-full">
													<Image src="/icons/edit.svg" alt="Profile Preview" width={20} height={20} className="absolute -bottom-2 -right-2" />
												</div>
											</div>
										) : (
											<div className="relative flex size-16 items-center justify-center rounded-[12px] border-2 border-border-primary/10 bg-background-secondary">
												<div className="relative size-5">
													<Image src="/icons/emptyImage.svg" alt="Profile Preview" fill />
												</div>

												<Image src="/icons/edit.svg" alt="Profile Preview" width={20} height={20} className="absolute -bottom-2 -right-2" />
											</div>
										)}
									</>
								)}
							</Form.ImageInput>
						</div>
						<Form.Error htmlFor="team-image" />

						<div className="pt-6" />

						<label htmlFor="team-name" className="w-full pb-3 text-start text-text-primary">
							팀 이름
						</label>
						<Form.Input id="teamName" type="text" placeholder="팀 이름을 입력하세요" tests={[{ type: "require", data: true, error: "팀 이름은 필수입니다" }]} />
						<Form.Error htmlFor="team-name" />

						<div className="pt-10" />

						<div className="h-12">{teamManagementMutation.isPending ? <Button disabled>팀 생성 중</Button> : <Form.Submit>생성하기</Form.Submit>}</div>
					</div>
				</Form>
			</div>

			<div className="max-w-[340px] pt-6 tablet:max-w-[460px]">
				<p className="text-md font-normal text-text-primary tablet:text-lg">팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.</p>
			</div>
		</section>
	);
}
