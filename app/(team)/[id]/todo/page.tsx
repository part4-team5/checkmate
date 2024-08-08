import ClientTodo from "@/app/(team)/[id]/todo/todo";
import API from "@/app/_api";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

type PageProps = {
	params: {
		team: string;
		id: string;
	};
	searchParams: {
		taskId: string;
	};
};
export default async function Page({ params, searchParams }: PageProps) {
	const queryClient = new QueryClient();
	const groupId = Number(params.id);
	const taskId = Number(searchParams.taskId);
	await queryClient.prefetchQuery({
		queryKey: ["tasks", { groupId }],
		queryFn: async () => {
			const res = API["{teamId}/groups/{id}"].GET({
				id: groupId,
			});
			return res;
		},
		staleTime: 1000 * 60,
	});

	return (
		<div className="pt-10">
			<h1 className="text-xl font-bold text-text-primary">할 일</h1>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<ClientTodo groupId={groupId} taskId={taskId} />
			</HydrationBoundary>
		</div>
	);
}

/** @type {import("next").Metadata} */
export const metadata = { title: "할 일 리스트" };
