/* eslint-disable no-restricted-syntax */

import TeamEditForm from "@/app/(team)/[id]/edit/_components/EditForm";
import API from "@/app/_api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function TeamEditPage({ params }: { params: { id: string } }) {
	const { id } = params;

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["teamInfo", { id: Number(id) }],
		queryFn: async () => {
			const response = await API["{teamId}/groups/{id}"].GET({ id: Number(id) }).then((res) => res);
			return response;
		},
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TeamEditForm />
		</HydrationBoundary>
	);
}
