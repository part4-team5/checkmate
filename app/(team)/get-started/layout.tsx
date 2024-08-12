export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	return <main className="size-full min-w-[320px] bg-background-primary text-text-default">{children}</main>;
}

/** @type {import("next").Metadata} */
export const metadata = { title: "시작하기" };
