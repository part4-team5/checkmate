"use client";

import Form from "@/app/_components/Form";
import useCookie from "@/app/_hooks/useCookie";
import API from "@/app/_api/index";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function LoginPage() {
	const router = useRouter();
	const [accessToken, setAccessToken] = useCookie<string>("accessToken");
	const [refreshToken, setRefreshToken] = useCookie<string>("refreshToken");

	if (accessToken && refreshToken) {
		router.push("/");
	}

	const handleSubmit = useCallback(
		async (ctx: FormContext) => {
			const formData = new FormData();
			Object.entries(ctx.values).forEach(([key, value]) => {
				formData.append(key, value as string);
			});

			const email = formData.get("email") as string;
			const password = formData.get("password") as string;

			const payload: Parameters<(typeof API)["{teamId}/auth/signIn"]["POST"]>[1] = {
				email,
				password,
			};

			try {
				const response = await API["{teamId}/auth/signIn"].POST({}, payload);
				// 로그인 성공 시 보여줄 요소
				alert("로그인 성공");
				setAccessToken(response.accessToken);
				setRefreshToken(response.refreshToken);
				router.push("/");
			} catch (error) {
				// 로그인 실패 시 보여줄 요소
				alert("로그인 실패");
			}
		},
		[router, setAccessToken, setRefreshToken],
	);

	return (
		<main className="box-border min-h-screen w-full bg-background-primary p-[24px_0] tablet:p-[140px_0]">
			<section className="m-[0_16px] w-auto tablet:m-[0_auto] tablet:w-[460px]">
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
			</section>
		</main>
	);
}
