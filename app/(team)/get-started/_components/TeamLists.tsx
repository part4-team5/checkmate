"use client";

import API from "@/app/_api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function TeamList() {
	const { data: user, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: async () => API["{teamId}/user"].GET({}),
	});

	// 로딩 스켈레톤
	if (isLoading) {
		return (
			<div className="flex h-fit w-full max-w-screen-desktop flex-col items-center justify-center gap-12">
				<div className="size-full max-h-[60dvh] min-h-28 max-w-screen-tablet rounded-lg bg-background-secondary px-2 py-5">
					<ul className="size-full min-h-28 max-w-full overflow-y-auto px-3 scrollbar:w-2 scrollbar:bg-background-primary scrollbar-thumb:bg-background-tertiary">
						{Array.from({ length: 6 }).map((_, i) => (
							// eslint-disable-next-line react/no-array-index-key
							<li key={i} className="mb-2 w-full">
								<div className="flex items-center gap-3 whitespace-nowrap rounded-md p-2 text-lg font-medium text-text-primary hover:bg-background-tertiary">
									<div className="size-8 rounded-full bg-background-primary" />
									<div className="h-6 w-full rounded-md bg-background-primary" />
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		);
	}

	if (!user?.memberships.length) {
		return (
			// 팀 없으면 안내 문구 보여주기
			<div className="flex h-fit w-full max-w-screen-desktop flex-col items-center justify-center gap-12">
				<Image src="/images/teamEmpty.webp" alt="team-empty" priority width={810} height={255} />
				<div className="text-center text-md font-medium tablet:text-lg">
					아직 소속됨 팀이 없습니다.
					<br />
					팀을 생성하거나 팀에 참여해보세요.
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-fit w-full max-w-screen-desktop flex-col items-center justify-center gap-12">
			{user && (
				// 팀 있으면 목록 보여주기
				<div className="max-h-[60dvh] min-h-28 w-full max-w-screen-tablet rounded-lg bg-background-secondary px-2 py-5">
					<ul className="size-full min-h-28 overflow-y-auto px-3 scrollbar:w-2 scrollbar:rounded-full scrollbar:bg-background-primary scrollbar-thumb:rounded-full scrollbar-thumb:bg-background-tertiary">
						{user?.memberships.map((team) => (
							<li key={team.groupId} className="mb-2 w-full">
								<Link
									href={`/${team.groupId}`}
									className="flex items-center gap-3 whitespace-nowrap rounded-md p-2 text-lg font-medium text-text-primary hover:bg-background-tertiary"
								>
									<Image src={team.group.image ?? "/icons/emptyImage.svg"} alt={team.group.name} width={32} height={32} className="size-8" />
									<p className="w-fit overflow-x-hidden text-ellipsis">{team.group.name}</p>
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
