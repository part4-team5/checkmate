"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import API from "@/app/_api";
import DropDown from "@/app/_components/Dropdown";
import useOverlay from "@/app/_hooks/useOverlay";
import DeleteModal from "@/app/_components/modal-contents/DeleteModal";
import Icon from "@/app/_icons";
import TeamEdit from "@/app/_components/TeamEdit";

type TeamTitleProps = {
	id: number;
};

export default function TeamTitle({ id }: TeamTitleProps): JSX.Element {
	const overlay = useOverlay();
	const router = useRouter();
	const [teamName, setTeamName] = useState<string | undefined>(undefined); // 낙관적 업데이트를 위한 로컬 상태

	const mutation = useMutation({
		mutationFn: async () => API["{teamId}/groups/{id}"].DELETE({ id }),
		onSuccess: () => {
			router.push("/get-started");
		},
		onError: () => {
			overlay.open(({ close }) => <DeleteModal modalContent="삭제에 실패했습니다. 다시 시도하시겠어요?" close={close} onClick={close} />);
		},
	});

	const { data, isLoading, error } = useQuery({
		queryKey: ["groupInfo", { id }],
		queryFn: useCallback(async () => {
			const response = await API["{teamId}/groups/{id}"].GET({ id });
			return response;
		}, [id]),
	});

	useEffect(() => {
		if (data) {
			setTeamName(data.name); // 데이터가 성공적으로 로드되었을 때 상태 업데이트
		}
	}, [data]);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading data</div>;

	const EditDropdown = [
		{
			text: "수정하기",
			onClick: () => {
				overlay.open(({ close }) => (
					<TeamEdit
						close={close}
						id={id}
						setTeamName={setTeamName} // 콜백 함수 전달
					/>
				));
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

	return (
		<main>
			<section className="mt-[24px] flex h-[64px] w-full items-center justify-between rounded-[12px] bg-background-secondary px-[24px] py-[20px]">
				<p className="text-[20px] font-bold">{teamName}</p>
				<DropDown options={EditDropdown} gapX={10} align="RR">
					<Icon.Gear width={20} height={20} />
				</DropDown>
			</section>
		</main>
	);
}
