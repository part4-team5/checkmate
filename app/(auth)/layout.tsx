export default function AuthLayout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<main className="box-border size-full bg-background-primary p-[24px_0] tablet:p-[140px_0]">
			<section className="m-[0_16px] w-auto tablet:m-[0_auto] tablet:w-[460px]">{children}</section>
		</main>
	);
}