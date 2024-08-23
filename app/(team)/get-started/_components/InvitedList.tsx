"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import useAuthStore from "@/app/_store/useAuthStore";
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

	return (
		<div className="size-full max-w-screen-tablet rounded-lg bg-background-secondary px-2 py-3">
			<p className="rounded-lg bg-background-tertiary px-6 py-2 text-xl font-semibold text-text-primary">초대받은 팀</p>
			<ul className="size-full max-h-[60dvh] min-h-28 max-w-screen-tablet overflow-y-auto px-3 scrollbar:w-2 scrollbar:rounded-full scrollbar:bg-background-primary scrollbar-thumb:rounded-full scrollbar-thumb:bg-background-tertiary">
				{invites.data?.map((invited) => (
					<li key={invited.token} className="mb-2 flex w-full text-text-primary">
						<div className="flex grow items-center gap-3 whitespace-nowrap rounded-md p-2 text-lg font-medium text-text-primary">
							<Image
								src={invited.groupImage ?? "/icons/emptyImage.svg"}
								alt={invited.groupName}
								width={32}
								height={32}
								className="size-8 rounded-lg object-cover"
							/>
							<div>{invited.groupName}</div>
						</div>

						<div className="flex max-w-[400px] grow gap-3 py-5">
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
