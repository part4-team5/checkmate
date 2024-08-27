/* eslint-disable no-nested-ternary */
import Button from "@/app/_components/Button";
import Calendar from "@/app/_components/Calendar";
import DropDown from "@/app/_components/Dropdown";
import Form from "@/app/_components/Form";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import Icon from "@/app/_icons";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCreateTodoMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import toast from "@/app/_utils/Toast";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

enum Frequency {
	ONCE = "ONCE",
	DAILY = "DAILY",
	WEEKLY = "WEEKLY",
	MONTHLY = "MONTHLY",
}

export default function Modal({ close }: { close: () => void }) {
	const [frequency, setFrequency] = useState<Frequency>(Frequency.ONCE);
	const [weekDays, setWeekDays] = useState<number[]>([]);
	const [monthDay, setMonthDay] = useState<number>(1);
	const [startDate, setStartDate] = useState<Date>(() => new Date());
	const [isCalendarOpened, setIsCalendarOpened] = useState(false);

	const startYear = startDate.getFullYear();
	const startMonth = `0${startDate.getMonth() + 1}`.slice(-2); // 월은 0부터 시작하므로 +1 필요
	const startDay = `0${startDate.getDate()}`.slice(-2);

	const formattedDate = `${startYear}-${startMonth}-${startDay}`;

	const groupId = Number(useParams().id);
	const taskListId = Number(useSearchParams().get("taskId"));
	const createTodoMutation = useCreateTodoMutation(groupId, taskListId);

	const dayLabels: { [key: number]: string } = {
		0: "일",
		1: "월",
		2: "화",
		3: "수",
		4: "목",
		5: "금",
		6: "토",
	};

	const handleCreateTodo = async (ctx: FormContext) => {
		toast.promise(
			createTodoMutation.mutateAsync({
				name: ctx.values.name as string,
				description: ctx.values.description as string,
				startDate: `${formattedDate}T00:00:00Z`,
				frequencyType: frequency,
				weekDays,
				monthDay,
			}),
			{
				loading: "생성 중...",
				success: "할 일이 생성되었습니다.",
				error: "할 일 생성 중 문제가 발생했습니다.",
			},
		);
	};

	useEffect(() => {
		if (createTodoMutation.isSuccess) {
			close();
		}
	}, [close, createTodoMutation.isSuccess]);

	return (
		<ModalWrapper close={close}>
			<div className="size-full max-h-[90dvh] overflow-y-auto px-2 scrollbar:w-2 scrollbar:rounded-full scrollbar:bg-background-primary scrollbar-thumb:rounded-full scrollbar-thumb:bg-background-tertiary">
				<div className="relative flex size-full flex-col items-center justify-center gap-4 pt-4">
					<button type="button" onClick={close} className="absolute right-0 top-0" aria-label="close">
						<Icon.Close width={24} height={24} />
					</button>

					<h1 className="text-lg font-medium text-text-primary">할 일 만들기</h1>
					<p className="text-center text-md font-medium text-text-default">
						할 일은 실제로 행동 가능한 작업 중심으로
						<br /> 작성해주시면 좋습니다.
					</p>
				</div>
				<Form
					onSubmit={(ctx) => {
						handleCreateTodo(ctx);
					}}
				>
					<div className="mx-auto flex w-full max-w-80 flex-col tablet:min-w-80">
						<div className="pt-6" />

						<label htmlFor="name" className="w-full pb-3 text-start text-text-primary">
							<span className="text-text-emerald"> * </span> 할 일 제목
						</label>
						<Form.Input
							id="name"
							type="text"
							placeholder="할 일 제목을 입력해주세요."
							tests={[
								{ type: "require", data: true, error: "할 일 제목은 필수입니다" },
								{ type: "maxlength", data: 30, error: "30자 이내로 입력해주세요" },
							]}
						/>

						<div className="pt-2" />

						<Form.Error htmlFor="name" />

						<div className="pt-3" />

						<label htmlFor="date" className="w-full pb-3 text-start text-text-primary">
							<span className="text-text-emerald"> * </span> 시작 날짜 및 시간
						</label>

						{/* 날짜 선택 */}
						<div className="flex">
							<div className="max-w-[50%] grow">
								{/* <Form.Input id="date" type="date" tests={[{ type: "require", data: true, error: "시작 날짜는 필수입니다" }]} /> */}
								<button
									type="button"
									className="flex h-[50px] w-full items-center justify-between rounded-xl border border-border-primary bg-todo-primary px-3 text-lg font-medium text-text-default shadow-input"
									onClick={() => {
										setIsCalendarOpened((prev) => !prev);
									}}
								>
									{startDate.toLocaleDateString("ko-KR")}
								</button>
							</div>
						</div>

						<div className={`size-full pt-2 ${!isCalendarOpened ? "hidden" : "flex"}`}>
							<Calendar
								onChange={(date) => {
									setStartDate(date);
									setIsCalendarOpened(false);
								}}
							>
								<div className="flex size-full items-center justify-center rounded-xl border border-brand-primary">
									<Calendar.Picker />
								</div>
							</Calendar>
						</div>

						<div className="pt-2" />

						<div className="flex gap-2">
							<div className="grow-[2]">
								<Form.Error htmlFor="date" />
							</div>
							<div className="grow">
								<Form.Error htmlFor="time" />
							</div>
						</div>

						<div className="pt-3" />

						<label htmlFor="frequencyType" className="w-full pb-3 text-start text-text-primary">
							반복 설정
						</label>

						<DropDown
							align="CC"
							options={[
								{ text: "한 번", onClick: () => setFrequency(Frequency.ONCE) },
								{ text: "매일", onClick: () => setFrequency(Frequency.DAILY) },
								{ text: "매주", onClick: () => setFrequency(Frequency.WEEKLY) },
								{ text: "매월", onClick: () => setFrequency(Frequency.MONTHLY) },
							]}
							gapY={4}
						>
							<button
								type="button"
								className="flex h-[50px] w-full min-w-[110px] items-center justify-between rounded-xl border border-border-primary bg-todo-primary px-3 text-lg font-medium text-text-default shadow-buttonPrimary"
							>
								{frequency === Frequency.ONCE ? "한 번" : frequency === Frequency.DAILY ? "매일" : frequency === Frequency.WEEKLY ? "매주" : "매월"}
								<Icon.Toggle width={24} height={24} />
							</button>
						</DropDown>

						<div className="pt-2" />

						<Form.Error htmlFor="frequencyType" />

						{/* 주간 반복 설정 */}
						<div>
							{frequency === Frequency.WEEKLY && (
								<div className="flex flex-col gap-2 pb-4">
									<div />

									<label htmlFor="weekDays" className="w-full text-start text-text-primary">
										<span className="text-text-emerald"> * </span> 반복 요일
									</label>
									<div className="flex max-w-full gap-2">
										{[0, 1, 2, 3, 4, 5, 6].map((day) => (
											<button
												key={day}
												type="button"
												className={`flex h-[40px] w-full items-center justify-center rounded-lg border border-border-primary text-text-default hover:bg-brand-primary ${
													weekDays.includes(day) ? "bg-brand-primary text-text-primary" : ""
												}`}
												onClick={() => {
													if (weekDays.includes(day)) {
														setWeekDays(weekDays.filter((d) => d !== day));
													} else {
														setWeekDays([...weekDays, day]);
													}
												}}
											>
												{dayLabels[day]}
											</button>
										))}
									</div>

									{frequency === Frequency.WEEKLY && weekDays.length === 0 && (
										<div className="text-md font-medium text-status-danger">반복 요일을 선택해주세요</div>
									)}
								</div>
							)}

							{/* 월간 반복 일 설정 */}
							{frequency === Frequency.MONTHLY && (
								<div className="flex flex-col gap-2 pb-4">
									<div />

									<label htmlFor="monthDays" className="w-full text-start text-text-primary">
										<span className="text-text-emerald"> * </span> 반복 일
									</label>

									<div className="grid grid-cols-7 grid-rows-5 rounded-xl border border-border-primary p-2">
										{Array.from({ length: new Date(2024, 12, 31).getDate() }, (_, i) => i + 1).map((day) => (
											<button
												key={day}
												type="button"
												className={`flex h-[30px] w-full items-center justify-center rounded-md text-text-default hover:bg-brand-primary ${monthDay === day ? "bg-brand-secondary text-text-primary" : ""}`}
												onClick={() => setMonthDay(day)}
											>
												{day}
											</button>
										))}
									</div>
								</div>
							)}
						</div>

						<div className="pt-3" />

						<label htmlFor="description" className="w-full pb-3 text-start text-text-primary">
							할 일 메모
						</label>

						<Form.TextArea id="description" placeholder="할 일 메모를 입력해주세요." />
						<div className="pt-2" />

						<Form.Error htmlFor="description" />

						<div className="pt-6" />

						<div className="h-12">
							{createTodoMutation.isPending ? (
								<Button type="submit" disabled>
									생성 중...
								</Button>
							) : frequency === Frequency.WEEKLY && weekDays.length === 0 ? (
								<Button disabled>만들기</Button>
							) : (
								<Form.Submit>만들기</Form.Submit>
							)}
						</div>
					</div>
				</Form>
			</div>
		</ModalWrapper>
	);
}
