"use client";

import DropDown from "@/app/_components/Dropdown";
import CheckIcon from "@/public/icons/CheckIcon";
import LogoTypoIcon from "@/public/icons/LogoTypoIcon";
import MenuIcon from "@/public/icons/MenuIcon";
import UserIcon from "@/public/icons/UserIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
	const router = useRouter();

	// TODO: 유저 정보로 로그인 여부 확인
	const isUser = true;

	const userDropdown = [
		{
			text: "마이 히스토리",
			onClick: () => {
				router.push("/my-history");
			},
		},
		{
			text: "계정 설정",
			onClick: () => {
				router.push("/my-page");
			},
		},
		{
			text: "팀 참여",
			onClick: () => {
				router.push("/team-portals");
			},
		},
		{
			text: "로그아웃",
			onClick: () => {
				// TODO: 로그아웃 처리
				console.log("로그아웃");
			},
		},
	];

	// TODO: 팀 목록 받아오기
	const teamId = "1";
	const teamDropdown = [
		{
			text: "팀 이름 1",
			onClick: () => {
				router.push(`/team-page/${teamId}`);
			},
		},
		{
			text: "팀 이름 2",
			onClick: () => {
				router.push(`/team-page/${teamId}`);
			},
		},
	];

	return (
		<header className="z-50 h-[60px] border border-border-primary/10 bg-background-secondary text-text-primary">
			<div className="mx-auto flex size-full max-w-screen-desktop items-center gap-4 px-4 tablet:gap-10 tablet:px-6">
				{/* 모바일 메뉴 드롭다운? 사이드바? */}
				<button type="button" aria-label="Menu" className="block tablet:hidden">
					<MenuIcon width={24} height={24} />
				</button>

				<Link href="/" className="">
					<div className="h-5 w-[102px] desktop:h-8 desktop:w-[158px]">
						<LogoTypoIcon width="100%" height="100%" />
					</div>
				</Link>

				{isUser && (
					<div className="z-50 flex w-full items-center justify-end tablet:justify-between">
						<nav className="hidden tablet:flex">
							<ul className="flex items-center gap-10">
								<li>
									<DropDown
										options={teamDropdown}
										gapX={10}
										gapY={-10}
										anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
										overlayOrigin={{ vertical: "top", horizontal: "left" }}
									>
										<button type="button" className="flex items-center gap-[10px] text-lg font-medium">
											{/* 현재 팀 이름 받아오기 */}팀 이름
											<div className="">
												<CheckIcon width={16} height={16} />
											</div>
										</button>
									</DropDown>
								</li>
								<li>
									<Link href="/boards" className="text-lg font-medium">
										자유게시판
									</Link>
								</li>
							</ul>
						</nav>

						<DropDown
							options={userDropdown}
							gapX={10}
							anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
							overlayOrigin={{ vertical: "top", horizontal: "right" }}
						>
							<button type="button" aria-label="User" className="flex gap-2">
								<div className="size-4 tablet:size-6">
									<UserIcon width="100%" height="100%" />
								</div>

								<span className="hidden desktop:block">유저 이름</span>
							</button>
						</DropDown>
					</div>
				)}
			</div>
		</header>
	);
}
