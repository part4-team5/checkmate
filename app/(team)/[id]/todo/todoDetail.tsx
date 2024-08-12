import API from "@/app/_api";
import CloseIcon from "@/public/icons/ic_close";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Icon from "@/app/_icons/index";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import Image from "next/image";
import { useState } from "react";
import disabledAddComment from "@/public/icons/disableAddComment.svg";
import addComment from "@/public/icons/addComment.svg";
import Button from "@/app/_components/Button";
import KebabIcon from "@/public/icons/KebabIcon";
import tasksKey from "@/app/(team)/[id]/todo/queryFactory";
import useTodoCheckMutation from "@/app/(team)/[id]/todo/useMutation";
import { convertIsoToDateAndTime } from "@/app/_utils/IsoToFriendlyDate";

type TodoDetailProps = {
	todoId: number;
	groupId: number;
	currentTaskId: number;
	doneAt: string;
	currentDate: Date;
	close: () => void;
};

type FrequencyType = "DAILY" | "WEEKLY" | "MONTHLY" | "ONCE";
const frequency: Record<FrequencyType, string> = {
	DAILY: "매일 반복",
	WEEKLY: "매주 반복",
	MONTHLY: "매월 반복",
	ONCE: "반복 없음",
};

export default function TodoDetail({ todoId, close, groupId, currentTaskId, currentDate, doneAt }: TodoDetailProps) {
	const [commentText, setCommentText] = useState("");
	const [isCheck, setIsCheck] = useState(!!doneAt);
	const queryClient = useQueryClient();
	const currentTime = new Date();
	const todoPatchMutation = useTodoCheckMutation(groupId, currentTaskId, currentDate);

	const { data } = useQuery({
		queryKey: ["tasks", { taskId: todoId }],
		queryFn: async () => {
			const response = API["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"].GET({
				taskId: todoId,
			});
			return response;
		},
	});

	const calculateTimeDifference = (startDateString: string, endDate: Date) => {
		// startDateString 문자열을 Date 객체로 변환하고 밀리초로 변환
		const startDateInMs = new Date(startDateString).getTime();
		// endDate를 밀리초로 변환
		const endDateInMs = endDate.getTime();

		// 두 시간의 차이를 절대값으로 계산
		const timeDifferenceInMs = Math.abs(endDateInMs - startDateInMs);

		// 시간 단위 계산을 위한 상수 정의
		const msInAMinute = 60 * 1000;
		const msInAnHour = 60 * msInAMinute;
		const msInADay = 24 * msInAnHour;
		const msInAYear = 365 * msInADay;

		// 차이를 년, 일, 시간, 분으로 계산
		const years = Math.floor(timeDifferenceInMs / msInAYear);
		const days = Math.floor((timeDifferenceInMs % msInAYear) / msInADay);
		const hours = Math.floor((timeDifferenceInMs % msInADay) / msInAnHour);
		const minutes = Math.floor((timeDifferenceInMs % msInAnHour) / msInAMinute);

		// 결과 반환
		if (years > 0) {
			return `${years}년 전`;
		}
		if (days > 0) {
			return `${days}일 전`;
		}
		if (hours > 0) {
			return `${hours}시간 전`;
		}
		return `${minutes}분 전`;
	};

	const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentText(e.target.value);
	};

	const useAddCommentMutation = () =>
		useMutation({
			mutationFn: async (newComment: string) => {
				const body = { content: newComment };
				// API 호출
				const response = await API["{teamId}/tasks/{taskId}/comments"].POST(
					{
						taskId: todoId,
					},
					body,
				);
				return response;
			},
			onSuccess: () => {
				// 요청 성공 시 수행할 작업
				queryClient.invalidateQueries({
					queryKey: tasksKey.detail(groupId, currentTaskId, currentDate.toLocaleDateString("ko-KR")),
				});
				queryClient.invalidateQueries({
					queryKey: ["tasks", { taskId: todoId }],
				});
				setCommentText(""); // 입력 필드를 초기화
			},
			onError: () => {
				// 요청 실패 시 수행할 작업
				alert("댓글 작성에 실패했습니다.");
			},
		});

	const addCommentMutation = useAddCommentMutation();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (commentText.length === 0) return;
		addCommentMutation.mutate(commentText);
	};

	const handleCheckButtonClick = () => {
		setIsCheck((prev) => !prev);
		todoPatchMutation.mutate({ taskId: todoId, done: !isCheck });
	};

	const { date, time } = convertIsoToDateAndTime(data?.date);

	return (
		<div className="px-6 pb-[38px] pt-6">
			<button type="button" onClick={close} aria-label="버튼" className="">
				<CloseIcon width={24} height={24} />
			</button>
			{data && (
				<div>
					<div className="mb-[116px] mt-[22px] h-40 tablet:mb-[198px]">
						{isCheck && (
							<div className="mb-[13px] flex items-center gap-[6px]">
								<Icon.TodoCheck width={16} height={16} />
								<div className="text-text-lime">완료</div>
							</div>
						)}
						<div className="flex justify-between">
							<div className={`${isCheck ? "line-through" : ""} text-xl font-bold text-text-primary`}>{data.name}</div>
							<KebabIcon />
						</div>
						<div className="my-4 flex justify-between">
							<div className="flex items-center gap-3">
								<Image src={defaultImage} alt={data.name} width={32} height={32} />
								<div className="text-md font-medium">{data.user?.nickname}</div>
							</div>
							{/**
							 * 어떤 날짜를 사용할지 나중에 수정
							 * */}
							<div className="flex items-center text-md font-normal text-text-secondary">{data.recurring.createdAt.split("T")[0].split("-").join(".")}</div>
						</div>
						<div className="mb-6 flex items-center text-xs font-normal text-text-default">
							<div className="flex gap-[6px]">
								<Image src="/icons/calendar.svg" alt="calendar" width={16} height={16} />
								<div>{date}</div>
							</div>
							<div className="flex items-center gap-[6px] px-[10px]">
								<div className="h-2 border-l" />
								<Image src="/icons/clock.svg" alt="time" width={16} height={16} />
								<div>{time}</div>
								<div className="h-2 border-r" />
								<Image src="/icons/clock.svg" alt="time" width={16} height={16} />
							</div>
							<div className="flex items-center gap-[6px]">
								<Image src="/icons/cycles.svg" alt="frequency" width={16} height={16} />
								{frequency[data.recurring.frequencyType]}
							</div>
						</div>
						<div>{data.description}</div>
					</div>

					<form className="mb-6" onSubmit={handleSubmit}>
						<label htmlFor="add-comment" className="sr-only">
							댓글 입력
						</label>
						<hr className="border-icon-primary" />
						<div className="flex">
							<input
								onChange={handleCommentChange}
								className="h-[50px] w-full bg-background-secondary focus:outline-none"
								id="add-comment"
								type="text"
								value={commentText}
								placeholder="댓글을 달아주세요"
							/>
							{addCommentMutation.isPending && <div>로딩중...</div>}
							{!addCommentMutation.isPending && (
								<button type="submit">
									{commentText.length > 0 ? (
										<Image src={addComment} alt="add-comment" width={24} height={24} />
									) : (
										<Image src={disabledAddComment} alt="add-comment" width={24} height={24} />
									)}
								</button>
							)}
						</div>
						<hr className="border-icon-primary" />
					</form>

					<div className="desktop:max-h-[699px]scrollbar:w-2 scrollbar:bg-background-primary scrollbar-thumb:bg-background-tertiary flex max-h-[326px] flex-col gap-4 overflow-y-scroll tablet:max-h-[309px]">
						{data.comments.map((comment) => {
							const timeDifference = calculateTimeDifference(comment.createdAt, currentTime);
							return (
								<div key={comment.id}>
									<div className="flex justify-between">
										<div className="text-md font-normal">{comment.content}</div>
										<button type="button" aria-label="dropdown">
											<KebabIcon />
										</button>
									</div>
									<div className="my-4 flex items-center justify-between">
										{comment.user && (
											<div className="flex items-center gap-3">
												<Image src={defaultImage} alt={data.name} width={32} height={32} />
												<div>{comment.user.nickname}</div>
											</div>
										)}
										<div className="text-text-secondary">{timeDifference}</div>
									</div>
									<hr className="border-icon-primary" />
								</div>
							);
						})}
					</div>
				</div>
			)}
			<div>
				<div className="fixed bottom-10 right-10">
					<div className="h-[48px] w-[125px]">
						{isCheck ? (
							<Button variant="secondary" rounded="full" onClick={handleCheckButtonClick}>
								<div className="flex items-center gap-1">
									<Icon.CheckButton width={16} height={16} color="#10b981" />
									<div className="text-xs font-semibold text-text-emerald">완료 취소하기</div>
								</div>
							</Button>
						) : (
							<Button rounded="full" onClick={handleCheckButtonClick}>
								<div className="flex items-center gap-1">
									<Icon.CheckButton width={16} height={16} />
									<div className="text-xs font-semibold">완료하기</div>
								</div>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
