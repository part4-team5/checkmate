// /* eslint-disable no-console */
// /* eslint-disable no-alert */
// /* eslint-disable no-restricted-syntax */

// "use client";

// import Form from "@/app/_components/Form";
// import VisibilityOff from "@/public/icons/VisibilityOffIcon";
// import VisibilityOn from "@/public/icons/VisibilityOnIcon";
// import { useSearchParams } from "next/navigation";
// import { useCallback, useEffect, useState } from "react";

// export default function ResetPasswordPage() {
// 	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
// 	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

// 	const [isLoading, setIsLoading] = useState(false);

// 	// TODO: 로그인 상태 확인
// 	const isUser = true;

// 	const passwordToken = useSearchParams().get("token");

// 	useEffect(() => {
// 		if (passwordToken) {
// 			// token을 숨기기 위해 주소를 변경합니다.
// 			window.history.replaceState(null, "", "/reset-password");
// 		}
// 	}, [passwordToken]);

// 	// 비밀번호 재설정 이메일 전송
// 	const handleSendEmail = useCallback(
// 		async (data: FormData) => {
// 			if (isLoading) return;

// 			setIsLoading(true);

// 			const email = data.get("email") as string;

// 			if (!email) {
// 				console.log("이메일을 입력해주세요. ", email);
// 				setIsLoading(false);
// 				return;
// 			}

// 			try {
// 				const response = await fetch("https://fe-project-cowokers.vercel.app/6-5/user/send-reset-password-email", {
// 					method: "POST",
// 					headers: {
// 						"Content-Type": "application/json",
// 					},
// 					body: JSON.stringify({
// 						email: "",
// 						redirectUrl: "http://localhost:3000",
// 					}),
// 				});

// 				if (!response.ok) {
// 					throw new Error("이메일 전송에 실패했습니다.");
// 				}

// 				alert("이메일이 성공적으로 전송되었습니다.");
// 			} catch (error) {
// 				alert((error as Error).message);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		},
// 		[isLoading],
// 	);

// 	// 비밀번호 재설정
// 	const handleSubmit = useCallback(
// 		async (data: FormData) => {
// 			if (isLoading) return;

// 			setIsLoading(true);

// 			const password = data.get("password") as string;
// 			const passwordConfirm = data.get("passwordConfirm") as string;

// 			if (!isUser) {
// 				if (!password || !passwordConfirm || !passwordToken) {
// 					console.log(
// 						"비밀번호 변경 오류. ",
// 						"\n비밀번호: ",
// 						password,
// 						"\n비밀번호 확인: ",
// 						passwordConfirm,
// 						"\n유저: ",
// 						isUser,
// 						"\n비밀번호 토큰: ",
// 						passwordToken,
// 					);
// 					setIsLoading(false);
// 					return;
// 				}
// 			}

// 			try {
// 				// TODO: 로그인 상태 확인
// 				if (isUser) {
// 					// 로그인 상태에서 비밀번호 재설정 API 호출
// 					const response = await fetch("https://fe-project-cowokers.vercel.app/6-5/user/password", {
// 						method: "PATCH",
// 						headers: {
// 							"Content-Type": "application/json",
// 						},
// 						body: JSON.stringify({
// 							password,
// 							passwordConfirm,
// 						}),
// 					});

// 					if (!response.ok) {
// 						throw new Error("비밀번호 재설정에 실패했습니다.");
// 					}
// 				} else {
// 					// 비로그인 상태에서 비밀번호 재설정 API 호출
// 					const response = await fetch("https://fe-project-cowokers.vercel.app/6-5/user/reset-password", {
// 						method: "PATCH",
// 						headers: {
// 							"Content-Type": "application/json",
// 						},
// 						body: JSON.stringify({
// 							password,
// 							passwordConfirm,
// 							token: passwordToken,
// 						}),
// 					});

// 					if (!response.ok) {
// 						throw new Error("비밀번호 재설정에 실패했습니다. (토큰)");
// 					}
// 				}

// 				alert("비밀번호가 성공적으로 재설정되었습니다.");
// 			} catch (error) {
// 				alert((error as Error).message);
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		},
// 		[passwordToken, isLoading, isUser],
// 	);

// 	const togglePasswordVisibility = () => {
// 		setIsPasswordVisible(!isPasswordVisible);
// 	};

// 	const toggleConfirmPasswordVisibility = () => {
// 		setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
// 	};

