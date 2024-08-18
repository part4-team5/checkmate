"use client";

import React, { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/app/_api";
import DropDown from "@/app/_components/Dropdown";
import useOverlay from "@/app/_hooks/useOverlay";
import DeleteModal from "@/app/_components/modal-contents/DeleteModal";
import Icon from "@/app/_icons";
import TeamEdit from "@/app/_components/modal-contents/TeamEdit";

type TeamTitleProps = {
	id: number;
};

export default function TeamTitle({ id }: TeamTitleProps): JSX.Element {
	const overlay = useOverlay();
	const router = useRouter();
	const params = useParams();
	const queryClient = useQueryClient();

	// 유저 정보 받아오기
	const { data: user } = useQuery({
		queryKey: ["user"],
		queryFn: async () => API["{teamId}/user"].GET({}),
	});

	const teamName = useMemo(() => {
		if (user && params?.id) {
			const currentGroup = user.memberships.find((membership) => membership.groupId === Number(params.id));
			return currentGroup?.group.name;
		}
		return undefined;
	}, [user, params?.id]);

	const mutation = useMutation({
		mutationFn: async () => API["{teamId}/groups/{id}"].DELETE({ id }),
		onSuccess: () => {
			router.push("/get-started");
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			overlay.open(({ close }) => <DeleteModal modalContent="삭제에 실패했습니다. 다시 시도하시겠어요?" close={close} onClick={close} />);
		},
	});

	const EditDropdown = useMemo(() => {
		if (!teamName) return null;

		return [
			{
				text: "수정하기",
				onClick: () => {
					overlay.open(({ close }) => <TeamEdit close={close} id={id} initialTeamName={teamName} />);
				},
			},
			{
				text: "삭제하기",
				onClick: () => {
					overlay.open(({ close }) => (
						<DeleteModal
							modalContent="팀을 삭제하시겠어요?"
							close={close}
							onClick={() => {
								mutation.mutate();
								close();
							}}
						/>
					));
				},
			},
		];
	}, [teamName, id, overlay, mutation]);

	if (!teamName) return <div>Loading...</div>;

	return (
		<main>
			<section className="mt-[24px] flex h-[64px] w-full items-center justify-between rounded-[12px] bg-background-secondary px-[24px] py-[20px]">
				<p className="text-[20px] font-bold">{teamName}</p>
				<DropDown options={EditDropdown ?? []} gapX={10} align="RR">
					<Icon.Gear width={20} height={20} />
				</DropDown>
			</section>
		</main>
	);
}
