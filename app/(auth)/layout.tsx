export default function AuthLayout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<main className="box-border w-full bg-background-primary p-[24px_0] tablet:p-[80px_0]">
			<section className="m-[0_16px] w-auto tablet:m-[0_auto] tablet:w-[460px]">{children}</section>
		</main>
	);
}