// 	if (!isUser && !passwordToken) {
// 		return (
// 			<main className="h-dvh w-full bg-background-primary">
// 				<section className="flex size-full flex-col items-center gap-20 pt-36">
// 					<div className="flex flex-col gap-3">
// 						<h1 className="text-center text-[40px] font-medium leading-[48px] text-white">비밀번호 재설정</h1>
// 						<p className="text-center text-xl text-text-primary">비밀번호 재설정 링크를 보내드립니다.</p>
// 					</div>
// 					<Form onSubmit={handleSendEmail}>
// 						<div className="flex w-[460px] flex-col gap-[12px]">
// 							<label htmlFor="email" className="text-white">
// 								이메일
// 							</label>
// 							<Form.Input
// 								id="email"
// 								type="email"
// 								tests={[
// 									{
// 										type: "require",
// 										data: true,
// 										error: "이메일을 입력해주세요.",
// 									},
// 									{
// 										type: "pattern",
// 										data: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
// 										error: "이메일 형식을 확인해주세요.",
// 									},
// 								]}
// 								placeholder="본인 계정의 이메일을 입력해주세요."
// 							/>
// 							<Form.Error htmlFor="email" />
// 							<div className="pt-6" />
// 							<Form.Button>메일 전송</Form.Button>
// 						</div>
// 					</Form>
// 				</section>
// 			</main>
// 		);
// 	}
// 	return (
// 		<main className="h-dvh w-full bg-background-primary">
// 			<section className="flex size-full flex-col items-center gap-20 pt-36">
// 				<h1 className="text-[40px] font-medium leading-[48px] text-white">비밀번호 재설정</h1>

// 				<Form onSubmit={handleSubmit}>
// 					<div className="flex w-[460px] flex-col gap-[12px]">
// 						<label htmlFor="password" className="text-white">
// 							새 비밀번호
// 						</label>
// 						<div className="relative">
// 							<Form.Input
// 								id="password"
// 								type={isPasswordVisible ? "text" : "password"}
// 								tests={[
// 									{
// 										type: "require",
// 										data: true,
// 										error: "비밀번호를 입력해주세요.",
// 									},
// 									{
// 										type: "pattern",
// 										data: /^[a-zA-Z0-9!@#%^&*]*$/,
// 										error: "비밀번호는 숫자, 영문, 특수문자만 가능합니다.",
// 									},
// 									{
// 										type: "minlength",
// 										data: 8,
// 										error: "비밀번호는 최소 8자입니다.",
// 									},
// 									{
// 										type: "maxlength",
// 										data: 20,
// 										error: "비밀번호는 최대 20자입니다.",
// 									},
// 								]}
// 								placeholder="비밀번호를 입력해주세요."
// 							/>

// 							{/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
// 							<button type="button" className="absolute right-3 top-4" onClick={togglePasswordVisibility}>
// 								<div className={isPasswordVisible ? "hidden" : "block"}>
// 									<VisibilityOff width={20} height={18} />
// 								</div>
// 								<div className={isPasswordVisible ? "block" : "hidden"}>
// 									<VisibilityOn width={20} height={18} />
// 								</div>
// 							</button>
// 						</div>

// 						<Form.Error htmlFor="password" />

// 						<label htmlFor="passwordConfirm" className="pt-3 text-white">
// 							비밀번호 확인
// 						</label>
// 						<div className="relative">
// 							<Form.Input
// 								id="passwordConfirm"
// 								type={isConfirmPasswordVisible ? "text" : "password"}
// 								tests={[
// 									{
// 										type: "sync",
// 										data: "password",
// 										error: "비밀번호가 일치하지 않습니다.",
// 									},
// 									{
// 										type: "require",
// 										data: true,
// 										error: "비밀번호를 입력해주세요.",
// 									},
// 								]}
// 								placeholder="비밀번호를 다시 한번 입력해주세요."
// 							/>

// 							{/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
// 							<button type="button" className="absolute right-3 top-4" onClick={toggleConfirmPasswordVisibility}>
// 								<div className={isConfirmPasswordVisible ? "hidden" : "block"}>
// 									<VisibilityOff width={20} height={18} />
// 								</div>
// 								<div className={isConfirmPasswordVisible ? "block" : "hidden"}>
// 									<VisibilityOn width={20} height={18} />
// 								</div>
// 							</button>
// 						</div>

// 						<Form.Error htmlFor="passwordConfirm" />

// 						<div className="pt-6" />

// 						<Form.Button>재설정</Form.Button>
// 					</div>
// 				</Form>
// 			</section>
// 		</main>
// 	);
// }
