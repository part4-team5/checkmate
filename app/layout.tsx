import "./globals.css";

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="ko">
			<body>
				{children}
				<div id="portal" />
			</body>
		</html>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: "Coworkers", description: ":3" };
