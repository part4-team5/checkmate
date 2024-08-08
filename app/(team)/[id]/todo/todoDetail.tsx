import API from "@/app/_api";
import CloseIcon from "@/public/icons/ic_close";
import { useQuery } from "@tanstack/react-query";

type TodoDetailProps = {
	id: number;
	close: () => void;
};
export default function TodoDetail({ id, close }: TodoDetailProps) {
	const { data } = useQuery({
		queryKey: ["tasks", { taskId: id }],
		queryFn: async () => {
			const response = API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"].GET({
				taskId: id,
			});
			return response;
		},
		staleTime: 1000 * 60,
	});

	return (
		<div>
			<button type="button" onClick={close} aria-label="버튼">
				<CloseIcon width={24} height={24} />
			</button>
			{data && (
				<div>
					<div>{data.name}</div>
					<div>{data.description}</div>
				</div>
			)}
		</div>
	);
}
