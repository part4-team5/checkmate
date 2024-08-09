"use client";

/* eslint-disable react/no-unstable-nested-components */

import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useCallback } from "react";
import UserInfo from "@/app/(team)/[id]/_component/UserInfo";
import API from "@/app/_api";
import useOverlay from "@/app/_hooks/useOverlay";
import MemberInvite from "@/app/_components/modal-contents/MemberInvite";
import MemberProfile from "@/app/_components/modal-contents/MemberProfile";
import { ReportProps } from "./Report";

type Team = Awaited<ReturnType<(typeof API)["{teamId}/groups/{id}"]["GET"]>>;
type Token = string;

function Members({ id }: ReportProps) {
	const overlay = useOverlay();

	const fetchGroupInfo = useCallback(
		(): Promise<Team> =>
			API["{teamId}/groups/{id}"]
				.GET({ id: Number(id) })
				.then((response) => response)
				.catch((error) => {
					throw error;
				}),
		[id],
	);

	const getInvitationLink = useCallback(
		(): Promise<Token> =>
			API["{teamId}/groups/{id}/invitation"]
				.GET({ id: Number(id) })
				.then((response) => response)
				.catch((error) => {
					throw error;
				}),
		[id],
	);

	const { mutate: copyLink } = useMutation<string, Error, void>({
		mutationFn: getInvitationLink,
		onSuccess: (token: string) => {
			navigator.clipboard.writeText(token);
		},
	});

	const { data, isLoading, error } = useQuery<Team>({
		queryKey: ["groupInfo", id],
		queryFn: fetchGroupInfo,
		enabled: !!id,
		refetchInterval: 60000,
		staleTime: 10000,
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});

	const handleProfileModal = useCallback(
		(member: { userName: string; userEmail: string; userImage?: string }) => {
			overlay.open(({ close }) => <MemberProfile userName={member.userName} email={member.userEmail} close={close} userProfile={member.userImage || ""} />);
		},
		[overlay],
	);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>오류 발생: {error instanceof Error ? error.message : "Unknown error"}</div>;

	const members = data?.members || [];

	const handleLinkCopy = () => {
		copyLink();
	};

	return (
		<main className="mt-[48px]">
			<section className="flex justify-between">
				<div className="flex gap-[8px]">
					<p className="text-[16px] font-medium">멤버</p>
					<p className="text-[16px] text-[#64748B]"> ({members.length}명)</p>
				</div>
				<button
					onClick={() => overlay.open(({ close }) => <MemberInvite onClick={handleLinkCopy} close={close} />)}
					className="text-[14px] font-normal text-brand-primary"
					type="button"
				>
					+새로운 멤버 초대하기
				</button>
			</section>
			<section className="mt-[24px]">
				<div className="grid grid-cols-2 gap-4 tablet:grid-cols-3">
					{members.map((member) => (
						<div
							key={member.userId}
							className="flex h-[68px] min-w-[164px] cursor-pointer items-center justify-start rounded-[16px] bg-background-secondary px-[16px]"
							role="button"
							tabIndex={0}
							aria-label={`${member.userName}의 프로필 열기`}
							onClick={() => handleProfileModal(member)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleProfileModal(member);
								}
							}}
						>
							<UserInfo userName={member.userName} userEmail={member.userEmail} userProfile={member.userImage || ""} />
						</div>
					))}
				</div>
			</section>
		</main>
	);
}

export default Members;
