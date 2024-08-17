/* eslint-disable no-nested-ternary */
import Button from "@/app/_components/Button";
import Calendar from "@/app/_components/Calendar";
import { convertTo12HourFormat, convertTo24HourFormat } from "@/app/_utils/ConvertTimeFormat";
import DropDown from "@/app/_components/Dropdown";
import Form from "@/app/_components/Form";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import TimePicker from "@/app/_components/TimePicker";
import Icon from "@/app/_icons";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useCreateTodoMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";

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
	const [isOpenedCalendar, setIsOpenedCalendar] = useState(false);
	const [startTime, setStartTime] = useState<string>();
	const [isOpenedTime, setIsOpenedTime] = useState(false);

	const startYear = startDate.getFullYear();
	const startMonth = `0${startDate.getMonth() + 1}`.slice(-2); // 월은 0부터 시작하므로 +1 필요
	const startDay = `0${startDate.getDate()}`.slice(-2);

	const formattedDate = `${startYear}-${startMonth}-${startDay}`;
	const formattedTime = `${startTime ? `T${startTime}:00` : "00:00:00"}Z`;

	const groupId = Number(useParams().id);
	const taskListId = Number(useSearchParams().get("taskId"));
	const createTodoMutation = useCreateTodoMutation(groupId, taskListId, startDate, formattedDate + formattedTime, frequency, weekDays, monthDay);

	const handleCreateTodo = async (ctx: FormContext) => {
		createTodoMutation.mutate({ name: ctx.values.name as string, description: ctx.values.description as string });
	};

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
						close();
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
							tests={[{ type: "require", data: true, error: "할 일 제목은 필수입니다" }]}
						/>

						<div className="pt-2" />

						<Form.Error htmlFor="name" />

						<div className="pt-3" />

						<label htmlFor="date" className="w-full pb-3 text-start text-text-primary">
							<span className="text-text-emerald"> * </span> 시작 날짜 및 시간
						</label>

						<div className="flex gap-2">
							<div className="w-[150px] grow">
								{/* <Form.Input id="date" type="date" tests={[{ type: "require", data: true, error: "시작 날짜는 필수입니다" }]} /> */}
								<button
									type="button"
									className="flex h-[50px] w-full items-center justify-between rounded-xl border border-border-primary px-3 text-lg font-medium text-text-default"
									onClick={() => {
										setIsOpenedCalendar((prev) => !prev);
										setIsOpenedTime(false);
									}}
								>
									{startDate.toLocaleDateString("ko-KR")}
								</button>
							</div>
							<div className="grow">
								{/* <Form.Input id="time" type="time" /> */}
								<button
									type="button"
									className="flex h-[50px] w-full items-center justify-between rounded-xl border border-border-primary px-3 text-lg font-medium text-text-default"
									onClick={() => {
										setIsOpenedTime((prev) => !prev);
										setIsOpenedCalendar(false);
									}}
								>
									{convertTo12HourFormat(startTime || "00:00")}
								</button>
							</div>
						</div>

						<div className={`size-full pt-2 ${!isOpenedCalendar ? "hidden" : "flex"}`}>
							<Calendar
								onChange={(date) => {
									setStartDate(date);
									// TODO: 날짜 선택 후 닫히도록 수정
									// setIsOpenedCalendar(false);
								}}
							>
								<div className="flex size-full items-center justify-center rounded-xl border border-border-primary shadow-lg">
									<Calendar.Picker />
								</div>
							</Calendar>
						</div>

						<div className={`pt-2 ${!isOpenedTime ? "hidden" : "flex"}`}>
							<TimePicker
								onChange={(time, isAm) => {
									setStartTime(convertTo24HourFormat(time, isAm));
									// TODO: 시간 선택 후 닫히도록 수정
									// setIsOpenedTime(false);
								}}
							/>
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
								className="flex h-[50px] w-full min-w-[110px] items-center justify-between rounded-xl border border-border-primary px-3 text-lg font-medium text-text-default"
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
												className={`flex h-[40px] w-full items-center justify-center rounded-lg border border-border-primary text-text-default ${
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
												{day === 0 ? "일" : day === 1 ? "월" : day === 2 ? "화" : day === 3 ? "수" : day === 4 ? "목" : day === 5 ? "금" : "토"}
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

									<div className="grid grid-cols-7 grid-rows-5 gap-1 rounded-xl border border-border-primary p-2">
										{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day) => (
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
							{frequency === Frequency.WEEKLY && weekDays.length === 0 ? <Button disabled>만들기</Button> : <Form.Submit>만들기</Form.Submit>}
						</div>
					</div>
				</Form>
			</div>
		</ModalWrapper>
	);
}
