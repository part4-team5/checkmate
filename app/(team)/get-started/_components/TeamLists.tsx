"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function TeamList() {
	const { data: user, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: async () => API["{teamId}/user"].GET({}),
	});

	if (isLoading)
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

	if (user?.memberships.length) {
		return (
			// 팀 있으면 목록 보여주기
			<div className="size-full max-w-[528px] p-8">
				<div className="flex size-full max-h-[40px] items-center justify-center">
					<p className="w-full grow rounded-lg bg-background-tertiary text-lg font-semibold text-text-primary">참여 중인 팀</p>

					<div className="size-full max-w-[220px]">
						<Button href="/create-team">생성하기</Button>
					</div>
				</div>

				<ul className="mt-8 flex max-h-[80%] flex-col gap-3 overflow-y-auto pr-2 scrollbar:w-2 scrollbar:rounded-full scrollbar:bg-background-secondary scrollbar-thumb:rounded-full scrollbar-thumb:bg-interaction-inactive/60">
					{user?.memberships.map((team) => (
						<li key={team.groupId} className="w-full">
							<Link
								href={`/${team.groupId}`}
								className="bg-background-quaternary flex items-center gap-3 whitespace-nowrap rounded-md px-4 py-3 text-lg font-medium text-text-primary hover:bg-interaction-inactive/30"
							>
								<Image
									src={team.group.image ?? "/icons/emptyImage.svg"}
									alt={team.group.name}
									width={32}
									height={32}
									className="size-8 rounded-lg object-cover"
								/>
								<p className="w-fit overflow-x-hidden text-ellipsis">{team.group.name}</p>
							</Link>
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		// 팀 없으면 안내 문구 보여주기
		<div className="size-full max-w-[528px] p-8">
			<div className="flex size-full max-h-[40px] items-center justify-center">
				<p className="w-full grow rounded-lg bg-background-tertiary text-lg font-semibold text-text-primary">참여 중인 팀</p>

				<div className="size-full max-w-[220px]">
					<Button href="/create-team">생성하기</Button>
				</div>
			</div>

			<div className="flex size-full flex-col items-center justify-center gap-10 px-5 tablet:px-10">
				<Image src="/images/teamEmpty.webp" alt="team-empty" priority width={400} height={60} />
				<div className="text-center text-md font-medium text-text-secondary tablet:text-lg">
					아직 소속됨 팀이 없습니다.
					<br />
					팀을 생성하거나 팀에 참여해보세요.
				</div>
			</div>
		</div>
	);
}
