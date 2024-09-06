import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/app/_icons";
import API from "@/app/_api";

type UserType = Awaited<ReturnType<(typeof API)["{teamId}/user"]["GET"]>>;

interface SidebarProps {
	isSidebarOpened: boolean;
	isTeamOpened: boolean;
	setIsTeamOpened: Dispatch<SetStateAction<boolean>>;
	sideBarClose: () => void;
	user: UserType | null;
	accessToken: string | null;
}

export default function Sidebar({ isSidebarOpened, isTeamOpened, setIsTeamOpened, sideBarClose, user, accessToken }: SidebarProps) {
	return (
		<div className={`fixed inset-0 left-0 top-[60px] z-30 cursor-default tablet:hidden ${isSidebarOpened ? "block" : "hidden"}`}>
			<div className="z-40 h-full bg-background-secondary px-4 py-5 pr-5">
				<Link
					href="/get-started"
					className={`flex flex-col items-center justify-center rounded-md text-[18px] font-medium hover:bg-background-tertiary ${accessToken ? "flex" : "hidden"}`}
					onClick={sideBarClose}
				>
					<div className="flex w-full grow items-center gap-3 px-4 py-3">
						<Icon.Star width={28} height={28} />
						<p className="grow">내 대시보드</p>
					</div>
				</Link>

				<button
					type="button"
					onClick={() => setIsTeamOpened(!isTeamOpened)}
					className={`w-full items-center gap-3 rounded-md px-4 py-3 text-[18px] font-medium hover:bg-background-tertiary ${accessToken ? "flex" : "hidden"}`}
				>
					<Image src="/icons/teamList.svg" alt="selectArrow" width={28} height={28} />
					<p className="grow text-left">팀 목록</p>
					<div className={`flex size-[20px] items-center duration-300 ${isTeamOpened ? "rotate-90" : ""}`}>
						<Icon.ArrowRight width={20} height={20} color="#dddddd" />
					</div>
				</button>

				<div className={`overflow-hidden duration-500 ease-in-out ${isTeamOpened ? "max-h-[calc(100dvh-340px)]" : "max-h-0"}`}>
					<ul className="mx-4 mt-2 max-h-[calc(100dvh-348px)] max-w-full overflow-y-auto rounded-md scrollbar:w-2 scrollbar:rounded-full scrollbar:bg-background-Senary scrollbar-thumb:rounded-full scrollbar-thumb:bg-background-primary">
						{user?.memberships.map((membership) => (
							<li key={membership.groupId} className="size-full pb-1">
								<Link
									href={`/${membership.groupId}`}
									className="mr-2 flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-lg font-medium hover:bg-background-tertiary"
									onClick={sideBarClose}
								>
									<Image src={membership.group.image ?? "/icons/emptyImage.svg"} alt="image" width={28} height={28} className="size-8 rounded-lg" />
									<p className="w-fit grow overflow-x-hidden text-ellipsis">{membership.group.name}</p>
								</Link>
							</li>
						))}
					</ul>
				</div>

				<Link
					href="/create-team"
					className={`items-center gap-3 rounded-md px-4 py-3 text-[18px] font-medium hover:bg-background-tertiary ${accessToken ? "flex" : "hidden"}`}
					onClick={sideBarClose}
				>
					<Image src="/icons/teamAdd.svg" alt="selectArrow" width={28} height={28} />
					<p className="grow">팀 생성하기</p>
				</Link>

				<div className="flex flex-col pb-2">
					<Link
						href="/boards"
						className="flex items-center gap-3 rounded-md px-4 py-3 text-[18px] font-medium hover:bg-background-tertiary"
						onClick={sideBarClose}
					>
						<Image src="/icons/board.svg" alt="selectArrow" width={28} height={28} />
						<p className="grow">자유게시판</p>
					</Link>
				</div>
			</div>
		</div>
	);
}
