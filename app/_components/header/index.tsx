"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import Icon from "@/app/_icons";

import API from "@/app/_api";

import toast from "@/app/_utils/Toast";
import { debounce } from "@/app/_utils/DelayManager";

import Dropdown from "@/app/_components/Dropdown";

import useCookie from "@/app/_hooks/useCookie";
import useOverlay from "@/app/_hooks/useOverlay";

import AuthStore from "@/app/_store/AuthStore";

// 지연 로딩 컴포넌트
const LogoutModal = dynamic(() => import("@/app/_components/modals/modal-containers/Logout"), { ssr: false });
const Sidebar = dynamic(() => import("@/app/_components/header/Sidebar"), { ssr: false });

export default function Header() {
	const router = useRouter();
	const params = useParams();
	const pathname = usePathname();

	const [accessToken, setAccessToken] = useCookie<string>("accessToken");
	const [, setRefreshToken] = useCookie<string>("refreshToken");

	const queryClient = useQueryClient();

	const [isSidebarOpened, setIsSidebarOpened] = useState(false);
	const [isTeamOpened, setIsTeamOpened] = useState(false);

	const overlay = useOverlay();

	// 유저 정보 받아오기
	const { data: userData } = useQuery({
		queryKey: ["user"],
		queryFn: async () => API["{teamId}/user"].GET({}),
		enabled: !!accessToken,
	});

	// 팀 목록 드롭다운
	const teamDropdown = useMemo(
		() =>
			userData?.memberships.map((membership) => ({
				text: membership.group.name,
				image: membership.group.image ?? "/icons/emptyImage.svg",
				onClick: () => router.push(`/${membership.groupId}`),
				groupId: String(membership.groupId),
			})) ?? [],
		[userData, router],
	);

	// 사이드바 닫기
	const onSideBarClose = useCallback(() => {
		setIsSidebarOpened(false);
		setIsTeamOpened(false);
	}, []);

	// 사이드바가 열려있을 때, 화면 크기가 744px 이상이면 사이드바를 닫는다.
	const handleResize = debounce(() => {
		if (window.innerWidth > 744) {
			onSideBarClose();
		}
	}, 1000);

	useEffect(() => {
		if (!isSidebarOpened) window.removeEventListener("resize", handleResize);
		else window.addEventListener("resize", handleResize);
	}, [isSidebarOpened, handleResize]);

	// 페이지 이동 시 사이드바 닫기
	useEffect(() => {
		if (isSidebarOpened) {
			onSideBarClose();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	// 유저 드롭다운
	const userDropdown = useMemo(
		() => [
			{
				text: "내 대시보드",
				onClick: () => {
					router.push("/get-started");
					onSideBarClose();
				},
			},
			{
				text: "마이 히스토리",
				onClick: () => {
					router.push("/my-history");
					onSideBarClose();
				},
			},
			{
				text: "계정 설정",
				onClick: () => {
					router.push("/my-page");
					onSideBarClose();
				},
			},
			{
				text: "로그아웃",
				onClick: () => {
					overlay.open(({ close }) => (
						<LogoutModal
							onClick={() => {
								toast.success("로그아웃 되었습니다.");

								setRefreshToken(null);
								setAccessToken(null);
								AuthStore.persist.clearStorage();

								queryClient.clear();

								onSideBarClose();
								close();

								router.push("/");
							}}
							close={close}
						/>
					));
				},
			},
		],
		[overlay, queryClient, router, setAccessToken, setRefreshToken, onSideBarClose],
	);

	return (
		<header className="fixed top-0 z-[69] h-[60px] w-full min-w-[320px] border-b border-header-primary bg-background-quaternary text-text-primary">
			<div className="mx-auto flex size-full max-w-screen-desktop items-center gap-2 tablet:gap-4 tablet:px-4 desktop:max-w-screen-desktop">
				{/* 햄버거 버튼 */}
				<button type="button" onClick={() => setIsSidebarOpened(!isSidebarOpened)} aria-label="Menu" className="z-50 block p-4 tablet:hidden">
					{isSidebarOpened ? <Icon.Close width={24} height={24} /> : <Icon.Hamburger width={24} height={24} />}
				</button>

				{/* 로고 */}
				<Link href="/" onClick={onSideBarClose} className="h-full w-max">
					<div className="flex h-full w-max items-center gap-2 text-xl font-extrabold text-brand-primary">
						<Image src="/icons/logo.svg" alt="logo" width={32} height={32} />
						CHECKMATE
					</div>
				</Link>

				{/* 내비게이션 */}
				{!!accessToken && (
					<div className="z-50 flex w-full items-center justify-end tablet:justify-between">
						<nav className="hidden tablet:flex">
							<ul className="flex items-center gap-5">
								<li>
									<Dropdown options={teamDropdown} gapY={10} align="LL">
										<button type="button" className="flex max-h-[40px] max-w-[350px] items-center gap-[10px] px-2 py-3 text-lg font-medium desktop:max-w-none">
											<Image
												src={userData?.memberships.find((membership) => membership.groupId === Number(params.id))?.group.image ?? "/icons/emptyImage.svg"}
												alt="team"
												width={32}
												height={32}
												className="size-8 min-h-8 min-w-8 rounded-lg object-cover"
											/>
											<p className="overflow-x-hidden text-ellipsis whitespace-nowrap">
												{userData?.memberships.find((membership) => membership.groupId === Number(params.id))?.group.name ?? "팀 선택"}
											</p>
											<div className="size-[16px]">
												<Icon.ArrowDown width={16} height={16} color="var(--text-primary)" />
											</div>
										</button>
									</Dropdown>
								</li>
								<li>
									<Link href="/boards" className="p-3 text-lg font-medium">
										자유게시판
									</Link>
								</li>
							</ul>
						</nav>

						<Dropdown options={userDropdown} gapY={10} align="RR">
							<button type="button" className="mr-3 flex max-w-[300px] items-center gap-2 p-2 tablet:m-0">
								<div className="relative size-6 min-h-6 min-w-6">
									{userData?.image ? (
										<Image src={userData.image} alt="Avatar" fill className="rounded-full object-cover" />
									) : (
										<Icon.User width="100%" height="100%" color="var(--text-primary)" />
									)}
								</div>
								<p className="hidden overflow-x-hidden text-ellipsis whitespace-nowrap text-lg font-medium desktop:block">{userData?.nickname}</p>
							</button>
						</Dropdown>
					</div>
				)}

				{!accessToken && (
					<div className="flex grow items-center justify-end">
						<Link href="/login" className="flex h-full items-center gap-2 px-4 py-3 text-2lg font-medium" onClick={onSideBarClose}>
							로그인
						</Link>
					</div>
				)}

				<Sidebar
					isSidebarOpened={isSidebarOpened}
					isTeamOpened={isTeamOpened}
					setIsTeamOpened={setIsTeamOpened}
					sideBarClose={onSideBarClose}
					user={userData ?? null}
					accessToken={accessToken}
				/>
			</div>
		</header>
	);
}
