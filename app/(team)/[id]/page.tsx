import getQueryClient from "@/app/_components/GetQueryClient";
import API from "@/app/_api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TeamTitle from "@/app/(team)/[id]/_component/TeamTitle";
import Report from "@/app/(team)/[id]/_component/Report";
import Members from "@/app/(team)/[id]/_component/Members";
import Tasks from "@/app/(team)/[id]/_component/Tasks";

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

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main className="w-full pb-[67px] text-[#F8FAFC]">
				<TeamTitle id={id} />
				<section>
					<Tasks id={id} />
				</section>
				<section className="mt-[48px]">
					<p className="mb-[16px] text-[16px] font-medium">리포트</p>
					<Report id={id} />
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
