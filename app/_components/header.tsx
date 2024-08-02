import LogoIcon from "@/public/icons/LogoIcon";
import UserIcon from "@/public/icons/UserIcon";
import Link from "next/link";

export default function Header() {
	// TODO: 유저 정보로 로그인 여부 확인
	const isUser = true;

	return (
		<header className="h-[60px] border border-border-primary/10 bg-background-secondary text-text-primary">
			<div className="mx-auto flex size-full max-w-screen-desktop items-center gap-10">
				<Link href="/" className="">
					<LogoIcon width={158} height={32} />
				</Link>

				{isUser && (
					<div className="h flex w-full items-center justify-between">
						<nav>
							<ul className="flex gap-10">
								{/* TODO: 드롭다운 추가 */}
								<li>
									<button type="button" className="text-lg font-medium">
										팀 이름
									</button>
								</li>
								<li>
									<Link href="/boards" className="text-lg font-medium">
										자유게시판
									</Link>
								</li>
							</ul>
						</nav>

						<div className="flex gap-2">
							<UserIcon width={24} height={24} />
							{/* TODO: 드롭다운 추가 */}
							<button type="button">유저 이름</button>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
