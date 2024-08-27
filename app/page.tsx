import Button from "@/app/_components/Button";
import LandingProgressBar from "@/app/_components/LandingProgressBar";

export default function Page() {
	return (
		<main className="flex size-full min-w-[320px] flex-col items-center bg-landing-primary">
			<section className="flex h-[1200px] max-h-[calc(100dvh-60px)] w-full max-w-[1400px] items-center justify-center px-4">
				<div className="z-10 flex flex-col">
					<p className="text-3xl font-semibold text-text-primary">함께 만들어가는 할 일 목록</p>

					<p className="text-[130px] font-bold leading-[140px] text-brand-primary">
						CHECK,
						<br />
						MATE!
					</p>
					<div className="flex h-[48px] w-full items-center justify-center pl-10 pr-36">
						<Button rounded="full">지금 함께하기</Button>
					</div>
				</div>

				<LandingProgressBar />
			</section>

			<section className="flex h-[1200px] max-h-[calc(100dvh-60px)] w-full items-center justify-center bg-landing-tertiary">
				<div className="flex size-full grow items-center justify-center gap-16 px-4">
					<div className="size-full max-h-[450px] max-w-[660px] grow rounded-[40px] bg-landing-secondary">{/* 이미지 */}</div>

					<div className="">
						<p className="text-xl font-medium text-brand-primary">POINT 1</p>
						<div className="pt-[30px]" />
						<p className="text-[65px] font-semibold leading-[80px] text-text-primary">
							그룹으로
							<br /> 할 일 관리
						</p>
					</div>
				</div>
			</section>

			<section className="flex h-[1200px] max-h-[calc(100dvh-60px)] w-full items-center justify-center bg-landing-secondary">
				<div className="flex size-full grow flex-row-reverse items-center justify-center gap-16 px-4">
					<div className="size-full max-h-[450px] max-w-[660px] grow rounded-[40px] bg-landing-tertiary">{/* 이미지 */}</div>

					<div className="">
						<p className="text-end text-xl font-medium text-brand-primary">POINT 2</p>
						<div className="pt-[30px]" />
						<p className="text-end text-[65px] font-semibold leading-[80px] text-text-primary">
							할 일을 간편하게
							<br /> CHECK!
						</p>
					</div>
				</div>
			</section>

			<section className="flex h-[1200px] max-h-[calc(100dvh-60px)] w-full items-center justify-center bg-landing-tertiary">
				<div className="flex size-full grow items-center justify-center gap-16 px-4">
					<div className="flex size-full max-h-[600px] max-w-[660px] grow justify-center">
						<div className="size-full max-h-[600px] max-w-[363px] grow rounded-[40px] bg-landing-secondary">{/* 이미지 */}</div>
					</div>

					<div className="">
						<p className="text-xl font-medium text-brand-primary">POINT 3</p>
						<div className="pt-[30px]" />
						<p className="text-[65px] font-semibold leading-[80px] text-text-primary">
							자유게시판에서
							<br />
							Mate들과 소통
						</p>
					</div>
				</div>
			</section>

			<section className="flex h-[1200px] max-h-[calc(100dvh-60px)] w-full flex-col items-center justify-center bg-landing-secondary">
				<p className="text-center text-[40px] font-semibold leading-[45px] text-text-primary">
					팀원 모두와 같은 방향,
					<br />
					같은 속도로 나아가는 가장 쉬운 방법
				</p>

				<div className="pt-14" />

				<div className="flex h-[56px] w-full max-w-[400px] items-center justify-center">
					<Button fontSize="xl" rounded="full">
						지금 함께하기
					</Button>
				</div>

				<div className="h-[50%]">{/* 이미지 */}</div>
			</section>

			<footer className="flex h-[300px] w-full items-center justify-around bg-landing-quaternary text-md text-text-primary">
				<div className="">
					<p className="text-lg font-bold">Copyright ⓒ CHECKMATE. All Rights Reserved</p>
					<div className="pt-[10px]" />
					<p>
						사업자등록번호 2024-09-020000 | 통신판매신고 제2020-서울-00000호 | 대표 : 김유정
						<br />
						서울특별시 중구 청계천로 123, 대신증권빌딩
					</p>

					<div className="pt-[26px]" />

					<div className="flex gap-7">
						<button type="button">서비스 이용약관</button>
						<button type="button">개인정보 취급방침</button>
						<button type="button">전자금융거래 기본약관</button>
					</div>
				</div>

				<div className="flex gap-4">
					<button type="button">이메일</button>
					<button type="button">페이스북</button>
					<button type="button">인스타그램</button>
				</div>
			</footer>
		</main>
	);
}
