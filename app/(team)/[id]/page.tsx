import Report from "@/app/(team)/[id]/_component/Report";

export default function Page() {
	return (
		<main className="size-full text-[#F8FAFC]">
			<section className="mt-[24px] h-[64px] rounded-[12px] bg-background-tertiary" />
			<section className="mt-[24px] h-[245px] rounded-[12px] bg-background-tertiary" />
			<section className="mt-[48px]">
				<p className="mb-[16px] text-[16px] font-medium">리포트</p>
				<Report />
			</section>
			<section className="mt-[48px] h-[197px] rounded-[12px] bg-background-tertiary" />
		</main>
	);
}

export async function generateMetadata({ params }: { params: { id: string } }) {
	return {
		title: `${params.id}팀`,
	};
}
