import InvitedList from "@/app/(team)/get-started/_components/InvitedList";
import TeamList from "@/app/(team)/get-started/_components/TeamLists";

export default function GetStartedPage() {
	return (
		<main className="flex h-[85dvh] max-h-[720px] min-h-[500px] w-full justify-center pb-5 pt-20">
			<article className="shadow-primary flex size-full justify-center gap-12 rounded-xl bg-background-secondary p-12 desktop:max-w-screen-desktop">
				<section className="shadow-primary size-full grow rounded-xl bg-background-tertiary">
					<TeamList />
				</section>

				<section className="shadow-primary size-full grow rounded-xl bg-background-tertiary">
					<InvitedList />
				</section>
			</article>
		</main>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: "시작하기" };
