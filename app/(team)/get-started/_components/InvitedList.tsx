"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import Icon from "@/app/_icons";
import useAuthStore from "@/app/_store/useAuthStore";
import toast from "@/app/_utils/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function InvitedList({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const user = useAuthStore((state) => state.user);

	const [currentIndex, setCurrentIndex] = useState(0);

	// eslint-disable-next-line no-nested-ternary
	const itemsPerPage = isMobile ? 2 : isTablet ? 4 : 6;

	const invites = useQuery({
		queryKey: ["invited"],
		queryFn: async () => API["api/invite/{id}"].GET({ id: Number(user?.id) }),
		enabled: !!user,
	});

	const nextPage = () => {
		if (user && invites.data && currentIndex < invites.data.length - itemsPerPage) {
			setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
		}
	};

	const prevPage = () => {
		if (currentIndex > 0) {
			setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
		}
	};

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

	useEffect(() => {
		setCurrentIndex(0);
	}, [isMobile, isTablet]);

	const paginatedInvites = invites.data?.slice(currentIndex, currentIndex + itemsPerPage) ?? [];
	const totalPages = Math.ceil((invites.data?.length ?? 0) / itemsPerPage);
	const currentPage = Math.ceil((currentIndex + itemsPerPage) / itemsPerPage);

	return (
		<section className="w-full px-4">
			<p className="w-full grow text-xl font-semibold text-text-primary">초대 받은 팀</p>

			<div className="pt-5" />

			{invites.isPending && (
				<div className="w-full rounded-xl bg-background-secondary p-4">
					{renderLoadingSkeletons(6, "hidden grid-cols-3 grid-rows-2 desktop:grid")}
					{renderLoadingSkeletons(4, "hidden grid-cols-2 grid-rows-2 tablet:grid desktop:hidden")}
					{renderLoadingSkeletons(2, "grid tablet:hidden grid-cols-1 grid-rows-2")}

					<div className="flex size-full h-11 grow items-center justify-center gap-2 pt-4">
						<div className="size-full max-w-5 animate-pulse rounded-md bg-background-tertiary" />

						<p className="size-full max-w-9 animate-pulse rounded-md bg-background-tertiary text-sm" />

						<div className="size-full max-w-5 animate-pulse rounded-md bg-background-tertiary" />
					</div>
				</div>
			)}

			{invites.data && invites.data.length > 0 && (
				<div className="w-full rounded-xl bg-background-secondary p-4 shadow-background-secondary">
					<ul className="grid grid-cols-1 grid-rows-2 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
						{paginatedInvites.map((invite) => (
							<li key={invite.groupId} className="flex items-center gap-2 rounded-lg bg-background-tertiary p-4 text-text-primary shadow-teamCard">
								<div className="relative size-10 min-h-10 min-w-10">
									<Image
										src={invite.groupImage ?? "/icons/emptyImage.svg"}
										alt={invite.groupName}
										fill
										sizes="40px"
										className="rounded-lg object-cover object-center"
									/>
								</div>

								<div className="flex w-full flex-col overflow-hidden whitespace-nowrap">
									<p className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold">{invite.groupName}</p>
									<p className="text-sm text-text-default">{invite.createdAt.toString().split("T")[0]}</p>
								</div>

								<div className="flex h-[80%] min-w-[110px] items-center gap-2">
									<Button onClick={() => handleAcceptInvite({ groupId: invite.groupId, token: invite.token })} variant="primary">
										<Icon.MailAccept width={30} height={28} color="#ffff" />
									</Button>

									<Button onClick={() => handleRejectInvite({ id: invite.id, groupId: invite.groupId })} variant="danger">
										<Icon.MailReject width={30} height={28} color="#fff" />
									</Button>
								</div>
							</li>
						))}
					</ul>

					<div className="flex size-full grow items-center justify-center gap-2 pt-3">
						<button type="button" disabled={currentIndex <= 0} onClick={prevPage} aria-label="prev">
							<Icon.ArrowLeft width={32} height={32} color={currentIndex <= 0 ? "#64748B" : "#94A3B8"} />
						</button>

						<p className="w-max text-md text-text-secondary">
							{currentPage} / {totalPages}
						</p>
						<button type="button" disabled={currentIndex >= invites.data.length - itemsPerPage} onClick={nextPage} aria-label="next">
							<Icon.ArrowRight width={32} height={32} color={currentIndex >= invites.data.length - itemsPerPage ? "#64748B" : "#94A3B8"} />
						</button>
					</div>
				</div>
			)}

			{invites.data && invites.data.length === 0 && (
				<div className="flex h-dvh max-h-[236px] w-full flex-col items-center justify-center rounded-xl bg-background-secondary px-6 pb-4 pt-8">
					<p className="text-center text-text-primary">초대받은 팀이 없습니다.</p>
				</div>
			)}
		</section>
	);
}

const renderLoadingSkeletons = (count: number, colClasses: string) => (
	<ul className={`gap-4 ${colClasses}`}>
		{Array.from({ length: count }).map((_, index) => (
			// eslint-disable-next-line react/no-array-index-key
			<li key={index} className="flex h-[72px] animate-pulse gap-3 rounded-lg bg-background-tertiary px-4 py-3">
				<div className="size-12 rounded-lg bg-background-quaternary" />
				<p className="w-full rounded-lg bg-background-quaternary" />
			</li>
		))}
	</ul>
);
