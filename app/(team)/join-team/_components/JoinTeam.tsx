"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import Icon from "@/app/_icons";
import useAuthStore from "@/app/_store/useAuthStore";
import toast from "@/app/_utils/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type InviteType = Awaited<ReturnType<(typeof API)["api/invite/link/{key}"]["GET"]>>;

export default function JoinTeam({ inviteKey }: { inviteKey: string }) {
	const user = useAuthStore((state) => state.user);
	const userEmail = user?.email as string;

	const [inviteGroup, setInviteGroup] = useState<InviteType>();

	const { data: groups } = useQuery({
		queryKey: ["user"],
		queryFn: async () => API["{teamId}/user"].GET({}),
	});

	// useEffect 내부에서 한 번만 실행되도록 합니다. useEffect가 개발 환경에서 strict mode일 때 state를 사용하면 두 번 실행이 됩니다.
	const isMounted = useRef<boolean>(false);

	const queryClient = useQueryClient();

	const router = useRouter();

	// 팀 참여 요청을 보내는 mutation
	const joinTeamMutation = useMutation<{ groupId: number }, Error, { token: string }>({
		mutationFn: async ({ token }: { token: string }) => API["{teamId}/groups/accept-invitation"].POST({}, { token, userEmail }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["user"] });

			toast.success("팀에 참여했습니다.");

			router.replace(`/${data.groupId}`);
		},
		onError: (error) => {
			toast.error(error.message);
			router.replace("/");
		},
	});

	// 초대 링크를 통해 초대된 팀 정보를 가져오는 mutation
	const getInvitedMutation = useMutation<InviteType, Error, { key: string }>({
		mutationFn: useCallback(async ({ key }: { key: string }) => API["api/invite/link/{key}"].GET({ key }), []),
		onSuccess: (data) => {
			setInviteGroup(data);
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

	const handleAccept = useCallback(() => {
		joinTeamMutation.mutate({ token: inviteGroup?.token as string });
	}, [inviteGroup?.token, joinTeamMutation]);

	const handleReject = useCallback(() => {
		router.replace("/get-started");
	}, [router]);

	return (
		<main className="size-full">
			<section className="flex size-full flex-col items-center justify-center gap-20 px-4 pt-40 font-bold text-text-default">
				<div className="flex w-full max-w-[500px] flex-col items-center justify-center rounded-xl bg-background-secondary p-8 shadow-background-secondary">
					<p className="text-2xl font-bold text-brand-primary">팀 참여 요청</p>
					{!inviteGroup ? (
						<div className="flex w-full flex-col items-center">
							<div className="my-4 flex size-[60px] min-h-[60px] min-w-[60px] items-center justify-center rounded-lg bg-background-tertiary shadow-background-tertiary" />

							<div className="flex size-full flex-col items-center">
								<div className="h-dvh max-h-6 w-dvw max-w-[280px] rounded-lg bg-background-tertiary shadow-background-tertiary" />
								<div className="pt-3" />
								<div className="h-dvh max-h-6 w-dvw max-w-[200px] rounded-lg bg-background-tertiary shadow-background-tertiary" />

								<div className="pt-8" />

								<div className="flex h-12 w-full items-center justify-center gap-10">
									<div className="size-full rounded-lg bg-background-tertiary shadow-background-tertiary" />
									<div className="size-full rounded-lg bg-background-tertiary shadow-background-tertiary" />
								</div>
							</div>
						</div>
					) : (
						<>
							<div className="relative my-4 flex size-[60px] min-h-[60px] min-w-[60px] items-center justify-center rounded-lg">
								{inviteGroup?.groupImage ? (
									<Image src={inviteGroup?.groupImage} alt="groupImage" fill className="rounded-lg" />
								) : (
									<Icon.EmptyImage width={60} height={60} />
								)}
							</div>

							<div className="size-full">
								<p className="text-center text-2xl text-text-primary">&quot;{inviteGroup?.groupName}&quot;</p>
								<div className="pt-3" />

								{groups?.memberships.find((membership) => membership.groupId === inviteGroup?.groupId && !joinTeamMutation.isSuccess) ? (
									<div className="flex flex-col items-center justify-center">
										<p className="text-center text-xl text-text-primary">이미 참여 중인 팀입니다.</p>

										<div className="pt-3" />
										<div className="w-full max-w-[300px]">
											<Button variant="outline" fontSize="xl" onClick={() => router.push("/get-started")}>
												돌아가기
											</Button>
										</div>
									</div>
								) : (
									<>
										<p className="text-center text-xl text-text-primary">팀에서 당신을 초대했습니다.</p>

										<div className="pt-8" />
										{joinTeamMutation.isPending ? (
											<div className="flex h-12 items-center justify-center">
												<Button disabled fontSize="xl">
													참여중...
												</Button>
											</div>
										) : (
											<div className="flex h-12 items-center justify-center gap-10">
												<Button onClick={handleAccept} fontSize="xl">
													참여
												</Button>
												<Button variant="outline" fontSize="xl" onClick={handleReject}>
													거절
												</Button>
											</div>
										)}
									</>
								)}
							</div>
						</>
					)}
				</div>
			</section>
		</main>
	);
}
