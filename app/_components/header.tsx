/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import API from "@/app/_api";
import DropDown from "@/app/_components/Dropdown";
import Logout from "@/app/_components/modal-contents/Logout";
import useCookie from "@/app/_hooks/useCookie";
import useOverlay from "@/app/_hooks/useOverlay";
import Icon from "@/app/_icons";
import useAuthStore from "@/app/_store/useAuthStore";
import { debounce } from "@/app/_utils/DelayManager";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Header() {
	const router = useRouter();
	const params = useParams();

	const [accessToken, setAccessToken] = useCookie("accessToken");
	const [, setRefreshToken] = useCookie("refreshToken");

	const [isSidebarOpened, setIsSidebarOpened] = useState(false);
	const [isTeamOpened, setIsTeamOpened] = useState(false);

	const overlay = useOverlay();

	// 유저 정보 받아오기
	const { data: user } = useQuery({
		queryKey: ["user"],
		queryFn: async () => API["{teamId}/user"].GET({}),
		enabled: !!accessToken,
	});

	const teamDropdown = [
		...(user?.memberships.map((membership) => ({
			text: membership.group.name,
			image: membership.group.image ?? "/icons/emptyImage.svg",
			onClick: () => router.push(`/${membership.groupId}`),
		})) ?? []),
	];

	const sideBarClose = useCallback(() => {
		setIsSidebarOpened(false);
		setIsTeamOpened(false);
	}, []);

	useEffect(() => {
		if (!isSidebarOpened) return;

		const handleResize = debounce(() => {
			if (window.innerWidth > 744) {
				sideBarClose();
			}
		}, 300);
		window.addEventListener("resize", handleResize);

		// eslint-disable-next-line consistent-return
		return () => window.removeEventListener("resize", handleResize);
	}, [isSidebarOpened, sideBarClose]);

	const userDropdown = useMemo(
		() => [
			{
				text: "마이 히스토리",
				onClick: () => {
					router.push("/my-history");
					sideBarClose();
				},
			},
			{
				text: "계정 설정",
				onClick: () => {
					router.push("/my-page");
					sideBarClose();
				},
			},
			{
				text: "팀 참여",
				onClick: () => {
					router.push("/join-team");
					sideBarClose();
				},
			},
			{
				text: "로그아웃",
				onClick: () => {
					overlay.open(({ close }) => (
						<Logout
							onClick={() => {
								setRefreshToken(null);
								setAccessToken(null);
								sideBarClose();
								useAuthStore.persist.clearStorage();
								router.push("/");
								close();
							}}
							close={close}
						/>
					));
				},
			},
		],
		[overlay, router, setAccessToken, setRefreshToken, sideBarClose],
	);

	return (
		<header className="fixed top-0 z-50 h-[60px] w-full min-w-[320px] border border-border-primary/10 bg-background-secondary text-text-primary">
			<div className="mx-auto flex size-full max-w-screen-desktop items-center">
				<div className="z-50 block pl-4 tablet:hidden">
					<button type="button" onClick={() => setIsSidebarOpened(!isSidebarOpened)} aria-label="Menu" className="flex size-full items-center justify-center">
						<div className={`${isSidebarOpened ? "hidden" : "flex"}`}>
							<Icon.Hamburger width={24} height={24} />
						</div>
						<div className={`${isSidebarOpened ? "flex" : "hidden"}`}>
							<Icon.Close width={24} height={24} />
						</div>
					</button>
				</div>

				<div className="pr-4 tablet:pr-8 desktop:hidden" />

				<Link href="/" onClick={sideBarClose}>
					<div className="h-5 w-[102px] desktop:h-8 desktop:w-[158px]">
						<Icon.LogoTypo width="100%" height="100%" />
					</div>
				</Link>

				<div className="pr-4 tablet:pr-10" />

				{!!accessToken && (
					<div className="z-50 flex w-full items-center justify-end tablet:justify-between">
						<nav className="hidden tablet:flex">
							<ul className="flex items-center gap-10">
								{/* 팀 선택 드롭다운 */}
								{teamDropdown.length > 0 && (
									<li>
										<DropDown options={teamDropdown} gapY={10} align="LL">
											<button type="button" className="flex items-center gap-[10px] text-lg font-medium">
												{user?.memberships.find((membership) => membership.groupId === Number(params.id))?.group.name ?? "팀 선택"}
												<Icon.ArrowDown width={16} height={16} />
											</button>
										</DropDown>
									</li>
								)}
								<li>
									<Link href="/boards" className="text-lg font-medium">
										자유게시판
									</Link>
								</li>
							</ul>
						</nav>

						{/* 유저 정보 */}
						<DropDown options={userDropdown} gapY={10} align="RR">
							<button type="button" className="flex gap-2">
								<div className="size-4 tablet:size-6">
									<Icon.User width="100%" height="100%" />
								</div>
								<span className="hidden desktop:block">{user?.nickname}</span>
							</button>
						</DropDown>
					</div>
				)}

				<nav className={`flex size-full items-center justify-end ${accessToken ? "hidden" : "flex"}`}>
					<Link href="/login" className="flex h-full items-center gap-2 px-4 text-lg font-medium" onClick={() => sideBarClose()}>
						로그인
					</Link>
				</nav>

				<div className="pr-4 tablet:pr-10 desktop:p-0" />

				{/* 사이드바 */}
				<div
					className={`fixed inset-0 left-0 top-[60px] z-30 bg-black/50 ${isSidebarOpened ? "block" : "hidden"} cursor-default tablet:hidden`}
					onClick={() => sideBarClose()}
				>
					<div className="z-40 h-full bg-background-secondary px-4 py-5 pr-5" onClick={(event) => event.stopPropagation()}>
						<button
							type="button"
							onClick={() => setIsTeamOpened(!isTeamOpened)}
							className={`w-full items-center gap-2 rounded-md px-4 py-2 text-lg font-medium hover:bg-background-tertiary ${accessToken ? "flex" : "hidden"}`}
						>
							<Image src="/icons/list.svg" alt="selectArrow" width={32} height={32} />
							<p className="grow text-left">팀 목록</p>
							<div className={`flex size-7 items-center duration-300 ${isTeamOpened ? "rotate-90" : ""}`}>
								<Icon.ArrowRight width={28} height={28} color="#fff" />
							</div>
						</button>

						{/* 팀 목록 */}
						{/* max-h-[calc(100dvh-200px)]으로 위에 크기만큼 빼서 스크롤 넣어줌 */}
						<div className={`overflow-hidden duration-500 ease-in-out ${isTeamOpened ? "max-h-[calc(100dvh-270px)]" : "max-h-0"} `}>
							<ul className="max-h-[calc(100dvh-270px)] max-w-full overflow-y-auto rounded-md scrollbar:w-2 scrollbar:rounded-full scrollbar:bg-background-primary scrollbar-thumb:rounded-full scrollbar-thumb:bg-background-tertiary">
								{user?.memberships.map((membership) => (
									<li key={membership.groupId} className="size-full pl-8">
										<Link
											href={`/${membership.groupId}`}
											className="mr-2 flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-lg font-medium hover:bg-background-tertiary"
											onClick={sideBarClose}
										>
											<Image src={membership.group.image ?? "/icons/emptyImage.svg"} alt="image" width={32} height={32} className="size-8" />
											<p className="w-fit grow overflow-x-hidden text-ellipsis">{membership.group.name}</p>

											<div className="flex size-7 items-center">
												<Icon.ArrowRight width={28} height={28} color="#fff" />
											</div>
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="h-2" />

						<Link
							href="/create-team"
							className={`items-center gap-2 rounded-md px-4 py-2 text-lg font-medium hover:bg-background-tertiary ${accessToken ? "flex" : "hidden"}`}
							onClick={sideBarClose}
						>
							<Image src="/icons/add.svg" alt="selectArrow" width={32} height={32} />
							<p className="grow">팀 생성하기</p>
							<div className="flex size-7 items-center">
								<Icon.ArrowRight width={28} height={28} color="#fff" />
							</div>
						</Link>

						<div className="h-2" />

						<div className="flex flex-col pb-2">
							<Link
								href="/boards"
								className="flex items-center gap-2 rounded-md px-4 py-2 text-lg font-medium hover:bg-background-tertiary"
								onClick={sideBarClose}
							>
								<Image src="/icons/box.svg" alt="selectArrow" width={32} height={32} />
								<p className="grow">자유게시판</p>
								<div className="flex size-7 items-center">
									<Icon.ArrowRight width={28} height={28} color="#fff" />
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
