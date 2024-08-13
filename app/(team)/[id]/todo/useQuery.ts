import { useQuery } from "@tanstack/react-query";
import API from "@/app/_api/index"; // API 모듈 경로를 맞춰주세요
import tasksKey from "@/app/(team)/[id]/todo/queryFactory";

const getTodoItems = async (groupId: number, taskListId: number, currentDate: Date) => {
	const response = await API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"].GET({
		groupId,
		taskListId,
		date: currentDate.toLocaleDateString("ko-KR"),
	});
	return response;
};

const useGetTodoItems = (groupId: number, taskListId: number, currentDate: Date) => {
	const { data, error, isLoading } = useQuery({
		queryKey: tasksKey.detail(groupId, taskListId, currentDate.toLocaleDateString("ko-KR")),
		queryFn: () => getTodoItems(groupId, taskListId, currentDate),
	});

	return { data, error, isLoading };
};

export default useGetTodoItems;
