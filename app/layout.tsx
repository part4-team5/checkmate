import "./globals.css";

import Header from "@/app/_components/header";
import GlobalModals from "@/app/_components/GlobalModals";
import QueryProvider from "@/app/_components/QueryProvider";
import Toaster from "@/app/_components/Toaster";

export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="ko" className="scrollbar-hide">
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
