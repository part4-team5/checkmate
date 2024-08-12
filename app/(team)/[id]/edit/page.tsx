import TeamEditForm from "@/app/(team)/[id]/edit/_components/EditForm";
import API from "@/app/_api";
import getQueryClient from "@/app/_components/GetQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function TeamEditPage({ params }: { params: { id: string } }) {
	const { id } = params;

	const queryClient = getQueryClient({ staleTime: 0 });

	await queryClient.prefetchQuery({
		queryKey: ["teamInfo", { id: Number(id) }],
		queryFn: async () => {
			const response = await API["{teamId}/groups/{id}"].GET({ id: Number(id) });
			return response;
		},
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TeamEditForm id={Number(id)} />
		</HydrationBoundary>
	);
}
