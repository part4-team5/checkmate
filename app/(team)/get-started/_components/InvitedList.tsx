"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import useAuthStore from "@/app/_store/useAuthStore";
import toast from "@/app/_utils/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function InvitedList() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const user = useAuthStore((state) => state.user);

	const invites = useQuery({
		queryKey: ["invited"],
		queryFn: async () => API["api/invite/{id}"].GET({ id: Number(user?.id) }),
		enabled: !!user,
	});

	const acceptInviteMutation = useMutation<{}, Error, { groupId: number; token: string }>({
		mutationFn: useCallback(
			async ({ token }: { token: string }) => API["{teamId}/groups/accept-invitation"].POST({}, { userEmail: user?.email as string, token }),
			[user?.email],
		),
		onSuccess: (data, { groupId }) => {
			toast.success("팀 초대를 수락했습니다.");

			// 몽고 DB에서 사용자 그룹 정보 업데이트
			API["api/users/{id}"].PATCH({ id: Number(user?.id) }, { groupId });

			rejectInviteMutation.mutate({ id: Number(user?.id), groupId });

			queryClient.invalidateQueries({ queryKey: ["invited"] });
			queryClient.invalidateQueries({ queryKey: ["user"] });

			router.push(`/${groupId}`);
		},
	});

	const rejectInviteMutation = useMutation<{}, Error, { id: number; groupId: number }>({
		mutationFn: useCallback(
			async ({ groupId }: { groupId: number }) => API["api/invite/{id}/groupId/{groupId}"].DELETE({ id: Number(user?.id), groupId }),
			[user?.id],
		),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["invited"] });
		},
	});

	const handleAcceptInvite = async ({ groupId, token }: { groupId: number; token: string }) => {
		if (acceptInviteMutation.isPending) return;
		acceptInviteMutation.mutate({ groupId, token });
	};

	const handleRejectInvite = async ({ id, groupId }: { id: number; groupId: number }) => {
		if (rejectInviteMutation.isPending) return;
		rejectInviteMutation.mutate({
			id,
			groupId,
		});
	};

	if (invites.isPending)
		return (
			<div className="size-full p-8">
				<div className="flex size-full max-h-[40px] items-center justify-center">
					<div className="bg-background-quaternary h-full w-52 animate-pulse rounded-lg" />
					<div className="size-full grow" />
					<div className="bg-background-quaternary size-full max-w-[220px] grow-[2] animate-pulse rounded-lg" />
				</div>

				<ul className="mt-8 max-h-[80%] overflow-y-auto">
					{Array.from({ length: 7 }).map((_, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<li key={index} className="mb-2 w-full animate-pulse">
							<div className="flex items-center gap-3 rounded-md pb-2">
								<div className="bg-background-quaternary h-8 w-8 rounded-lg" />
								<div className="bg-background-quaternary h-8 w-full rounded-lg" />
							</div>
						</li>
					))}
				</ul>
			</div>
		);

	return (
		<div className="size-full max-w-[528px] p-8">
			<div className="flex size-full max-h-[40px] items-center justify-center">
				<p className="w-full grow rounded-lg bg-background-tertiary text-lg font-semibold text-text-primary">초대받은 팀</p>

				<div className="size-full max-w-[220px]">
					<Button variant="outline" href="/join-team">
						참여하기
					</Button>
				</div>
			</div>

			{!invites.data?.length && ( // 초대받은 팀이 없을 때
				<div className="flex size-full flex-col items-center justify-center gap-10">
					<Image src="/images/teamEmpty.webp" alt="team-empty" priority width={400} height={60} />
					<p className="text-lg font-medium text-text-primary">초대받은 팀이 없습니다.</p>
				</div>
			)}

			<ul className="mt-8 flex max-h-[80%] flex-col gap-3 overflow-y-auto pr-2 scrollbar:w-2 scrollbar:rounded-full scrollbar:bg-background-secondary scrollbar-thumb:rounded-full scrollbar-thumb:bg-interaction-inactive/60">
				{invites.data?.map((invited) => (
					<li key={invited.token} className="bg-background-quaternary flex w-full gap-2 rounded-md px-4 py-3">
						<div className="flex w-[60%] items-center gap-3 whitespace-nowrap text-lg font-medium text-text-primary">
							<Image
								src={invited.groupImage ?? "/icons/emptyImage.svg"}
								alt={invited.groupName}
								width={32}
								height={32}
								className="size-8 rounded-lg object-cover"
							/>
							<p className="overflow-x-hidden text-ellipsis">{invited.groupName}</p>
						</div>

						<div className="flex w-full max-w-[160px] gap-2">
							<Button onClick={() => handleAcceptInvite({ groupId: invited.groupId, token: invited.token })}>수락</Button>
							<Button onClick={() => handleRejectInvite({ id: Number(user?.id), groupId: invited.groupId })} variant="outline">
								거절
							</Button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
