import { useQuery } from "@tanstack/react-query";
import API from "@/app/_api/index"; // API 모듈 경로를 맞춰주세요
import tasksKey from "@/app/(team)/[id]/todo/_components/api/queryFactory";

const getGroupList = async (groupId: number) => {
	const response = API["{teamId}/groups/{id}"].GET({
		id: groupId,
	});
	return response;
};

const getTodoItems = async (groupId: number, taskListId: number, currentDate: Date) => {
	const response = await API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"].GET({
		groupId,
		taskListId,
		date: currentDate.toLocaleDateString("ko-KR"),
	});
	return response;
};

export const useGetGroupList = (groupId: number) => {
	const query = useQuery({
		queryKey: ["tasks", { groupId }],
		queryFn: () => getGroupList(groupId),
	});
	return query;
};

export const useGetTodoItems = (groupId: number, taskListId: number, currentDate: Date) => {
	const query = useQuery({
		queryKey: tasksKey.detail(groupId, taskListId, currentDate.toLocaleDateString("ko-KR")),
		queryFn: () => getTodoItems(groupId, taskListId, currentDate),
	});

	return query;
};
