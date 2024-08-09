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
	const isMounted = useRef(false);

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
		onSuccess: (data) => {
			console.log(data);
			router.push(process.env.NEXT_PUBLIC_KAKAO_URL ?? "");
		},
	});

	const kakaoLoginMutation = useMutation<Awaited<ReturnType<(typeof API)["/{teamId}/auth/signIn/{provider}"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["/{teamId}/auth/signIn/{provider}"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["/{teamId}/auth/signIn/{provider}"]["POST"]>[1] = {
				state: "signin",
				redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ?? "",
				token,
			};

			const response = await API["/{teamId}/auth/signIn/{provider}"].POST({ provider: "KAKAO" }, payload);

			console.log(response);
			return response;
		},
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			console.log(error);
		},
	});

	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}

		if (kakaoLoginMutation.isPending) return;
		if (kakaoLoginMutation.isError) return;

		const handleKakaoLogin = () => {
			kakaoLoginMutation.mutate();
		};

		if (token) {
			handleKakaoLogin();
		}
	}, [kakaoLoginMutation, token]);

	const handleKakaoApps = () => {
		if (!kakaoAppsMutation.isPending) kakaoAppsMutation.mutate();
	};

	return (
		<div>
			<Button onClick={handleKakaoApps}>카카오 로그인</Button>
		</div>
	);
};
