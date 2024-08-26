/* eslint-disable no-nested-ternary */

import "./globals.css";

import Header from "@/app/_components/header";
import GlobalModals from "@/app/_components/GlobalModals";
import QueryProvider from "@/app/_components/QueryProvider";
import Toaster from "@/app/_components/Toaster";

export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	// 서버 사이드 렌더링에서는 테마를 결정할 수 없으므로, 초기값은 빈 문자열로 설정
	const themeClass = typeof window !== "undefined" ? (localStorage.getItem("theme") === "dark" ? "dark" : "") : "";

	return (
		<html lang="ko" className={`scrollbar-hide ${themeClass}`}>
			<head>
				{/* 인라인 스크립트로 초기 테마 설정 */}
				<script
					dangerouslySetInnerHTML={{
						__html: `
                        (function() {
                            const theme = localStorage.getItem('theme') || 'light';
                            if (theme === 'dark') {
                                document.documentElement.classList.add('dark');
                            } else {
                                document.documentElement.classList.remove('dark');
                            }
                        })();
                    `,
					}}
				/>
			</head>
			<body className="size-full min-h-dvh bg-background-primary pt-[60px]">
				<QueryProvider>
					<Header />
					{children}
					<GlobalModals />
					<Toaster />
				</QueryProvider>
			</body>
		</html>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: { template: "%s | Coworkers", default: "Coworkers" } };
