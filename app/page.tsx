import Image from "next/image";

export default function Page() {
	return (
		<main className="h-full min-w-[320px] bg-background-primary">
			<section className="flex h-[640px] flex-col items-center justify-between tablet:h-[940px] desktop:h-[1080px]">
				<div className="absolute h-[640px] w-full min-w-[320px] tablet:h-[940px] desktop:h-[1080px] desktop:max-w-[1920px]">
					<Image src="/images/landing_main.webp" alt="Landing main" fill priority className="object-cover object-top" />
				</div>

				<div className="z-10 flex flex-col gap-5 pb-[320px] pt-[85px] text-center">
					<div className="flex items-center justify-center gap-1 tablet:gap-4 desktop:gap-6">
						<p className="text-2xl font-semibold text-text-primary tablet:text-[40px] desktop:text-[48px]">함께 만들어가는 투두 리스트</p>
						<div className="relative h-7 w-7 tablet:h-12 tablet:w-12 desktop:h-14 desktop:w-14">
							<Image src="/icons/landingRepair.svg" alt="Repair" fill />
						</div>
					</div>

					<p className="bg-gradient-to-r from-brand-primary to-[#CEF57E] bg-clip-text text-3xl font-semibold text-transparent tablet:text-[48px] tablet:leading-[57px] desktop:text-[64px] desktop:leading-[76px]">
						Coworkers
					</p>
				</div>

				<div className="z-10 flex items-center justify-center pb-[180px]">
					{/* fetch 작동 안하게 a 태그 사용 */}
					<a
						href="/get-started"
						className="flex w-screen min-w-[320px] max-w-[370px] items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-tertiary py-3 font-semibold text-text-primary"
					>
						지금 시작하기
					</a>
				</div>
			</section>

			<section className="flex flex-col items-center gap-6 px-4 tablet:px-6 desktop:gap-20">
				{/* 할 일 추가 */}
				<div className="flex h-screen max-h-[467px] w-full min-w-[320px] rounded-[40px] bg-conic-gradient p-[2px] shadow-[0_0_12px_2px_rgba(0,0,0,0.25)] shadow-background-inverse/25 tablet:max-h-[354px] tablet:max-w-[696px] desktop:max-h-[419px] desktop:max-w-[996px]">
					<div className="flex h-full w-full flex-col-reverse items-center gap-11 rounded-[38px] bg-background-primary tablet:flex-row tablet:items-stretch tablet:justify-center tablet:gap-24 desktop:gap-48">
						<div className="flex tablet:items-end">
							<div className="relative h-[268px] w-[231px] desktop:h-[329px] desktop:w-[284px]">
								<Image src="/images/landing_1.webp" alt="Landing 1" fill className="object-contain" sizes="(max-width: 284px) 100vw" />
							</div>
						</div>

						<div className="flex w-[251px] flex-col tablet:w-fit tablet:justify-center">
							<div className="relative size-[72px]">
								<Image src="/icons/landingFolder.svg" alt="Folder Icon" fill />
							</div>
							<p className="pl-[12px] pt-1 text-2lg font-medium text-text-primary desktop:text-2xl">
								그룹으로 <br />할 일을 관리해요
							</p>
						</div>
					</div>
				</div>

				{/* 멤버 초대 */}
				<div className="flex h-screen max-h-[467px] w-full min-w-[320px] flex-col items-center justify-start gap-10 rounded-[40px] border border-border-primary/10 bg-background-secondary tablet:max-h-[354px] tablet:max-w-[696px] tablet:flex-row-reverse tablet:items-stretch tablet:justify-center tablet:gap-24 desktop:max-h-[419px] desktop:max-w-[996px] desktop:gap-48">
					<div className="relative flex h-[268px] w-[231px] items-start desktop:h-[329px] desktop:w-[284px]">
						<Image src="/images/landing_2.webp" alt="Landing 2" fill className="object-contain" sizes="(max-width: 284px) 100vw" />
					</div>

					<div className="flex w-[251px] flex-col tablet:w-fit tablet:items-end tablet:justify-center">
						<div className="relative flex size-[72px]">
							<Image src="/icons/landingMail.svg" alt="Mail Icon" fill />
						</div>
						<p className="pl-[12px] pt-1 font-medium text-text-primary tablet:pl-0 tablet:pr-[12px] tablet:text-right tablet:text-2lg desktop:text-2xl">
							간단하게 멤버들을 <br />
							초대해요
						</p>
					</div>
				</div>

				{/* 할 일 체크 */}
				<div className="flex h-screen max-h-[467px] w-full min-w-[320px] flex-col items-center justify-start gap-10 rounded-[40px] bg-[#020617] tablet:max-h-[354px] tablet:max-w-[696px] tablet:flex-row tablet:items-stretch tablet:justify-center tablet:gap-24 desktop:max-h-[419px] desktop:max-w-[996px] desktop:gap-48">
					<div className="relative flex h-[268px] w-[231px] items-start desktop:h-[329px] desktop:w-[284px]">
						<Image src="/images/landing_3.webp" alt="Landing 3" fill className="object-contain" sizes="(max-width: 284px) 100vw" />
					</div>

					<div className="flex w-[251px] flex-col tablet:w-fit tablet:justify-center">
						<div className="relative size-[72px]">
							<Image src="/icons/landingChecked.svg" alt="Checked Icon" fill />
						</div>
						<p className="pl-[12px] pt-1 text-2lg font-medium text-text-primary desktop:text-2xl">
							할 일도 간편하게 <br /> 체크해요
						</p>
					</div>
				</div>
			</section>

			<section className="flex h-[640px] flex-col items-center justify-between tablet:h-[940px] desktop:h-[1080px]">
				<div className="absolute h-[640px] w-full min-w-[320px] tablet:h-[940px] desktop:h-[1080px] desktop:max-w-[1920px]">
					<Image src="/images/landing_footer.webp" alt="Landing footer" fill className="object-cover object-bottom" />
				</div>

				<div className="z-10 flex flex-col items-center justify-center gap-6 pt-32 text-center tablet:pt-44 desktop:pt-56">
					<p className="text-2xl font-semibold text-text-primary tablet:text-[40px]">지금 바로 시작해보세요</p>
					<p className="text-lg font-medium text-text-primary tablet:text-2xl">
						팀원 모두와 같은 방향, <br className="block tablet:hidden" /> 같은 속도로 나아가는 가장 쉬운 방법
					</p>
				</div>
			</section>
		</main>
	);
}
