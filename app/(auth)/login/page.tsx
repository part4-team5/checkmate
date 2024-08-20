"use client";

import Form from "@/app/_components/Form";
import useCookie from "@/app/_hooks/useCookie";
import API from "@/app/_api/index";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback } from "react";
import useAuthStore from "@/app/_store/useAuthStore";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function LoginPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [accessToken, setAccessToken] = useCookie<string>("accessToken");
	const [refreshToken, setRefreshToken] = useCookie<string>("refreshToken");
	const setUser = useAuthStore((state) => state.setUser);
	const user = useAuthStore((state) => state.user);

	if (accessToken && refreshToken && user) {
		router.replace("/");
	}

	const loginMutation = useMutation({
		mutationFn: async (ctx: FormContext) => {
			const { email, password } = ctx.values as {
				email: string;
				password: string;
			};
			const payload = { email, password };
			return API["{teamId}/auth/signIn"].POST({}, payload);
		},
		onSuccess: (response) => {
			setUser({
				id: response.user.id,
				email: response.user.email || "",
				nickname: response.user.nickname,
				image: response.user.image ? response.user.image : null,
			});

			setAccessToken(response.accessToken);
			setRefreshToken(response.refreshToken);

			queryClient.invalidateQueries({ queryKey: ["user"] });

			router.replace("/");
		},
		onError: (error) => {
			alert(`${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	const handleSubmit = useCallback(
		(ctx: FormContext) => {
			if (loginMutation.status === "pending") return;
			loginMutation.mutate(ctx);
		},
		[loginMutation],
	);

	return (
		<>
			<h2 className="mb-[80px] text-center text-[40px] font-medium leading-[48px] text-text-primary">로그인</h2>
			<Form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-[12px]">
					<label htmlFor="email" className="text-text-primary">
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
					<Link href="/reset-password" className="text-right text-brand-primary underline">
						비밀번호를 잊으셨나요?
					</Link>
				</div>
				<div className="mb-[24px] mt-[40px] h-12">
					<Form.Submit>로그인</Form.Submit>
				</div>
			</Form>
			<div className="text-center text-text-primary">
				처음이신가요?
				<Link href="/signup" className="ml-[12px] text-right text-brand-primary underline">
					가입하기
				</Link>
			</div>
		</>
	);
}
