import LandingProgressBar from "@/app/_components/LandingProgressBar";
import Image from "next/image";

export default function Page() {
	return (
		<main className="flex size-full min-w-[320px] flex-col items-center bg-landing-primary">
			<section className="flex w-full max-w-screen-desktop items-center justify-between gap-[120px] py-[120px]">
				<div className="z-10 flex flex-col">
					<p className="text-2xl font-semibold text-text-primary">함께 만들어가는 할 일 목록</p>

					<p className="m-[20px_0_40px] text-[100px] font-bold leading-tight text-brand-primary">
						CHECK,
						<br />
						MATE!
					</p>
					<div className="h-[48px] w-[230px]">
						<a
							href="/get-started"
							className="bg-custom-gradient flex size-full items-center justify-center rounded-full bg-[rgb(17,190,132)] font-semibold text-text-inverse"
						>
							지금 함께하기
						</a>
					</div>
				</div>

				<LandingProgressBar />
			</section>

			<section className="w-full bg-landing-tertiary py-[120px]">
				<div className="m-[0_auto] flex size-full max-w-screen-desktop items-center gap-16">
					<div className="h-[450px] w-[50%] rounded-[40px] bg-landing-secondary">{/* 이미지 */}</div>

					<div className="">
						<p className="text-xl font-medium text-brand-primary">POINT 1</p>
						<div className="pt-[30px]" />
						<p className="text-[60px] font-semibold leading-[80px] text-text-primary">
							그룹으로
							<br /> 할 일 관리
						</p>
					</div>
				</div>
			</section>

			<section className="bg-landing-green w-full py-[120px]">
				<div className="m-[0_auto] flex max-w-screen-desktop flex-row-reverse items-center justify-between gap-16">
					<div className="h-[450px] w-[50%] rounded-[40px] bg-landing-tertiary">{/* 이미지 */}</div>

					<div className="">
						<p className="text-xl font-medium text-brand-primary">POINT 2</p>
						<div className="pt-[30px]" />
						<p className="text-[60px] font-semibold leading-[80px] text-text-primary">
							할 일을 간편하게
							<br /> CHECK!
						</p>
					</div>
				</div>
			</section>

			<section className="w-full bg-landing-tertiary py-[120px]">
				<div className="m-[0_auto] flex max-w-screen-desktop items-center justify-between gap-16">
					<div className="flex h-[600px] w-[30%] justify-center">
						<div className="size-full rounded-[40px] bg-landing-secondary">{/* 이미지 */}</div>
					</div>

					<div className="">
						<p className="text-xl font-medium text-brand-primary">POINT 3</p>
						<div className="pt-[30px]" />
						<p className="text-[60px] font-semibold leading-[80px] text-text-primary">
							자유게시판에서
							<br />
							Mate들과 소통
						</p>
					</div>
				</div>
			</section>

			<section className="flex w-full flex-col items-center justify-center bg-landing-secondary py-[140px]">
				<p className="text-center text-[50px] font-semibold leading-tight text-text-primary">
					팀원 모두와 <span className="text-brand-primary">같은 방향,</span>
					<br />
					<span className="text-brand-primary">같은 속도</span>로 나아가는 가장 쉬운 방법
				</p>

				<div className="mt-[60px] flex h-[60px] w-[290px] items-center justify-center">
					<a
						href="/get-started"
						className="bg-custom-gradient flex size-full items-center justify-center rounded-full bg-[rgb(17,190,132)] font-semibold text-text-inverse"
					>
						지금 함께하기
					</a>
				</div>

				<div className="relative mt-[70px] h-[255px] w-[810px]">
					<Image src="/images/main_bottom.png" alt="main image" fill />
				</div>
			</section>

			<footer className="flex h-[300px] w-full items-center justify-around bg-landing-quaternary text-md text-[#ffffff]">
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
