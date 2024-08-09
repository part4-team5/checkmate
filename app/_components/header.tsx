"use client";

import API from "@/app/_api";
import DropDown from "@/app/_components/Dropdown";
import CheckIcon from "@/public/icons/CheckIcon";
import CloseIcon from "@/public/icons/ic_close";
import LogoTypoIcon from "@/public/icons/LogoTypoIcon";
import MenuIcon from "@/public/icons/MenuIcon";
import UserIcon from "@/public/icons/UserIcon";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	// 유저 정보 받아오기
	const {
		data: user,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const response = await API["{teamId}/user"].GET({});
			return response;
		},
	});

	if (isError) {
		console.log("error");
	}

	if (isLoading) {
		console.log("loading");
	}

	const isUser = user !== undefined;

	const userDropdown = [
		{ text: "마이 히스토리", onClick: () => router.push("/my-history") },
		{ text: "계정 설정", onClick: () => router.push("/my-page") },
		{ text: "팀 참여", onClick: () => router.push("/join-team") },
		{ text: "로그아웃", onClick: () => console.log("로그아웃") }, // TODO: 로그아웃 처리
	];

	// TODO: 팀 목록 받아오기
	const teamId = "1";
	const teamDropdown = [
		{ text: "팀 이름 1", onClick: () => router.push(`/team-page/${teamId}`) },
		{ text: "팀 이름 2", onClick: () => router.push(`/team-page/${teamId}`) },
	];

	const teamNames = ["팀 이름 1", "팀 이름 2", "팀 이름 3", "팀 이름 4", "팀 이름 5"]; // 예시 팀 이름 목록

	return (
		<header className="fixed top-0 z-50 h-[60px] w-full border border-border-primary/10 bg-background-secondary text-text-primary">
			<div className="mx-auto flex size-full max-w-screen-desktop items-center gap-4 px-4 tablet:gap-10 tablet:px-6">
				<div className="z-50">
					<button type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Menu" className="block tablet:hidden">
						<MenuIcon width={24} height={24} />
					</button>

					<div
						className={`fixed inset-0 left-0 top-[60px] z-30 bg-black/50 ${isOpen ? "block" : "hidden"} cursor-default`}
						onClick={() => setIsOpen(!isOpen)}
						onKeyDown={() => {}}
						role="button"
						tabIndex={0}
					>
						<div className="z-40 h-full w-[50%] min-w-[135px] bg-background-secondary py-5 pl-6 pr-5">
							<div className="flex w-full justify-end">
								<button type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Close">
									<CloseIcon width={24} height={24} />
								</button>
							</div>

							<div className="h-8" />

							<ul className="flex flex-col gap-4">
								<li>
									<Link href="/boards" className="text-lg font-medium">
										자유게시판
									</Link>
								</li>
								{teamNames.map((teamName) => (
									<li key={teamName}>
										<Link href={`/team-page/${teamId}`} className="text-lg font-medium">
											{teamName}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

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
										anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
										overlayOrigin={{ vertical: "top", horizontal: "right" }}
									>
										<button type="button" className="flex items-center gap-[10px] text-lg font-medium">
											{/* 현재 팀 이름 받아오기 */}
											팀 이름
											<CheckIcon width={16} height={16} />
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
