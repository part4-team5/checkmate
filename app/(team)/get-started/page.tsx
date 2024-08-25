"use client";

import InvitedList from "@/app/(team)/get-started/_components/InvitedList";
import TeamList from "@/app/(team)/get-started/_components/TeamLists";
import useBreakPoint from "@/app/_hooks/useBreakPoint";

export default function GetStartedPage() {
	const { isMobile, isTablet } = useBreakPoint();

	return (
		<main className="flex w-full justify-center pb-5 pt-10">
			<article className="flex size-full flex-col gap-8 desktop:max-w-screen-desktop">
				<TeamList isMobile={isMobile} isTablet={isTablet} />

				<InvitedList isMobile={isMobile} isTablet={isTablet} />
			</article>
		</main>
	);
}
