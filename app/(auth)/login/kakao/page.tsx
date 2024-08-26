"use client";

import API from "@/app/_api";
import useCookie from "@/app/_hooks/useCookie";
import useAuthStore from "@/app/_store/useAuthStore";
import toast from "@/app/_utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function KakaoLogin() {
	const [token] = useState<string>(useSearchParams().get("code") ?? "");
	const [isMounted, setIsMounted] = useState(false);
	const router = useRouter();

	const [, setAccessToken] = useCookie<string>("accessToken");
	const [, setRefreshToken] = useCookie<string>("refreshToken");
	const setUser = useAuthStore((state) => state.setUser);

	const queryClient = useQueryClient();

	const userUploadMutation = useMutation({
		mutationFn: async ({ id, email }: { id: number; email: string }) => API["api/users"].POST({}, { id, email }),
	});

	// 카카오 로그인 Mutation
	const kakaoLoginMutation = useMutation<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>, Error>({
		mutationFn: async (): Promise<Awaited<ReturnType<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>>> => {
			const payload: Parameters<(typeof API)["{teamId}/auth/signIn/{provider}"]["POST"]>[1] = {
				redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI as string,
				token,
			};

			return API["{teamId}/auth/signIn/{provider}"].POST({ provider: "KAKAO" }, payload);
		},
		onSuccess: (data) => {
			toast.success("로그인에 성공했습니다.");

			queryClient.invalidateQueries({ queryKey: ["user"] });

			// 전역 상태에 유저 정보 저장
			setUser({
				id: data.user.id,
				email: data.user.email as string,
				nickname: data.user.nickname,
				image: data.user.image ? data.user.image : null,
			});

			// 몽고 DB에 유저 정보 저장
			userUploadMutation.mutate({ id: data.user.id, email: data.user.email as string });

			// 쿠키에 토큰 저장
			setAccessToken(data.accessToken);
			setRefreshToken(data.refreshToken);

			router.replace("/");
		},
		onError: () => {
			toast.error("로그인 도중 문제가 발생했습니다.");
		},
	});

	useEffect(() => {
		// token이 존재하고, 컴포넌트가 마운트 되었을 때
		if (!isMounted && token) {
			setIsMounted(true);

			kakaoLoginMutation.mutate();
		}
	}, [isMounted, kakaoLoginMutation, token]);
}
