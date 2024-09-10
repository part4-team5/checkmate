/* eslint-disable no-nested-ternary */

import Header from "@/app/_components/header";
import "./globals.css";

import GlobalModals from "@/app/_components/modals/GlobalModals";
import QueryProvider from "@/app/_components/QueryProvider";
import Toaster from "@/app/_components/Toaster";
import Cookie from "@/app/_utils/Cookie";

export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	const themeClass = Cookie.get("theme") === null ? "dark" : Cookie.get("theme") === "dark" ? "dark" : "";

	return (
		<html lang="ko" className={`scrollbar-hide ${themeClass}`}>
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
export const metadata = { title: { template: "%s | Checkmate", default: "Checkmate" } };
