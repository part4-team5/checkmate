/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */

"use client";

import API from "@/app/_api";
import Form from "@/app/_components/Form";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ResetPasswordPage() {
	// API 호출 중인지 확인
	const [isLoading, setIsLoading] = useState(false);

	// TODO: 로그인 상태 확인 (테스트 용으로 false로 설정 추후에 User 정보를 받아와서 확인)
	const isUser = false;

	const passwordToken = useSearchParams().get("token") ?? "";

	useEffect(() => {
		if (passwordToken) {
			// token을 숨기기 위해 주소를 변경합니다.
			window.history.replaceState(null, "", "/reset-password");
		}
	}, [passwordToken]);

	// 비밀번호 재설정 이메일 전송
	const handleSendEmail = useCallback(
		async (data: FormData) => {
			if (isLoading) return;

			setIsLoading(true);

			try {
				const email = data.get("email") as string;

				const payload: Parameters<(typeof API)["{teamId}/user/send-reset-password-email"]["POST"]>[1] = {
					email,
					// TODO: 추후에 redirectUrl을 변경해야 합니다. env 파일에서 dev, prod를 구분하여 설정해두겠습니다.
					redirectUrl: "http://localhost:3000",
				};

				for (const [key, value] of data.entries()) {
					payload[key as keyof typeof payload] = value as (typeof payload)[keyof typeof payload];
				}

				const response = await API["{teamId}/user/send-reset-password-email"].POST({}, payload);
				// TODO: 전송 성공 시 모달 혹은 토스트 메시지로 알림
				console.log("이메일 전송 성공");
				console.log(response.message);
			} catch (error) {
				// TODO: 전송 실패 시 모달 혹은 토스트 메시지로 알림
				console.log("이메일 전송 실패");
				console.log((error as Error).message);
			} finally {
				setIsLoading(false);
			}
		},
		[isLoading],
	);

	// 비밀번호 재설정
	const handleSubmit = useCallback(
		async (data: FormData) => {
			if (isLoading) return;

			setIsLoading(true);

			try {
				const password = data.get("password") as string;
				const passwordConfirmation = data.get("passwordConfirmation") as string;

				if (!isUser) {
					if (!password || !passwordConfirmation || !passwordToken) {
						console.log(
							"비밀번호 변경 오류. ",
							"\n비밀번호: ",
							password,
							"\n비밀번호 확인: ",
							passwordConfirmation,
							"\n유저: ",
							isUser,
							"\n비밀번호 토큰: ",
							passwordToken,
						);
						setIsLoading(false);
						return;
					}
				}

				// TODO: 유저가 로그인 상태인지 확인
				if (isUser) {
					// 로그인 상태에서 비밀번호 재설정 API 호출
					const payload: Parameters<(typeof API)["{teamId}/user/password"]["PATCH"]>[1] = {
						passwordConfirmation,
						password,
					};

					for (const [key, value] of data.entries()) {
						payload[key as keyof typeof payload] = value as (typeof payload)[keyof typeof payload];
					}

					const response = await API["{teamId}/user/password"].PATCH({}, payload);
					// TODO: 비밀번호 재설정 성공 시 모달 혹은 토스트 메시지로 알림
					console.log("비밀번호 재설정 성공");
					console.log(response.message);
					// router.push("/team-page");
				} else {
					// 비로그인 상태에서 비밀번호 재설정 API 호출
					const payload: Parameters<(typeof API)["{teamId}/user/reset-password"]["PATCH"]>[1] = {
						passwordConfirmation,
						password,
						token: passwordToken,
					};

					for (const [key, value] of data.entries()) {
						payload[key as keyof typeof payload] = value as (typeof payload)[keyof typeof payload];
					}

					const response = await API["{teamId}/user/reset-password"].PATCH({}, payload);
					// TODO: 비밀번호 재설정 성공 시 모달 혹은 토스트 메시지로 알림
					console.log("비밀번호 재설정 성공");
					console.log(response.message);
					// router.push("/login");
				}
			} catch (error) {
				// TODO: 비밀번호 재설정 실패 시 모달 혹은 토스트 메시지로 알림
				console.log("비밀번호 재설정 실패");
				console.log((error as Error).message);
			} finally {
				setIsLoading(false);
			}
		},
		[passwordToken, isLoading, isUser],
	);

	// 비 로그인 상태에서 비밀번호 재설정 링크 전송 페이지
	if (!isUser && !passwordToken) {
		return (
			<main className="h-dvh w-full bg-background-primary">
				<section className="flex size-full flex-col items-center gap-20 pt-36">
					<div className="flex flex-col gap-3">
						<h1 className="text-center text-[40px] font-medium leading-[48px] text-white">비밀번호 재설정</h1>
						<p className="text-center text-xl text-text-primary">비밀번호 재설정 링크를 보내드립니다.</p>
					</div>
					<Form onSubmit={handleSendEmail}>
						<div className="flex w-[460px] flex-col gap-[12px]">
							<label htmlFor="email" className="text-white">
								이메일
							</label>
							<Form.Input
								id="email"
								type="email"
								tests={[
									{
										type: "require",
										data: true,
										error: "이메일을 입력해주세요.",
									},
									{
										type: "pattern",
										data: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										error: "이메일 형식을 확인해주세요.",
									},
								]}
								placeholder="본인 계정의 이메일을 입력해주세요."
							/>
							<Form.Error htmlFor="email" />
							<div className="pt-6" />
							<Form.Button>메일 전송</Form.Button>
						</div>
					</Form>
				</section>
			</main>
		);
	}

	// 비밀번호 재설정 페이지
	return (
		<main className="h-dvh w-full bg-background-primary">
			<section className="flex size-full flex-col items-center gap-20 pt-36">
				<h1 className="text-[40px] font-medium leading-[48px] text-white">비밀번호 재설정</h1>

				<Form onSubmit={handleSubmit}>
					<div className="flex w-[460px] flex-col gap-[12px]">
						<label htmlFor="password" className="text-white">
							새 비밀번호
						</label>
						<div className="relative">
							<Form.Input
								id="password"
								type="password"
								tests={[
									{
										type: "require",
										data: true,
										error: "비밀번호를 입력해주세요.",
									},
									{
										type: "pattern",
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
						</div>

						<Form.Error htmlFor="password" />

						<label htmlFor="passwordConfirmation" className="pt-3 text-white">
							비밀번호 확인
						</label>
						<div className="relative">
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
								placeholder="비밀번호를 다시 한번 입력해주세요."
							/>
						</div>

						<Form.Error htmlFor="passwordConfirmation" />

						<div className="pt-6" />

						<Form.Button>재설정</Form.Button>
					</div>
				</Form>
			</section>
		</main>
	);
}
