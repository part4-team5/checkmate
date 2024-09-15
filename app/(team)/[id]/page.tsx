import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import API from "@/app/_api";

import getQueryClient from "@/app/_utils/QueryClient";

import TeamTitle from "@/app/(team)/[id]/_components/TeamTitle";
import Report from "@/app/(team)/[id]/_components/Report";
import Members from "@/app/(team)/[id]/_components/Members";
import Tasks from "@/app/(team)/[id]/_components/Tasks";

export const runtime = "edge";

export default async function Page({ params }: { params: { id: string } }) {
	const id = Number(params.id);

	const queryClient = getQueryClient({ staleTime: 10000 });

	await queryClient.prefetchQuery({
		queryKey: ["groupInfo", { groupId: id }],
		queryFn: async () => {
			const response = await API["{teamId}/groups/{id}"].GET({ id });
			return response;
		},
	});

	// id가 숫자가 아닌 경우 404 페이지를 반환
	if (Number.isNaN(Number(id)) || queryClient.getQueryData(["groupInfo", { groupId: id }]) === undefined) {
		notFound();
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main className="pb-[67px] text-[#F8FAFC]">
				<TeamTitle id={id} />
				<section className="flex flex-col gap-[24px] desktop:flex-row">
					<section className="flex">
						<Report id={id} />
					</section>
					<section className="desktop:flex-grow-1 mt-[80px] w-full flex-grow-0 desktop:mt-0">
						<Tasks id={id} />
					</section>
				</section>

				<Members id={id} />
			</main>
		</HydrationBoundary>
	);
}

export async function generateMetadata({ params }: { params: { id: string } }) {
	return {
		title: `${params.id}팀`,
	};
}
