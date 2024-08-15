/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import API from "@/app/_api";
import Button from "@/app/_components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import tasksKey from "@/app/(team)/[id]/todo/_components/api/queryFactory";
import Modal from "@/app/(team)/[id]/todo/_components/AddTodoModal";
import { useState } from "react";
import useOverlay from "@/app/_hooks/useOverlay";
import Form from "@/app/_components/Form";
import { useParams, useSearchParams } from "next/navigation";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

type RecurringCreateBody = Parameters<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/recurring"]["POST"]>[1];

type TodoResponse = Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/recurring"]["POST"]>>;

enum Frequency {
	ONCE = "ONCE",
	DAILY = "DAILY",
	WEEKLY = "WEEKLY",
	MONTHLY = "MONTHLY",
}

export default function AddTodo() {
	const [frequency, setFrequency] = useState<Frequency>(Frequency.ONCE);
	const [weekDays, setWeekDays] = useState<number[]>([]);
	const [monthDay, setMonthDay] = useState<number>(1);
	const [startDate, setStartDate] = useState<string>("");

	const queryClient = useQueryClient();

	const groupId = Number(useParams().id);
	const taskListId = Number(useSearchParams().get("taskId"));

	const overlay = useOverlay();

	const createTodoMutation = useMutation<TodoResponse, Error, FormContext>({
		mutationFn: async (ctx: FormContext): Promise<Awaited<ReturnType<(typeof API)["{teamId}/groups/{groupId}/task-lists/{taskListId}/recurring"]["POST"]>>> => {
			const payload: RecurringCreateBody = {
				name: ctx.values.name as string,
				description: ctx.values.description as string,
				startDate,
				frequencyType: frequency,
				weekDays: frequency === Frequency.WEEKLY ? weekDays : undefined,
				monthDay: frequency === Frequency.MONTHLY ? monthDay : undefined,
			};

			return API["{teamId}/groups/{groupId}/task-lists/{taskListId}/recurring"].POST({ groupId, taskListId }, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tasksKey.all });
		},
	});

	const handleCreateTodo = async (ctx: FormContext) => {
		createTodoMutation.mutate(ctx);
	};

	const handleModalClose = (newFrequency: Frequency, newWeekDays: number[], newMonthDay: number, newDate: string) => {
		setFrequency(newFrequency);
		setWeekDays(newWeekDays);
		setMonthDay(newMonthDay);
		setStartDate(newDate);
	};

	return (
		<Button rounded="full" onClick={() => overlay.open((props) => <Modal {...props} onClose={handleModalClose} handleCreateTodo={handleCreateTodo} />)}>
			+할 일 추가
		</Button>
	);
}
