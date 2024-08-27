import Button from "@/app/_components/Button";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import Form from "@/app/_components/Form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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
	const [imageRemoved, setImageRemoved] = useState(false);

	const { data: teamInfo } = useQuery({
		queryKey: ["groupInfo", { group: id }],
		queryFn: () => API["{teamId}/groups/{id}"].GET({ id }),
	});

	const teamEditMutation = useMutation({
		mutationFn: async (ctx: FormContext) => {
			const file = ctx.values.profileImage as File;
			const teamName = ctx.values.teamName as string;

			let url: string | null = teamInfo?.image ?? null;
			if (imageRemoved) {
				url = null; // 이미지가 삭제된 경우 null로 설정
			} else if (file && !(typeof file === "string")) {
				const response = await API["{teamId}/images/upload"].POST({}, file);
				url = response.url;
			}

			const payload = {
				image: url ?? "null",
				name: teamName,
			};
			return API["{teamId}/groups/{id}"].PATCH({ id }, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			queryClient.invalidateQueries({ queryKey: ["groupInfo", { group: id }] });

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

	const handleRemoveImage = () => {
		setImageRemoved(true);
	};

	const imageSrc = imageRemoved || !teamInfo?.image ? "/icons/emptyImage.svg" : teamInfo.image;

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
								<div className="relative flex items-center">
									<Form.ImageInput id="profileImage" tests={[{ type: "file_size", data: 1048576, error: "이미지 파일 크기는 1MB 이하여야 합니다" }]}>
										{(file) => {
											const isEmptyImage = (file ?? imageSrc) === "/icons/emptyImage.svg";

											return (
												<div className="border-border-primary/10 relative flex h-[120px] w-[120px] cursor-pointer items-center justify-center rounded-[12px] border-2">
													<Image
														src={(file as string) ?? imageSrc}
														alt="Profile Preview"
														fill={isEmptyImage ? undefined : true} // 크기 조정 필요 없음
														width={isEmptyImage ? 60 : undefined}
														height={isEmptyImage ? 60 : undefined}
														className={`rounded-[12px] object-cover object-center ${isEmptyImage ? "object-contain" : ""}`}
													/>
													<div className="absolute -bottom-2 -right-2 flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-[#1E293B] bg-[#334155]">
														<Icon.Edit width={11} height={11} color="#64748B" />
													</div>
													{!isEmptyImage && !file && (
														<button
															type="button"
															onClick={handleRemoveImage}
															className="absolute -left-[-6px] top-[6px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#334155] text-white"
															aria-label="Remove profile image"
														>
															<Icon.TodoDelete width={18} height={18} color="#ffffff" />
														</button>
													)}
												</div>
											);
										}}
									</Form.ImageInput>
									{imageSrc !== "/icons/emptyImage.svg" && (
										<button
											type="button"
											onClick={handleRemoveImage}
											className="absolute -left-[-6px] top-[6px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#334155] text-white"
											aria-label="Remove profile image"
										>
											<Icon.TodoDelete width={18} height={18} color="#ffffff" />
										</button>
									)}
								</div>
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
										{ type: "maxlength", data: 30, error: "팀 이름은 30자 이하로 생성해주세요" },
										{ type: "minlength", data: 1, error: "팀 이름은 1자 이상으로 생성해주세요" },
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
