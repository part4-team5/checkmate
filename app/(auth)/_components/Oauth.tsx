"use client";

import API from "@/app/_api";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
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
				appKey: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ?? "",
				provider: "KAKAO",
			};

			return API["{teamId}/oauthApps"].POST({}, payload);
		},
		onSuccess: () => {
			router.push(process.env.NEXT_PUBLIC_KAKAO_URL ?? "");
		},
	});

	const kakaoLoginMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>[1] = {
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
		<button type="button" onClick={handleKakaoApps}>
			<Image src="/icons/kakaotalk.svg" alt="kakao" width={32} height={32} />
		</button>
	);
};

Oauth.Google = function Google() {
	const [token, setToken] = useState<string>("");
	const router = useRouter();
	const isMounted = useRef(true);

	const googleAppsMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/oauthApps"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["{teamId}/oauthApps"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["{teamId}/oauthApps"]["POST"]>[1] = {
				appKey: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
				provider: "GOOGLE",
			};

			return API["{teamId}/oauthApps"].POST({}, payload);
		},
		onSuccess: () => {
			router.push(process.env.NEXT_PUBLIC_GOOGLE_URL ?? "");
		},
	});

	const googleLoginMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>[1] = {
				redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "",
				token,
			};

			return API["{teamId}/auth/signIn/{provider}"].POST({ provider: "GOOGLE" }, payload);
		},
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			console.log(error);
		},
	});

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");
		if (isMounted.current && code) {
			isMounted.current = false;
			setToken(code);
			googleLoginMutation.mutate();
		}
	}, [googleLoginMutation]);

	const handleGoogleApps = () => {
		// TODO: 구글 앱 등록 한번 실행하면 더 이상 실행하지 않도록 수정
		if (!googleAppsMutation.isPending) googleAppsMutation.mutate();
		// router.push(process.env.NEXT_PUBLIC_KAKAO_URL ?? "");
	};

	return (
		<button type="button" onClick={handleGoogleApps}>
			<Image src="/icons/google.svg" alt="google" width={32} height={32} />
		</button>
	);
};
