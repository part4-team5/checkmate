import TeamList from "@/app/(team)/get-started/_components/TeamLists";
import Button from "@/app/_components/Button";

export default function GetStartedPage() {
	return (
		<main className="size-full">
			<section className="flex h-full flex-col items-center justify-center px-[30px]">
				{/* 팀 있으면 목록 보여주기 ? */}
				<TeamList />

				<div className="mt-12 flex w-full max-w-screen-tablet items-center justify-center gap-4 tablet:mt-20">
					<div className="h-[48px] flex-grow">
						<Button href="/create-team">팀 생성하기</Button>
					</div>
					<div className="h-[48px] flex-grow">
						<Button variant="outline" href="/join-team">
							팀 참여하기
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: "시작하기" };
