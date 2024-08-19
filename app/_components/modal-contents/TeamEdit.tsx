import Button from "@/app/_components/Button";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import Form from "@/app/_components/Form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import CloseIcon from "@/public/icons/ic_close";
import Icon from "@/app/_icons";

import API from "@/app/_api";

type TeamEditProps = {
	close: () => void;
	id: number;
	initialTeamName: string;
};

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function TeamEdit({ close, id, initialTeamName }: TeamEditProps): JSX.Element {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { data: teamInfo } = useQuery({
		queryKey: ["groupInfo", { id }],
		queryFn: () => API["{teamId}/groups/{id}"].GET({ id }),
	});

	const teamEditMutation = useMutation({
		mutationFn: async (ctx: FormContext) => {
			const file = ctx.values.profileImage as File;
			const teamName = ctx.values.teamName as string;

			let url: string | undefined;
			if (file) {
				const response = await API["{teamId}/images/upload"].POST({}, file);
				url = response.url;
			}

			const payload = { image: url, name: teamName };
			return API["{teamId}/groups/{id}"].PATCH({ id }, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["groupInfo"] });

			close();
			router.push(`/${id}`);
		},
		onError: (error, ctx) => {
			ctx.setError("teamName", "팀 수정에 실패했습니다.");
		},
	});

	const handleTeamManagement = useCallback(
		(ctx: FormContext) => {
			if (teamEditMutation.status === "pending") return;
			teamEditMutation.mutate(ctx);
		},
		[teamEditMutation],
	);

	return (
		<ModalWrapper close={close}>
			<section className="flex size-full flex-col items-center justify-center px-[20px] pb-[15px]">
				<div className="flex w-full justify-end">
					<button onClick={close} type="button" aria-label="Close modal">
						<CloseIcon width={24} height={24} />
					</button>
				</div>

				<div className="pb-7">
					<h1 className="text-[18px] font-medium text-white">팀 수정하기</h1>
				</div>

				<div className="w-full">
					<Form onSubmit={handleTeamManagement}>
						<div className="flex flex-col">
							<div className="w-fit">
								<label htmlFor="team-name" className="w-full text-start text-text-primary">
									팀 프로필
								</label>
								<div className="pb-3" />
								<Form.ImageInput id="profileImage" tests={[{ type: "file_size", data: 1048576, error: "이미지 파일 크기는 1MB 이하여야 합니다" }]}>
									{(file) =>
										(file ?? teamInfo?.image) ? (
											<div className="relative flex size-16 cursor-pointer items-center justify-center rounded-[12px] border-2 border-border-primary/10">
												<Image
													src={(file as string) ?? teamInfo?.image ?? ""}
													alt="Profile Preview"
													fill
													className="rounded-[12px] object-cover object-center"
												/>
												<div className="relative size-full">
													<div className="absolute -bottom-2 -right-2 flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-[#1E293B] bg-[#334155]">
														<Icon.Edit width={11} height={11} color="#64748B" />
													</div>
												</div>
											</div>
										) : (
											<div className="relative flex size-16 cursor-pointer items-center justify-center rounded-[12px] border-2 border-border-primary/10 bg-background-secondary">
												<div className="\\ relative">
													<Image src="/icons/emptyImage.svg" alt="Profile Preview" width={20} height={20} />
												</div>
												<div className="absolute -bottom-2 -right-2 flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-[#1E293B] bg-[#334155] pl-[1px]">
													<Icon.Edit width={11} height={11} color="#64748B" />
												</div>
											</div>
										)
									}
								</Form.ImageInput>
							</div>
							<div className="mt-[10px]" />

							<Form.Error htmlFor="profileImage" />

							<div className="pt-6" />

							<label htmlFor="team-name" className="w-full pb-3 text-start text-text-primary">
								팀 이름
							</label>
							<div>
								<Form.Input
									id="teamName"
									type="text"
									placeholder="팀 이름을 입력하세요"
									init={initialTeamName}
									tests={[
										{ type: "require", data: true, error: "팀 이름은 필수입니다" },
										{ type: "maxlength", data: 30, error: "팀 이름은 30자 이하로 생성해주세요" },
									]}
								/>
							</div>
							<div className="pt-[10px]" />

							<Form.Error htmlFor="teamName" />

							<div className="pt-10" />

							<div className="h-12">{teamEditMutation.status === "pending" ? <Button disabled>팀 수정 중</Button> : <Form.Submit>수정하기</Form.Submit>}</div>
						</div>
					</Form>
				</div>

				<div className="max-w-[340px] pt-6 tablet:max-w-[460px]">
					<p className="text-md font-normal text-text-primary tablet:text-[15px]">팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.</p>
				</div>
			</section>
		</ModalWrapper>
	);
}
