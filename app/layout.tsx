import "./globals.css";

import Header from "@/app/_components/header";
import GlobalModals from "@/app/_components/GlobalModals";
import QueryProvider from "@/app/_components/QueryProvider";

export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="ko">
			<body className="bg-background-primary text-text-primary">
				<QueryProvider>
					<Header />
					{children}
					<GlobalModals />
				</QueryProvider>
			</body>
		</html>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: { template: "%s | Coworkers", default: "Coworkers" } };
