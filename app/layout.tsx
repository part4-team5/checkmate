import "./globals.css";

import GlobalModals from "@/app/_components/GlobalModals";
import QueryProvider from "@/app/_components/QureyProvider";

export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="ko">
			<body>
				<QueryProvider>
					{children}
					<GlobalModals />
				</QueryProvider>
			</body>
		</html>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: { template: "%s | coworkers", default: "coworkers" } };
