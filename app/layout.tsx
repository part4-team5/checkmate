import QueryProvider from "@/app/_components/QureyProvider";
import "./globals.css";

export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="ko">
			<body>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: "Coworkers", description: ":3" };
