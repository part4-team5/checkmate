/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */

"use client";

import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import UserInfo from "@/app/(team)/[id]/_component/UserInfo";
import API from "@/app/_api";
import useOverlay from "@/app/_hooks/useOverlay";
import MemberInvite from "@/app/_components/modal-contents/MemberInvite";
import MemberProfile from "@/app/_components/modal-contents/MemberProfile";
import ToastPopup from "@/app/(team)/[id]/_component/ToastPopup";
import { ReportProps } from "./Report";

type Team = Awaited<ReturnType<(typeof API)["{teamId}/groups/{id}"]["GET"]>>;
type Token = string;

function Members({ id }: ReportProps) {
	const overlay = useOverlay();
	const [showToast, setShowToast] = useState(false);

	const fetchGroupInfo = useCallback((): Promise<Team> => API["{teamId}/groups/{id}"].GET({ id }), [id]);

	const getInvitationLink = useCallback((): Promise<Token> => API["{teamId}/groups/{id}/invitation"].GET({ id }), [id]);

	const { refetch } = useQuery<Token>({
		queryKey: ["invitationLink", id],
		queryFn: getInvitationLink,
		enabled: false,
	});

	const { data, isLoading, error } = useQuery<Team>({
		queryKey: ["groupInfo", id],
		queryFn: fetchGroupInfo,
		enabled: !!id,
		refetchInterval: 60000,
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const { data: user } = useQuery({
		queryKey: ["user"],
		queryFn: async () => API["{teamId}/user"].GET({}),
	});

	const handleProfileModal = useCallback(
		(member: { userName: string; userEmail: string; userImage?: string }) => {
			overlay.open(({ close }) => <MemberProfile userName={member.userName} email={member.userEmail} close={close} userProfile={member.userImage || ""} />);
		},
		[overlay],
	);

	const handleLinkCopy = async () => {
		const { data: invitationToken } = await refetch();

		if (invitationToken) {
			const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL ?? "";
			const params = new URLSearchParams({
				groupId: String(id),
				token: invitationToken,
			});
			const invitationUrl = `${redirectUrl}/join-team?${params.toString()}`;
			await navigator.clipboard.writeText(invitationUrl);

			setShowToast(true);
			setTimeout(() => {
				setShowToast(false);
			}, 2000);
		} else {
			console.error("초대 토큰을 가져오는 데 실패했습니다");
		}
	};

	const handleInviteClick = () => {
		overlay.open(({ close }) => <MemberInvite onClick={handleLinkCopy} close={close} />);
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>오류 발생: {error instanceof Error ? error.message : "Unknown error"}</div>;

	const members = data?.members || [];

	const isAdmin = user?.memberships.some((membership) => membership.groupId === id && membership.role === "ADMIN");

	return (
		<main className="mt-[48px]">
			{showToast && <ToastPopup message="링크가 복사되었습니다!" position="bottom" />}
			<section className="flex justify-between">
				<div className="flex gap-[8px]">
					<p className="text-[16px] font-medium">멤버</p>
					<p className="text-[16px] text-[#64748B]"> ({members.length}명)</p>
				</div>
				{isAdmin && (
					<button onClick={handleInviteClick} className="text-[14px] font-normal text-brand-primary" type="button">
						+새로운 멤버 초대하기
					</button>
				)}
			</section>
			<section className="mt-[24px]">
				<div className="grid grid-cols-2 gap-4 tablet:grid-cols-3">
					{members.map((member) => (
						<div
							key={member.userId}
							className="flex h-[68px] min-w-[164px] cursor-pointer items-center justify-start rounded-[16px] bg-background-secondary px-[16px]"
							role="button"
							aria-label={`${member.userName}의 프로필 열기`}
							onClick={() => handleProfileModal(member)}
						>
							<UserInfo userName={member.userName} userEmail={member.userEmail} userProfile={member.userImage ?? ""} isAdmin={member.role === "ADMIN"} />
						</div>
					))}
				</div>
			</section>
		</main>
	);
}

export default Members;
