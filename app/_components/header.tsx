import LogoTypoIcon from "@/public/icons/LogoTypoIcon";
import MenuIcon from "@/public/icons/MenuIcon";
import UserIcon from "@/public/icons/UserIcon";
import Link from "next/link";

export default function Header() {
	// TODO: 유저 정보로 로그인 여부 확인
	const isUser = true;

	return (
		<header className="h-[60px] border border-border-primary/10 bg-background-secondary text-text-primary">
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
					<div className="h flex w-full items-center justify-end tablet:justify-between">
						<nav className="hidden tablet:flex">
							<ul className="flex gap-10">
								{/* TODO: 드롭다운 추가 */}
								<li>
									<button type="button" className="text-lg font-medium">
										{/* 팀 이름 받아오기 */}팀 이름
									</button>
								</li>
								<li>
									<Link href="/boards" className="text-lg font-medium">
										자유게시판
									</Link>
								</li>
							</ul>
						</nav>

						{/* TODO: 드롭다운 추가 */}
						<button type="button" aria-label="User" className="flex gap-2">
							<div className="size-4 tablet:size-6">
								<UserIcon width="100%" height="100%" />
							</div>

							<span className="hidden desktop:block">유저 이름</span>
						</button>
					</div>
				)}
			</div>
		</header>
	);
}
