export default function Layout({ children }: Readonly<React.PropsWithChildren>) {
	return <div className="mx-auto size-full px-[18px] desktop:container tablet:px-6 desktop:px-0">{children}</div>;
}
