"use client";

import Form from "@/app/_components/Form";
import useCookie from "@/app/_hooks/useCookie";
import API from "@/app/_api/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import useAuthStore from "@/app/_store/useAuthStore";
import Oauth from "@/app/(auth)/_components/Oauth";
import { useRouter } from "next/navigation";
import UserUpload from "@/app/(auth)/_components/UserUpload";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function SignupPage() {
	const router = useRouter();
	const [, setAccessToken] = useCookie<string>("accessToken");
	const [, setRefreshToken] = useCookie<string>("refreshToken");
	const setUser = useAuthStore((state) => state.setUser);

	const queryClient = useQueryClient();

	const userUpload = UserUpload();

	const signupMutation = useMutation({
		mutationFn: async (ctx: FormContext) => {
			const { email, nickname, password, passwordConfirmation } = ctx.values as {
				email: string;
				nickname: string;
				password: string;
				passwordConfirmation: string;
			};
			const payload = { email, nickname, password, passwordConfirmation };
			return API["{teamId}/auth/signUp"].POST({}, payload);
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });

			setUser({
				id: response.user.id,
				email: response.user.email as string,
				nickname: response.user.nickname,
				image: response.user.image ? response.user.image : null,
			});

			// 몽고 DB에 유저 정보 저장
			userUpload.mutate({ id: response.user.id, email: response.user.email as string });

			setAccessToken(response.accessToken);
			setRefreshToken(response.refreshToken);

			router.replace("/");
		},
		onError: (error) => {
			alert(`${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	const handleSubmit = useCallback(
		(ctx: FormContext) => {
			if (signupMutation.status === "pending") return;
			signupMutation.mutate(ctx);
		},
		[signupMutation],
	);

	return (
		<>
			<h2 className="mb-[80px] text-center text-[40px] font-medium leading-[48px] text-text-primary">회원가입</h2>
			<Form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-[12px]">
					<label htmlFor="nickname" className="text-text-primary">
						이름
					</label>
					<Form.Input
						id="nickname"
						type="text"
						placeholder="이름을 입력해주세요."
						tests={[
							{ type: "require", data: true, error: "이름을 입력해주세요." },
							{ type: "maxlength", data: 30, error: "30자 이하로 입력해주세요." },
						]}
					/>
					<Form.Error htmlFor="nickname" />
					<label htmlFor="email" className="mt-[12px] text-text-primary">
						이메일
					</label>
					<Form.Input
						id="email"
						type="email"
						placeholder="이메일을 입력해주세요."
						tests={[
							{ type: "require", data: true, error: "이메일을 입력해주세요." },
							{ type: "match", data: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "유효한 이메일이 아닙니다." },
						]}
					/>
					<Form.Error htmlFor="email" />
					<label htmlFor="password" className="mt-[12px] text-text-primary">
						비밀번호
					</label>
					<Form.Input
						id="password"
						type="password"
						placeholder="비밀번호를 입력해주세요."
						tests={[
							{
								type: "require",
								data: true,
								error: "비밀번호를 입력해주세요.",
							},
							{
								type: "match",
								data: /^[a-zA-Z0-9!@#%^&*]*$/,
								error: "비밀번호는 숫자, 영문, 특수문자만 가능합니다.",
							},
							{
								type: "minlength",
								data: 8,
								error: "비밀번호는 최소 8자입니다.",
							},
							{
								type: "maxlength",
								data: 20,
								error: "비밀번호는 최대 20자입니다.",
							},
						]}
					/>
					<Form.Error htmlFor="password" />
					<label htmlFor="passwordConfirmation" className="mt-[12px] text-text-primary">
						비밀번호 확인
					</label>
					<Form.Input
						id="passwordConfirmation"
						type="password"
						tests={[
							{
								type: "sync",
								data: "password",
								error: "비밀번호가 일치하지 않습니다.",
							},
							{
								type: "require",
								data: true,
								error: "비밀번호를 입력해주세요.",
							},
						]}
						placeholder="비밀번호를 다시 한 번 입력해주세요."
					/>
					<Form.Error htmlFor="passwordConfirmation" />
				</div>
				<div className="mb-[24px] mt-[40px] h-12">
					<Form.Submit>회원가입</Form.Submit>
				</div>
			</Form>

			<Oauth type="signup" />
		</>
	);
}
