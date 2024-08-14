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
import debounce from "@/app/_utils/debounce";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Header() {
	const router = useRouter();
	const params = useParams();

	const [accessToken, setAccessToken] = useCookie("accessToken");
	const [, setRefreshToken] = useCookie("refreshToken");

	const [isOpen, setIsOpen] = useState(false);
	const [isTeamOpen, setIsTeamOpen] = useState(false);

	const overlay = useOverlay();

	// 유저 정보 받아오기
	const { data: user } = useQuery({
		queryKey: ["user"],
		queryFn: useCallback(async () => {
			if (!accessToken) return null;

			const response = await API["{teamId}/user"].GET({});
			return response;
		}, [accessToken]),
	});

	const userDropdown = [
		{ text: "마이 히스토리", onClick: () => router.push("/my-history") },
		{ text: "계정 설정", onClick: () => router.push("/my-page") },
		{ text: "팀 참여", onClick: () => router.push("/join-team") },
		{
			text: "로그아웃",
			onClick: () => {
				overlay.open(({ close }) => (
					<Logout
						onClick={() => {
							setRefreshToken(null);
							setAccessToken(null);
							useAuthStore.persist.clearStorage();
							router.push("/");
							close();
						}}
						close={close}
					/>
				));
			},
		},
	];

	const teamDropdown = [
		...(user?.memberships.map((membership) => ({
			text: membership.group.name,
			image: membership.group.image ?? "/icons/emptyImage.svg",
			onClick: () => router.push(`/${membership.groupId}`),
		})) ?? []),
	];

	const sideBarClose = useCallback(() => {
		setIsOpen(false);
		setIsTeamOpen(false);
	}, []);

	useEffect(() => {
		if (!isOpen) return;

		const handleResize = debounce(() => {
			if (window.innerWidth > 744) {
				sideBarClose();
			}
		}, 300);
		window.addEventListener("resize", handleResize);

		// eslint-disable-next-line consistent-return
		return () => window.removeEventListener("resize", handleResize);
	}, [isOpen, sideBarClose]);

	return (
		<header className="fixed top-0 z-50 h-[60px] w-full min-w-[320px] border border-border-primary/10 bg-background-secondary text-text-primary">
			<div className="mx-auto flex size-full max-w-screen-desktop items-center">
				<div className="z-50 pl-4">
					<button type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Menu" className="block tablet:hidden">
						<Icon.Hamburger width={24} height={24} />
					</button>

					{/* 사이드바 */}
					<div className={`fixed inset-0 left-0 top-[60px] z-30 bg-black/50 ${isOpen ? "block" : "hidden"} cursor-default`} onClick={() => setIsOpen(false)}>
						<div className="z-40 h-full w-fit min-w-[220px] max-w-[50%] bg-background-secondary py-5 pr-5" onClick={(event) => event.stopPropagation()}>
							<div className="flex w-full justify-end">
								<button type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Close">
									<Icon.Close width={24} height={24} />
								</button>
							</div>

							{/* {isUser && <div className="border-t-[2px] border-border-primary/10 pb-2" />} */}

							<button
								type="button"
								onClick={() => setIsTeamOpen(!isTeamOpen)}
								className={`w-full items-center gap-2 rounded-md text-lg font-medium hover:bg-background-tertiary ${accessToken ? "flex" : "hidden"}`}
							>
								<Image src="/icons/landingFolder.svg" alt="selectArrow" width={42} height={42} />
								{/* <div className="size-2 rounded-full bg-background-inverse" /> */}팀 목록
							</button>

							{/* max-h-[calc(100dvh-200px)]으로 위에 크기만큼 빼서 스크롤 넣어줌 */}
							<div className={`overflow-hidden duration-500 ease-in-out ${isTeamOpen ? "max-h-[calc(100dvh-270px)]" : "max-h-0"} `}>
								<ul className="max-h-[calc(100dvh-270px)] max-w-full overflow-y-auto rounded-md scrollbar:w-2 scrollbar:bg-background-primary scrollbar-thumb:bg-background-tertiary">
									{user?.memberships.map((membership) => (
										<li key={membership.groupId} className="size-full">
											<Link
												href={`/${membership.groupId}`}
												className="mr-2 flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-lg font-medium hover:bg-background-tertiary"
												onClick={sideBarClose}
											>
												<Image src={membership.group.image ?? "/icons/emptyImage.svg"} alt="image" width={32} height={32} className="size-8" />
												<p className="w-fit overflow-x-hidden text-ellipsis">{membership.group.name}</p>
											</Link>
										</li>
									))}
								</ul>
							</div>

							<div className="h-2" />

							<Link
								href="/create-team"
								className={`mt-1 items-center gap-2 text-lg font-medium ${accessToken ? "flex" : "hidden"} rounded-md hover:bg-background-tertiary`}
								onClick={sideBarClose}
							>
								<Image src="/icons/landingMail.svg" alt="selectArrow" width={42} height={42} />
								{/* <div className="size-2 rounded-full bg-background-inverse" /> */}팀 생성하기
							</Link>

							<div className="h-2" />

							<div className="flex flex-col pb-2">
								<Link
									href="/boards"
									className="mt-1 flex items-center gap-2 rounded-md text-lg font-medium hover:bg-background-tertiary"
									onClick={sideBarClose}
								>
									{/* <div className="size-2 rounded-full bg-background-inverse" /> */}
									<Image src="/icons/landingChecked.svg" alt="selectArrow" width={42} height={42} />
									자유게시판
								</Link>

								<Link
									href="/login"
									className={`mt-1 items-center gap-2 rounded-md text-lg font-medium hover:bg-background-tertiary ${accessToken ? "hidden" : "flex"}`}
								>
									<Image src="/icons/landingChecked.svg" alt="selectArrow" width={42} height={42} />
									로그인
								</Link>
								<Link
									href="/signup"
									className={`mt-1 items-center gap-2 rounded-md text-lg font-medium hover:bg-background-tertiary ${accessToken ? "hidden" : "flex"}`}
								>
									<Image src="/icons/landingChecked.svg" alt="selectArrow" width={42} height={42} />
									회원가입
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="pr-4 tablet:hidden tablet:pr-10" />

				<Link href="/">
					<div className="h-5 w-[102px] desktop:h-8 desktop:w-[158px]">
						<Icon.LogoTypo width="100%" height="100%" />
					</div>
				</Link>

				<div className="pr-4 tablet:pr-10" />

				{!!accessToken && (
					<div className="z-50 flex w-full items-center justify-end tablet:justify-between">
						<nav className="hidden tablet:flex">
							<ul className="flex items-center gap-10">
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
					<Link href="/login" className="flex items-center gap-2 px-4 text-lg font-medium">
						<Image src="/icons/landingChecked.svg" alt="selectArrow" width={42} height={42} />
						로그인
					</Link>
				</nav>

				<div className="pr-4 tablet:pr-10 desktop:p-0" />
			</div>
		</header>
	);
}
