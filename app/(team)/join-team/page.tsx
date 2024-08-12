/* eslint-disable no-restricted-syntax */

"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import Form from "@/app/_components/Form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function JoinTeam() {
	// TODO: 유저 정보에서 이메일 가져오기 (임시 이메일)
	const userEmail = "wwww@naver.com";

	const router = useRouter();

	const joinTeamMutation = useMutation<{}, Error, FormContext>({
		mutationFn: async (ctx: FormContext) => {
			const formData = new FormData();
			for (const [key, value] of Object.entries(ctx.values)) {
				formData.append(key, value as string);
			}

			const teamUrl = formData.get("teamUrl") as string;

			const response = await API["{teamId}/groups/accept-invitation"].POST({}, { userEmail, token: teamUrl });

			return response;
		},
		onSuccess: () => {
			// TODO: 팀 참여 성공 시 팀 페이지로 이동
			router.push("/get-started");
		},
		onError: (error, ctx) => {
			ctx.setError("teamUrl", "팀 링크가 올바르지 않습니다.");
		},
	});

	const handleJoinTeam = async (ctx: FormContext) => {
		if (joinTeamMutation.status === "pending") return;

		joinTeamMutation.mutate(ctx);
	};

	return (
		<section className="flex size-full flex-col items-center justify-center">
			<div className="pb-20">
				<h1 className="text-[40px] font-medium leading-[48px] text-white">팀 참여하기</h1>
			</div>

			<div className="w-full">
				<Form onSubmit={handleJoinTeam}>
					<div className="mx-auto flex w-full max-w-[340px] flex-col tablet:max-w-[460px]">
						<label htmlFor="teamUrl" className="w-full pb-3 text-start text-text-primary">
							팀 링크
						</label>
						<Form.Input
							id="teamUrl"
							type="text"
							placeholder="팀 링크를 입력하세요"
							tests={[{ type: "require", data: true, error: "팀 링크는 필수로 입력해야 합니다" }]}
						/>
						<Form.Error htmlFor="teamUrl" />

						<div className="pt-10" />

						<div className="h-12">{joinTeamMutation.status === "pending" ? <Button disabled>팀 참여 중</Button> : <Form.Submit>참여하기</Form.Submit>}</div>
					</div>
				</Form>
			</div>

			<div className="max-w-[340px] pt-6 tablet:max-w-[460px]">
				<p className="text-md font-normal text-text-primary tablet:text-lg">공유받은 팀 링크를 입력해 참여할 수 있어요.</p>
			</div>
		</section>
	);
}
