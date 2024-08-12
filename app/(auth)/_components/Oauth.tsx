"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Oauth() {}

Oauth.Kakao = function Kakao() {
	const [token] = useState<string>(useSearchParams().get("code") ?? "");
	const router = useRouter();
	const isMounted = useRef(true);

	const kakaoAppsMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/oauthApps"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["{teamId}/oauthApps"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["{teamId}/oauthApps"]["POST"]>[1] = {
				appSecret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET ?? "",
				appKey: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ?? "",
				provider: "KAKAO",
			};

			const response = await API["{teamId}/oauthApps"].POST({}, payload);

			return response;
		},
		onSuccess: () => {
			router.push(process.env.NEXT_PUBLIC_KAKAO_URL ?? "");
		},
	});

	const kakaoLoginMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>[1] = {
				state: "signin",
				redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? "",
				token,
			};

			return API["{teamId}/auth/signIn/{provider}"].POST({ provider: "KAKAO" }, payload);
		},
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			console.log(error);
		},
	});

	useEffect(() => {
		if (isMounted.current) {
			isMounted.current = false;

			if (token) {
				kakaoLoginMutation.mutate();
			}
		}
	}, [kakaoLoginMutation, token]);

	const handleKakaoApps = () => {
		// TODO: 카카오 앱 등록 한번 실행하면 더 이상 실행하지 않도록 수정
		if (!kakaoAppsMutation.isPending) kakaoAppsMutation.mutate();
		// router.push(process.env.NEXT_PUBLIC_KAKAO_URL ?? "");
	};

	return (
		<div>
			<Button onClick={handleKakaoApps}>카카오 로그인</Button>
		</div>
	);
};
