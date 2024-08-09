/* eslint-disable no-restricted-syntax */

"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import Form from "@/app/_components/Form";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import useOverlay from "@/app/_hooks/useOverlay";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

function ResetPasswordForm() {
	// TODO: 로그인 상태 확인 (테스트 용으로 false로 설정 추후에 User 정보를 받아와서 확인)
	const isUser = false;

	const overlay = useOverlay();

	const [passwordToken] = useState<string | null>(useSearchParams().get("token"));

	const openModal = useCallback(
		({ title, message, isEmail, isSuccess = true }: { title: string; message: string; isEmail: boolean; isSuccess?: boolean }) => {
			overlay.open(({ close }) => (
				<ModalWrapper close={close}>
					<div className="flex h-max w-72 flex-col gap-7">
						<p className="flex items-center justify-center pt-5 text-xl font-semibold">{title}</p>
						{isSuccess && isEmail && (
							<p className="flex flex-grow items-center justify-center text-center">
								{message} 로 <br /> 비밀번호 재설정 주소를 전송했습니다.
							</p>
						)}

						<div className="flex gap-2">
							{isSuccess && passwordToken && (
								<div className="h-12 w-full">
									<Button variant="primary" onClick={() => window.history.pushState(null, "", "/login")}>
										로그인
									</Button>
								</div>
							)}
							<div className="h-12 w-full">
								<Button variant="secondary" onClick={close}>
									닫기
								</Button>
							</div>
						</div>
					</div>
				</ModalWrapper>
			));
		},
		[overlay, passwordToken],
	);

	useEffect(() => {
		if (passwordToken) {
			// token을 숨기기 위해 주소를 변경합니다.
			window.history.replaceState(null, "", "/reset-password");
		}
	}, [passwordToken]);

	// 비밀번호 재설정 링크 이메일 전송 Mutation (tanstack/react-query)
	const sendEmailMutation = useMutation<{ message: string }, Error, FormContext>({
		mutationFn: async (ctx: FormContext): Promise<{ message: string }> => {
			const formData = new FormData();
			for (const [key, value] of Object.entries(ctx.values)) {
				formData.append(key, value as string);
			}

			const email = formData.get("email") as string;

			const payload: Parameters<(typeof API)["{teamId}/user/send-reset-password-email"]["POST"]>[1] = {
				email,
				redirectUrl: process.env.NEXT_PUBLIC_REDIRECT_URL ?? "",
			};

			for (const [key, value] of formData.entries()) {
				payload[key as keyof typeof payload] = value as (typeof payload)[keyof typeof payload];
			}

			const response = await API["{teamId}/user/send-reset-password-email"].POST({}, payload);

			return response;
		},
		onSuccess: (data, ctx) => {
			openModal({ title: "이메일 전송 성공", message: `${ctx.values.email as string}`, isEmail: true });
		},
		onError: (error, ctx) => {
			ctx.setError("email", error.message);
		},
	});

	// 비밀번호 재설정 Mutation (tanstack/react-query)
	const passwordResetMutation = useMutation<{ message: string }, Error, FormContext>({
		mutationFn: async (ctx: FormContext): Promise<{ message: string }> => {
			const formData = new FormData();
			for (const [key, value] of Object.entries(ctx.values)) {
				formData.append(key, value as string);
			}

			const password = formData.get("password") as string;
			const passwordConfirmation = formData.get("passwordConfirmation") as string;

			// 유저가 로그인 상태인지 확인
			if (!isUser) {
				if (!password || !passwordConfirmation || !passwordToken) {
					return { message: "비밀번호 변경 오류" };
				}

				// 비로그인 상태에서 비밀번호 재설정 API 호출
				const payload: Parameters<(typeof API)["{teamId}/user/reset-password"]["PATCH"]>[1] = {
					passwordConfirmation,
					password,
					token: passwordToken,
				};

				for (const [key, value] of formData.entries()) {
					payload[key as keyof typeof payload] = value as (typeof payload)[keyof typeof payload];
				}

				const response = await API["{teamId}/user/reset-password"].PATCH({}, payload);

				return response;
			}

			// 로그인 상태에서 비밀번호 재설정 API 호출
			const payload: Parameters<(typeof API)["{teamId}/user/password"]["PATCH"]>[1] = {
				passwordConfirmation,
				password,
			};

			for (const [key, value] of formData.entries()) {
				payload[key as keyof typeof payload] = value as (typeof payload)[keyof typeof payload];
			}

			const response = await API["{teamId}/user/password"].PATCH({}, payload);
			return response;
		},
		onSuccess: (data) => {
			openModal({ title: "비밀번호 재설정 성공", message: data.message, isEmail: false });
		},
		onError: (error) => {
			openModal({ title: "비밀번호 재설정 실패", message: error.message, isEmail: false });
		},
	});

	const handleSendEmail = useCallback(
		(ctx: FormContext) => {
			if (sendEmailMutation.isPending) return;

			sendEmailMutation.mutate(ctx);
		},
		[sendEmailMutation],
	);

	const handleSubmit = useCallback(
		(ctx: FormContext) => {
			if (passwordResetMutation.isPending) return;

			passwordResetMutation.mutate(ctx);
		},
		[passwordResetMutation],
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
										type: "match",
										data: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										error: "이메일 형식을 확인해주세요.",
									},
								]}
								placeholder="본인 계정의 이메일을 입력해주세요."
							/>
							<Form.Error htmlFor="email" />
							<div className="pt-6" />

							<div className="h-12">{sendEmailMutation.isPending ? <Button disabled>전송 중...</Button> : <Form.Submit>전송</Form.Submit>}</div>
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

						<div className="h-12">
							<Form.Submit>재설정</Form.Submit>
						</div>
					</div>
				</Form>
			</section>
		</main>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense>
			<ResetPasswordForm />
		</Suspense>
	);
}
