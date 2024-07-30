import Checked from "@/public/icons/Checked";
import Folder from "@/public/icons/Folder";
import Mail from "@/public/icons/Mail";
import Repair from "@/public/icons/Repair";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
	// 로그인 상태 체크
	// 팀이 없는 경우 팀 생성 페이지로 이동
	// 팀이 있는 경우 팀 페이지로 이동
	// 로그인 상태가 아닌 경우 로그인 페이지로 이동
	// const isLogin = useStore((state) => state.increasePopulation);
	// const hasTeam = false;
	// const [href, setHref] = useState<string>("/login");
	// if(isLogin) { if(!hasTeam) { setHref("/team/create") } else { setHref("/team") } } else { setHref("/login") }

	return (
		<main className="h-full bg-background-primary">
			<section className="flex h-dvh max-h-[1080px] flex-col justify-between">
				<div className="absolute h-dvh max-h-[1080px] w-dvw">
					<Image src="/images/landing_main.webp" alt="Landing main" fill priority className="object-cover object-top" />
				</div>

				<div className="z-10 pt-[85px]">
					<div className="flex items-center justify-center gap-6">
						<p className="text-[48px] font-semibold text-text-primary">함께 만들어가는 투두 리스트</p>

						<Repair width={56} height={56} />
					</div>

					<p className="flex items-center justify-center bg-gradient-to-r from-brand-primary to-[#CEF57E] bg-clip-text text-[64px] font-semibold text-transparent">
						Coworkers
					</p>
				</div>

				<div className="z-10 flex items-center justify-center pb-[180px]">
					<Link
						href="/login"
						className="flex w-[370px] items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-tertiary py-3 font-semibold text-text-primary"
					>
						지금 시작하기
					</Link>
				</div>
			</section>

			<section className="flex flex-col items-center gap-20 pb-56">
				{/* 할 일 추가 */}
				<div className="flex h-[419px] w-[996px] rounded-[40px] bg-conic-gradient p-[3px] shadow-linear shadow-background-inverse/25">
					<div className="flex h-full w-full justify-center gap-48 rounded-[38px] bg-background-primary">
						<div className="flex items-end">
							<div className="relative h-[329px] w-[284px]">
								<Image src="/images/landing_1.webp" alt="Landing 1" fill className="object-contain" />
							</div>
						</div>
						<div className="flex flex-col justify-center">
							<Folder width={72} height={72} />
							<p className="pl-[12px] pt-1 text-2xl font-medium text-text-primary">
								그룹으로 <br />할 일을 관리해요
							</p>
						</div>
					</div>
				</div>

				{/* 멤버 초대 */}
				<div className="flex h-[419px] w-[996px] flex-row-reverse justify-center gap-48 rounded-[40px] border border-border-primary/10 bg-background-secondary">
					<div className="relative flex h-[329px] w-[284px] items-start">
						<Image src="/images/landing_2.webp" alt="Landing 2" fill className="object-contain" />
					</div>

					<div className="flex flex-col items-end justify-center">
						<Mail width={72} height={72} />
						<p className="pr-[12px] pt-1 text-right text-2xl font-medium text-text-primary">
							간단하게 멤버들을 <br />
							초대해요
						</p>
					</div>
				</div>

				<div className="flex h-[419px] w-[996px] justify-center gap-48 rounded-[40px] border border-border-primary/10 bg-[#020617]">
					<div className="relative flex h-[329px] w-[284px] items-start">
						<Image src="/images/landing_3.webp" alt="Landing 3" fill className="object-contain" />
					</div>

					<div className="flex flex-col justify-center">
						<Checked width={72} height={72} />
						<p className="pl-[12px] pt-1 text-2xl font-medium text-text-primary">
							할 일도 간편하게 <br /> 체크해요
						</p>
					</div>
				</div>
			</section>

			<section className="flex h-dvh max-h-[850px] flex-col justify-between">
				<div className="absolute h-dvh max-h-[850px] w-dvw">
					<Image src="/images/landing_footer.webp" alt="Landing footer" className="object-cover object-bottom" fill priority />
				</div>

				<div className="z-10 flex flex-col items-center justify-center gap-6">
					<p className="text-[40px] font-semibold text-text-primary">지금 바로 시작해보세요</p>

					<p className="text-2xl font-medium text-text-primary">팀원 모두와 같은 방향, 같은 속도로 나아가는 가장 쉬운 방법</p>
				</div>
			</section>
		</main>
	);
}
