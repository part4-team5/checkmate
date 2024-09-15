export default function Page() {
	return (
		<main className="flex h-[calc(100dvh-60px)] w-full flex-col items-center justify-center text-text-primary">
			<div className="glitch text-[128px] font-bold tablet:text-[256px]" data-glitch="404">
				404
			</div>
			<div>
				<span className="font-bold text-brand-primary">Oops!</span> we cant seem to find the page you&apos;re looking for
			</div>
		</main>
	);
}
