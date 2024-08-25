"use client";

import API from "@/app/_api";
import useAuthStore from "@/app/_store/useAuthStore";
import toast from "@/app/_utils/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

type InviteType = Awaited<ReturnType<(typeof API)["api/invite/link/{key}"]["GET"]>>;

export default function JoinTeam({ inviteKey }: { inviteKey: string }) {
	const user = useAuthStore((state) => state.user);
	const userEmail = user?.email as string;

	// useEffect 내부에서 한 번만 실행되도록 합니다. useEffect가 개발 환경에서 strict mode일 때 state를 사용하면 두 번 실행이 됩니다.
	const isMounted = useRef<boolean>(false);

	const queryClient = useQueryClient();

	const router = useRouter();

	// 팀 참여 요청을 보내는 mutation
	const joinTeamMutation = useMutation<{ groupId: number }, Error, { token: string }>({
		mutationFn: async ({ token }: { token: string }) => API["{teamId}/groups/accept-invitation"].POST({}, { token, userEmail }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });

			router.replace(`/${data.groupId}`);
		},
		onError: (error) => {
			toast.error(error.message);
			router.replace("/");
		},
	});

	const getInvitedMutation = useMutation<InviteType, Error, { key: string }>({
		mutationFn: useCallback(async ({ key }: { key: string }) => API["api/invite/link/{key}"].GET({ key }), []),
		onSuccess: (data) => {
			joinTeamMutation.mutate({ token: data.token });
		},
		onError: (error) => {
			toast.error(error.message);
			router.replace("/");
		},
	});

	useEffect(() => {
		// 한 번만 실행되도록 합니다.
		if (inviteKey && !isMounted.current) {
			isMounted.current = true;

			getInvitedMutation.mutate({ key: inviteKey });
		}
	}, [inviteKey, joinTeamMutation, isMounted, getInvitedMutation]);

	return (
		<main className="size-full">
			<section className="flex size-full flex-col items-center justify-center gap-20 pt-40 text-3xl font-bold text-text-default">
				<Image src="/images/teamEmpty.webp" alt="loading" width={800} height={500} />
				팀에 참가 중입니다. 잠시만 기다려주세요.
			</section>
		</main>
	);
}
