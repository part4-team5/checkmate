"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import Icon from "@/app/_icons";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeamList({ isMobile, isTablet }: { isMobile: boolean; isTablet: boolean }) {
	const [currentIndex, setCurrentIndex] = useState(0);

	// eslint-disable-next-line no-nested-ternary
	const itemsPerPage = isMobile ? 4 : isTablet ? 6 : 9;

	const { data: user, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: async () => API["{teamId}/user"].GET({}),
	});

	const nextPage = () => {
		if (user && currentIndex < user.memberships.length - itemsPerPage) {
			setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
		}
	};

	const prevPage = () => {
		if (currentIndex > 0) {
			setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
		}
	};

	const totalPages = Math.ceil((user?.memberships.length ?? 0) / itemsPerPage) || 1;
	const currentPage = Math.ceil((currentIndex + itemsPerPage) / itemsPerPage);

	useEffect(() => {
		setCurrentIndex(0);
	}, [isMobile, isTablet]);

	if (isLoading)
		return (
			<section className="w-full px-4">
				<Header />

				<div className="pt-5" />

				<div className="flex w-full flex-col items-center justify-center rounded-xl bg-background-secondary px-6 pb-4 pt-8">
					{renderLoadingSkeletons(9, "hidden desktop:grid grid-cols-3 grid-rows-3")}
					{renderLoadingSkeletons(6, "hidden tablet:grid desktop:hidden grid-cols-2 grid-rows-3")}
					{renderLoadingSkeletons(4, "grid tablet:hidden grid-cols-1 grid-rows-4")}

					<div className="flex size-full h-11 grow items-center justify-center gap-2 pt-4">
						<div className="size-full max-w-5 animate-pulse rounded-md bg-background-tertiary" />

						<p className="size-full max-w-9 animate-pulse rounded-md bg-background-tertiary text-sm" />

						<div className="size-full max-w-5 animate-pulse rounded-md bg-background-tertiary" />
					</div>
				</div>
			</section>
		);

	if (user?.memberships.length) {
		const paginatedTeams = user.memberships.slice(currentIndex, currentIndex + itemsPerPage);

		return (
			<section className="w-full px-4">
				<Header />

				<div className="pt-5" />

				<div className="flex w-full flex-col items-center justify-center rounded-xl bg-background-secondary px-6 pb-4 pt-8">
					<ul className="grid w-full grid-rows-4 gap-4 tablet:grid-cols-2 tablet:grid-rows-3 desktop:grid-cols-3">
						{paginatedTeams.map((team) => (
							<li key={team.groupId} className="flex gap-3 overflow-x-hidden">
								<Link
									href={`/${team.groupId}`}
									className="flex grow items-center gap-3 overflow-x-hidden text-ellipsis whitespace-nowrap rounded-md bg-background-tertiary px-4 py-3 hover:bg-interaction-inactive/30"
								>
									<Image
										src={team.group.image ?? "/icons/emptyImage.svg"}
										alt={team.group.name}
										width={32}
										height={32}
										className="size-8 min-h-8 min-w-8 rounded-lg object-cover"
									/>
									<div className="flex grow items-center gap-1 overflow-x-hidden text-ellipsis whitespace-nowrap">
										<p className="w-fit overflow-x-hidden text-ellipsis whitespace-nowrap text-lg font-medium text-text-primary">{team.group.name}</p>

										{team.role === "ADMIN" && (
											<div className="min-h-3 min-w-3">
												<Icon.Crown width={12} height={12} color="#FFC107" />
											</div>
										)}
									</div>
									<div className="flex h-full w-fit items-end justify-end">
										<p className="text-sm text-text-default">{team.group.createdAt.toString().split("T")[0]}</p>
									</div>
								</Link>
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
						<button type="button" disabled={currentIndex >= user.memberships.length - itemsPerPage} onClick={nextPage} aria-label="next">
							<Icon.ArrowRight width={32} height={32} color={currentIndex >= user.memberships.length - itemsPerPage ? "#64748B" : "#94A3B8"} />
						</button>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="w-full px-4">
			<Header />

			<div className="pt-5" />

			<div className="flex h-dvh max-h-[292px] w-full flex-col items-center justify-center rounded-xl bg-background-secondary px-6 pb-4 pt-8">
				<p className="text-center text-text-primary">아직 참여 중인 팀이 없습니다.</p>
			</div>
		</section>
	);
}

function Header() {
	return (
		<div className="flex size-full max-h-[40px] items-center justify-center">
			<p className="w-full grow text-xl font-semibold text-text-primary">참여 중인 팀</p>
			<div className="h-10 w-full max-w-[220px]">
				<Button href="/create-team">생성하기</Button>
			</div>
		</div>
	);
}

const renderLoadingSkeletons = (count: number, colClasses: string) => (
	<ul className={`w-full gap-4 ${colClasses}`}>
		{Array.from({ length: count }).map((_, index) => (
			// eslint-disable-next-line react/no-array-index-key
			<li key={index} className="flex animate-pulse gap-3 rounded-md bg-background-tertiary px-4 py-3">
				<div className="bg-background-quaternary min-h-8 min-w-8 rounded-lg" />
				<p className="bg-background-quaternary w-full rounded-lg" />
				<div className="flex h-full w-fit items-end justify-end">
					<div className="bg-background-quaternary h-1/2 w-20 rounded-md" />
				</div>
			</li>
		))}
	</ul>
);
