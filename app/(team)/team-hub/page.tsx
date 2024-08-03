import Button from "@/app/_components/Button";
import Image from "next/image";

export default function TeamHubPage() {
	return (
		<main className="h-dvh min-w-[310px] bg-background-primary text-text-default">
			<section className="flex h-full flex-col items-center justify-center px-[30px]">
				<div className="flex h-fit w-full max-w-screen-desktop flex-col items-center justify-center gap-12">
					<Image src="/images/teamEmpty.webp" alt="team-empty" priority width={810} height={255} />

					{/* 팀 있으면 목록 보여주기 ? */}
					<div className="text-center text-md font-medium tablet:text-lg">
						아직 소속됨 팀이 없습니다.
						<br />
						팀을 생성하거나 팀에 참여해보세요.
					</div>
				</div>

				<div className="mt-12 flex w-full max-w-[186px] flex-col gap-4 tablet:mt-20">
					<div className="h-[48px]">
						<Button href="/team-entry?type=create">팀 생성하기</Button>
					</div>
					<div className="h-[48px]">
						<Button variant="outline" href="/team-entry?type=join">
							팀 참여하기
						</Button>
					</div>
				</div>
			</section>
		</main>
	);
}
