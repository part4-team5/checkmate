/* eslint-disable no-nested-ternary */

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Aos from "aos";

import "aos/dist/aos.css";

import Cookie from "@/app/_utils/Cookie";

import LandingProgressBar from "@/app/_components/LandingProgressBar";

export default function Page() {
	// 초기 다크모드 상태를 true로 설정
	const [isDarkMode, setIsDarkMode] = useState<boolean>(Cookie.get("theme") === null ? true : Cookie.get("theme") === "dark");

	useEffect(() => {
		Aos.init();

		// 다크모드 클래스 변경 감지를 위한 MutationObserver 설정
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === "attributes" && mutation.attributeName === "class") {
					// 'dark' 클래스가 있는지 검사하고 상태 업데이트
					setIsDarkMode(document.documentElement.classList.contains("dark"));
				}
			});
		});

		// HTML 태그의 클래스 변경을 감시하도록 설정
		observer.observe(document.documentElement, { attributes: true });

		// 컴포넌트 언마운트 시 MutationObserver 해제
		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<main className="flex size-full min-w-[320px] flex-col items-center bg-landing-primary">
			<section className="flex w-full max-w-screen-desktop flex-col items-center justify-between gap-[30px] px-2 py-[30px] tablet:gap-[60px] tablet:px-0 tablet:py-[60px] desktop:flex-row desktop:gap-[120px] desktop:py-[120px]">
				<div className="z-10 flex flex-col">
					<p className="text-2xl font-semibold text-text-primary" data-aos="fade-up">
						함께 만들어가는 할 일 목록
					</p>

					<p
						className="m-[20px_0_40px] text-[80px] font-bold leading-[80px] text-brand-primary tablet:text-[100px] tablet:leading-tight"
						data-aos="fade-up"
						data-aos-delay="100"
					>
						CHECK,{"\u00A0"}
						<br className="tablet:hidden desktop:block" />
						MATE!
					</p>
					<div className="h-[48px] w-full desktop:w-[230px]" data-aos="fade-up" data-aos-delay="200">
						<a
							href="/get-started"
							className="flex size-full transform items-center justify-center rounded-full bg-[rgb(17,190,132)] bg-custom-gradient font-semibold text-text-inverse transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[2px_2px_8px_3px_rgb(13,204,140,0.2)]"
						>
							지금 함께하기
						</a>
					</div>
				</div>

				<LandingProgressBar />
			</section>

			<section className="w-full bg-landing-tertiary px-2 py-[60px] tablet:px-0 tablet:py-[120px]">
				<div className="m-[0_auto] flex size-full max-w-screen-desktop flex-col-reverse items-center gap-10 tablet:gap-28 desktop:flex-row">
					<div className="relative h-[270px] w-full max-w-screen-tablet tablet:h-[470px] desktop:w-[690px]" data-aos="fade-up">
						<Image src={isDarkMode ? "/images/point1_dark.png" : "/images/point1_light.png"} alt="point1" fill className="rounded-[30px] object-contain" />
					</div>

					<div className="w-full max-w-screen-tablet px-5 tablet:px-10 desktop:w-auto desktop:max-w-none desktop:px-0">
						<p className="text-xl font-medium text-brand-primary" data-aos="fade-up" data-aos-delay="100">
							POINT 1
						</p>
						<div className="pt-[15px] tablet:pt-[30px]" />
						<p
							className="text-[40px] font-semibold leading-[50px] text-text-primary tablet:text-[60px] tablet:leading-[80px]"
							data-aos="fade-up"
							data-aos-delay="200"
						>
							그룹으로{"\u00A0"}
							<br className="hidden desktop:block" />할 일 관리
						</p>
					</div>
				</div>
			</section>

			<section className="w-full bg-landing-green px-2 py-[60px] tablet:px-0 tablet:py-[120px]">
				<div className="m-[0_auto] flex max-w-screen-desktop flex-col-reverse items-center justify-between gap-10 tablet:gap-28 desktop:flex-row-reverse">
					<div className="relative h-[270px] w-full max-w-screen-tablet tablet:h-[470px] desktop:w-[690px]">
						<Image
							src={isDarkMode ? "/images/point2_dark.png" : "/images/point2_light.png"}
							alt="point2"
							fill
							className="rounded-[30px] object-contain"
							data-aos="fade-up"
						/>
						<div className="absolute -top-[38px] right-[74px] h-20 w-16 tablet:-top-[85px] tablet:size-auto" data-aos="fade-down">
							<Image src="/images/point2_icon.png" alt="icon" width={99} height={120} />
						</div>
					</div>

					<div className="w-full max-w-screen-tablet px-5 text-right tablet:px-10 desktop:w-auto desktop:max-w-none desktop:px-0">
						<p className="text-xl font-medium text-brand-primary" data-aos="fade-up" data-aos-delay="100">
							POINT 2
						</p>
						<div className="pt-[15px] tablet:pt-[30px]" />
						<p
							className="text-[40px] font-semibold leading-[50px] text-text-primary tablet:text-[60px] tablet:leading-[80px]"
							data-aos="fade-up"
							data-aos-delay="200"
						>
							할 일을 간편하게
							<br /> CHECK!
						</p>
					</div>
				</div>
			</section>

			<section className="w-full bg-landing-tertiary px-2 py-[60px] tablet:px-0 tablet:py-[120px]">
				<div className="m-[0_auto] flex size-full max-w-screen-desktop flex-col-reverse items-center gap-10 tablet:gap-28 desktop:flex-row">
					<div className="relative h-[270px] w-full max-w-screen-tablet tablet:h-[470px] desktop:w-[690px]">
						<Image
							src={isDarkMode ? "/images/point3_dark.png" : "/images/point3_light.png"}
							alt="point3"
							fill
							className="rounded-[30px] object-contain"
							data-aos="fade-up"
						/>
						<div
							className="absolute -bottom-[10px] -left-[10px] w-20 tablet:-bottom-[50px] tablet:-left-[20px] tablet:size-auto desktop:-left-[80px]"
							data-aos="fade-right"
						>
							<Image src="/images/point3_icon.png" alt="icon" width={150} height={234} />
						</div>
					</div>

					<div className="w-full max-w-screen-tablet px-5 tablet:px-10 desktop:w-auto desktop:max-w-none desktop:px-0">
						<p className="text-xl font-medium text-brand-primary" data-aos="fade-up" data-aos-delay="100">
							POINT 3
						</p>
						<div className="pt-[15px] tablet:pt-[30px]" />
						<p
							className="text-[40px] font-semibold leading-[50px] text-text-primary tablet:text-[60px] tablet:leading-[80px]"
							data-aos="fade-up"
							data-aos-delay="200"
						>
							자유게시판에서
							<br />
							Mate들과 소통
						</p>
					</div>
				</div>
			</section>

			<section className="flex w-full flex-col items-center justify-center bg-landing-secondary px-2 py-[60px] tablet:px-0 tablet:py-[140px]">
				<p className="text-center text-[30px] font-semibold leading-tight text-text-primary tablet:text-[50px]" data-aos="fade-up">
					팀원 모두와 <span className="text-brand-primary">같은 방향,</span>
					<br />
					<span className="text-brand-primary">같은 속도</span>로 나아가는
					<br className="tablet:hidden" /> 가장 쉬운 방법
				</p>

				<div className="mt-[30px] flex h-[60px] w-[290px] items-center justify-center tablet:mt-[60px]" data-aos="fade-up" data-aos-delay="100">
					<a
						href="/get-started"
						className="flex size-full transform items-center justify-center rounded-full bg-[rgb(17,190,132)] bg-custom-gradient text-xl font-bold text-text-inverse transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[2px_2px_8px_3px_rgb(13,204,140,0.2)]"
					>
						지금 함께하기
					</a>
				</div>

				<div
					className="relative mt-[30px] h-[200px] w-full tablet:mt-[70px] tablet:h-[255px] tablet:max-w-screen-tablet desktop:w-[810px]"
					data-aos="fade-up"
					data-aos-delay="200"
				>
					<Image src="/images/main_bottom.png" alt="main image" fill className="object-contain" />
				</div>
			</section>

			<footer className="w-full bg-landing-quaternary p-[80px_0_100px] px-2 text-md text-text-tertiary tablet:max-w-screen-tablet tablet:px-0 desktop:max-w-none">
				<div className="m-[0_auto] flex max-w-screen-desktop flex-col items-start justify-between tablet:flex-row">
					<div className="">
						<p className="text-lg font-medium text-[#ffffff]">Copyright ⓒ CHECKMATE. All Rights Reserved</p>
						<p className="py-[30px] leading-5">
							사업자등록번호 2024-09-020000 | 통신판매신고 제2020-서울-00000호 | 대표 : 김유정
							<br />
							서울특별시 중구 청계천로 123, 대신증권빌딩
						</p>
						<div className="flex gap-3 text-sm tablet:gap-7 tablet:text-md">
							<button type="button">서비스 이용약관</button>
							<button type="button">개인정보 취급방침</button>
							<button type="button">전자금융거래 기본약관</button>
						</div>
					</div>

					<div className="pt-[40px] tablet:hidden" />

					<div className="flex w-full justify-end gap-5 tablet:w-auto">
						<button type="button">
							<Image src="/icons/mail.svg" alt="mail" width={40} height={40} />
						</button>
						<button type="button">
							<Image src="/icons/facebook.svg" alt="facebook" width={40} height={40} />
						</button>
						<button type="button">
							<Image src="/icons/instagram.svg" alt="instagram" width={40} height={40} />
						</button>
					</div>
				</div>
			</footer>
		</main>
	);
}
