/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable no-nested-ternary */
/* eslint-disable */

"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserInfo from "@/app/(team)/[id]/_component/UserInfo";
import API from "@/app/_api";
import useOverlay from "@/app/_hooks/useOverlay";
import MemberInvite from "@/app/_components/modal-contents/MemberInvite";
import MemberProfile from "@/app/_components/modal-contents/MemberProfile";
import toast from "@/app/_utils/Toast";
import DropDown from "@/app/_components/Dropdown";
import Icon from "@/app/_icons";
import DeleteModal from "@/app/_components/modal-contents/DeleteModal";
import { ReportProps } from "./Report";

type Team = Awaited<ReturnType<(typeof API)["{teamId}/groups/{id}"]["GET"]>>;

function Members({ id }: ReportProps) {
	const queryClient = useQueryClient();
	const overlay = useOverlay();

	const fetchGroupInfo = useCallback((): Promise<Team> => API["{teamId}/groups/{id}"].GET({ id }), [id]);

	const getInvitationToken = useCallback((): Promise<string> => API["{teamId}/groups/{id}/invitation"].GET({ id }), [id]);

	const { data, isLoading, error } = useQuery<Team>({
		queryKey: ["groupInfo", { groupId: id }],
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

	const deleteUser = useMutation({
		mutationFn: async ({ memberUserId }: { memberUserId: number }) => API["{teamId}/groups/{id}/member/{memberUserId}"].DELETE({ id, memberUserId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["groupInfo", { groupId: id }] });
			toast.success("멤버가 성공적으로 삭제되었습니다.");
		},
		onError: () => {
			toast.error("삭제에 실패했습니다. 다시 시도해주세요.");
		},
	});

	const handleProfileModal = useCallback(
		(member: { userName: string; userEmail: string; userImage?: string }) => {
			overlay.open(({ close }) => <MemberProfile userName={member.userName} email={member.userEmail} close={close} userProfile={member.userImage || ""} />);
		},
		[overlay],
	);

	const handleLinkCopy = async () => {
		const invitationToken = await getInvitationToken();

		if (invitationToken) {
			const invitationUrl = await API["api/invite/link"].POST(
				{},
				{
					groupId: id,
					groupName: data?.name as string,
					groupImage: data?.image,
					token: invitationToken,
				},
			);

			await navigator.clipboard.writeText(invitationUrl.shortURL);
			toast.success("초대 링크가 복사되었습니다!");
		}
	};

	const handleInviteClick = () => {
		overlay.open(({ close }) => <MemberInvite onCopy={handleLinkCopy} close={close} groupId={id} />);
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>오류 발생: {error instanceof Error ? error.message : "Unknown error"}</div>;

	let members = data?.members || [];

	members = members.sort((a, b) => (a.role === "ADMIN" ? -1 : b.role === "ADMIN" ? 1 : 0));

	const isAdmin = user?.memberships.some((membership) => membership.groupId === id && membership.role === "ADMIN");

	return (
		<section className="mt-[48px] text-text-primary">
			<section className="flex justify-between">
				<div className="flex gap-[8px]">
					<p className="text-[16px] font-medium">멤버</p>
					<p className="text-[16px] text-text-primary"> ({members.length}명)</p>
				</div>
				{isAdmin && (
					<button onClick={handleInviteClick} className="add-member text-[14px] font-semibold text-brand-primary" type="button">
						+새로운 멤버 초대하기
					</button>
				)}
			</section>
			<section className="mt-[24px]">
				<div className="grid grid-cols-2 gap-[22px] text-[14px] font-medium tablet:grid-cols-3">
					{members.map((member) => {
						const memberEdit = [
							{
								text: "이메일 복사하기",
								onClick: () => handleProfileModal(member),
							},
							...(member.role !== "ADMIN"
								? [
										{
											text: "멤버 삭제하기",
											onClick: () => {
												overlay.open(({ close }) => (
													<DeleteModal
														modalContent="멤버를 삭제하시겠어요?"
														close={close}
														onClick={() => {
															deleteUser.mutate({ memberUserId: member.userId });
															close();
														}}
													/>
												));
											},
										},
									]
								: []),
						];

						return (
							<div
								key={member.userId}
								className="my-member flex h-[68px] w-full min-w-[164px] cursor-pointer items-center justify-between rounded-[16px] bg-background-tertiary px-[16px] shadow-teamCard"
								role="button"
								aria-label={`${member.userName}의 프로필 열기`}
							>
								<UserInfo userName={member.userName} userEmail={member.userEmail} userProfile={member.userImage ?? ""} isAdmin={member.role === "ADMIN"} />
								<DropDown options={memberEdit} gapX={20} gapY={-30} align="RR">
									<Icon.Kebab width={24} height={24} />
								</DropDown>
							</div>
						);
					})}
				</div>
			</section>
		</section>
	);
}

export default Members;
