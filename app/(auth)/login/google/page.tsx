"use client";

import API from "@/app/_api";
import useCookie from "@/app/_hooks/useCookie";
import useAuthStore from "@/app/_store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function GoogleLogin() {
	const [token] = useState<string>(useSearchParams().get("code") ?? "");
	const isMounted = useRef(true);
	const router = useRouter();

	const [, setAccessToken] = useCookie<string>("accessToken");
	const [, setRefreshToken] = useCookie<string>("refreshToken");
	const setUser = useAuthStore((state) => state.setUser);

	const queryClient = useQueryClient();

	// 구글 로그인 Mutation
	const googleLoginMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>[1] = {
				redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? "",
				token,
			};

			return API["{teamId}/auth/signIn/{provider}"].POST({ provider: "GOOGLE" }, payload);
		},
		onSuccess: (data) => {
			// 전역 상태에 유저 정보 저장
			setUser({
				id: data.user.id,
				email: data.user.email || "",
				nickname: data.user.nickname,
				image: data.user.image ? data.user.image : null,
			});

			// 쿠키에 토큰 저장
			setAccessToken(data.accessToken);
			setRefreshToken(data.refreshToken);

			queryClient.invalidateQueries({ queryKey: ["user"] });

			router.replace("/");
		},
		onError: (error) => {
			console.log(error);
		},
	});

	useEffect(() => {
		// token이 존재하고, 컴포넌트가 마운트 되었을 때
		if (isMounted.current && token) {
			isMounted.current = false;

			googleLoginMutation.mutate();
		}
	}, [googleLoginMutation, token]);
}
