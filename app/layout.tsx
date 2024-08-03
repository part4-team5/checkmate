import "./globals.css";

import GlobalModals from "@/app/_components/GlobalModals";

export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="ko">
			<body>
				{children}
				<GlobalModals />
			</body>
		</html>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: { template: "%s | Coworkers", default: "Coworkers" } };
