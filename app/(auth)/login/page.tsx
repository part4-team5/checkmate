"use client";

/* eslint-disable no-restricted-syntax */
import API from "@/app/_api";
import Form from "@/app/_components/Form";
import useCookie from "@/app/_hooks/useCookie";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function Page() {
	const [, setAccessToken] = useCookie<string>("accessToken");
	const [, setRefreshToken] = useCookie<string>("refreshToken");

	const loginMutation = useMutation<{ accessToken: string; refreshToken: string }, Error, FormContext>({
		mutationFn: async (ctx: FormContext) => {
			const formData = new FormData();
			for (const [key, value] of Object.entries(ctx.values)) {
				formData.append(key, value as string);
			}

			const email = formData.get("email") as string;
			const password = formData.get("password") as string;

			const payload: Parameters<(typeof API)["{teamId}/auth/signIn"]["POST"]>[1] = {
				email,
				password,
			};

			for (const [key, value] of formData.entries()) {
				payload[key as keyof typeof payload] = value as (typeof payload)[keyof typeof payload];
			}

			const response = await API["{teamId}/auth/signIn"].POST({}, payload);

			return response;
		},
		onSuccess: (data) => {
			setAccessToken(data.accessToken);
			setRefreshToken(data.refreshToken);
		},
		onError: (error, ctx) => {
			ctx.setError("password", "이메일 또는 비밀번호가 올바르지 않습니다.");
		},
	});

	const handleLogin = useCallback(
		(ctx: FormContext) => {
			if (loginMutation.status === "pending") return;

			loginMutation.mutate(ctx);
		},
		[loginMutation],
	);

	return (
		<main>
			<div>
				<Form onSubmit={handleLogin}>
					<div>
						<label htmlFor="email">이메일</label>
						<Form.Input id="email" type="email" tests={[{ type: "require", data: true, error: "이메일은 필수입니다." }]} />
						<Form.Error htmlFor="email" />

						<div />

						<label htmlFor="password">비밀번호</label>
						<Form.Input
							id="password"
							type="password"
							tests={[
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
							placeholder="비밀번호를 입력해주세요."
						/>
						<Form.Error htmlFor="password" />

						<div />

						<div>
							<Form.Submit>로그인</Form.Submit>
						</div>
					</div>
				</Form>
			</div>
		</main>
	);
}
