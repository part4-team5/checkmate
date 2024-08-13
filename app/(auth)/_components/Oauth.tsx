"use client";

import API from "@/app/_api";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Oauth({ type = "signin" }: { type?: "signin" | "signup" }) {
	let sign = "signin";
	switch (type) {
		case "signin":
			sign = "간편 로그인하기";
			break;
		case "signup":
			sign = "간편 회원가입하기";
			break;
		default:
			sign = "간편 로그인하기";
			break;
	}

	return (
		<div className="flex flex-col pt-6 text-lg text-text-primary">
			<div className="flex items-center justify-center">
				<div className="w-full border-b border-border-primary/50" />
				<p className="px-5 font-normal">OR</p>
				<div className="w-full border-b border-border-primary/50" />
			</div>

			<div className="pt-4" />

			<div className="flex items-center justify-between">
				<div className="font-medium">{sign}</div>

				<div className="flex gap-4">
					<Oauth.Kakao />
					<Oauth.Google />
				</div>
			</div>
		</div>
	);
}

Oauth.Kakao = function Kakao() {
	const router = useRouter();

	// 카카오 앱 등록 Mutation
	const kakaoAppsMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/oauthApps"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["{teamId}/oauthApps"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["{teamId}/oauthApps"]["POST"]>[1] = {
				appKey: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ?? "",
				provider: "KAKAO",
			};

			return API["{teamId}/oauthApps"].POST({}, payload);
		},
		onSuccess: () => {
			// 카카오 앱 등록 성공 시 카카오 로그인 페이지로 이동
			router.replace(process.env.NEXT_PUBLIC_KAKAO_URL ?? "");
		},
	});

	const handleKakaoApps = () => {
		// TODO: 카카오 앱 등록 한번 실행하면 더 이상 실행하지 않도록 수정
		if (!kakaoAppsMutation.isPending) kakaoAppsMutation.mutate();
		// router.push(process.env.NEXT_PUBLIC_KAKAO_URL ?? "");
	};

	return (
		<button type="button" onClick={handleKakaoApps}>
			<Image src="/icons/kakaotalk.svg" alt="kakao" width={42} height={42} />
		</button>
	);
};

Oauth.Google = function Google() {
	const router = useRouter();

	// 구글 앱 등록 Mutation
	const googleAppsMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/oauthApps"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["{teamId}/oauthApps"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["{teamId}/oauthApps"]["POST"]>[1] = {
				appKey: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
				provider: "GOOGLE",
			};

			return API["{teamId}/oauthApps"].POST({}, payload);
		},
		onSuccess: () => {
			// 구글 앱 등록 성공 시 구글 로그인 페이지로 이동
			router.replace(process.env.NEXT_PUBLIC_GOOGLE_URL ?? "");
		},
	});

	const handleGoogleApps = () => {
		// TODO: 구글 앱 등록 한번 실행하면 더 이상 실행하지 않도록 수정
		if (!googleAppsMutation.isPending) googleAppsMutation.mutate();
		// router.push(process.env.NEXT_PUBLIC_KAKAO_URL ?? "");
	};

	return (
		<button type="button" onClick={handleGoogleApps}>
			<Image src="/icons/google.svg" alt="google" width={42} height={42} />
		</button>
	);
};
