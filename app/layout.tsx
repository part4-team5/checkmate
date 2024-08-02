import Header from "@/app/_components/header";
import "./globals.css";

export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="ko">
			<body>
				<Header />
				{children}
			</body>
		</html>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: "Coworkers", description: ":3" };
