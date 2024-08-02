import QueryProvider from "@/app/_components/QureyProvider";
import GlobalModals from "@/app/_components/GlobalModals";
import "./globals.css";

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
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
export const metadata = { title: "Coworkers", description: ":3" };
