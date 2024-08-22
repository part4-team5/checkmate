import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/app/_api";

// 타입 정의
type Team = Awaited<ReturnType<(typeof API)["{teamId}/groups/{id}"]["GET"]>>;

export type TaskListType = Team["taskLists"][number];

// 그룹 정보를 가져오는 훅
export const useGroupInfo = (id: number) => {
	const fetchGroupInfo = async (): Promise<Team> => API["{teamId}/groups/{id}"].GET({ id });

	return useQuery<Team>({
		queryKey: ["groupInfo", { groupId: id }],
		queryFn: fetchGroupInfo,
		refetchInterval: 60000,
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
};

// 할 일 목록을 삭제하는 훅
export const useDeleteTaskList = (groupId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (taskListId: number) => {
			await API["{teamId}/groups/{groupId}/task-lists/{id}"].DELETE({ id: taskListId });
		},
		onMutate: async (taskListId: number) => {
			await queryClient.cancelQueries({ queryKey: ["groupInfo", { groupId }] });

			const previousGroupInfo = queryClient.getQueryData<{ taskLists: TaskListType[] }>(["groupInfo", groupId]);

			queryClient.setQueryData(["groupInfo", groupId], (oldData: any) => {
				if (!oldData?.taskLists) return oldData;

				const updatedTaskLists = oldData.taskLists.filter((taskListItem: TaskListType) => taskListItem.id !== taskListId);

				return { ...oldData, taskLists: updatedTaskLists };
			});

			return { previousGroupInfo };
		},
		onError: (err, variables, context) => {
			if (context?.previousGroupInfo) {
				queryClient.setQueryData(["groupInfo", { groupId }], context.previousGroupInfo);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["groupInfo", { groupId }] });
		},
	});
};

// 할 일 목록 순서를 변경하는 훅
export const useReorderTaskLists = (groupId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ taskListId, displayIndex }: { taskListId: number; displayIndex: string }) =>
			API["{teamId}/groups/{groupId}/task-lists/{id}/order"].PATCH({ groupId, id: taskListId }, { displayIndex }),
		onMutate: async ({ taskListId, displayIndex }) => {
			await queryClient.cancelQueries({ queryKey: ["groupInfo", { groupId }] });

			const previousTaskLists = queryClient.getQueryData<TaskListType[]>(["groupInfo", { groupId }]);

			if (Array.isArray(previousTaskLists)) {
				const newTaskLists = previousTaskLists.map((task) => (task.id === taskListId ? { ...task, displayIndex: Number(displayIndex) } : task));
				queryClient.setQueryData(["groupInfo", { groupId }], { ...previousTaskLists, taskLists: newTaskLists });
			}

			return { previousTaskLists };
		},
	});
};
