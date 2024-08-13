import CloseIcon from "@/public/icons/ic_close";
import Icon from "@/app/_icons/index";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import Image from "next/image";
import { useState } from "react";
import disabledAddComment from "@/public/icons/disableAddComment.svg";
import addComment from "@/public/icons/addComment.svg";
import Button from "@/app/_components/Button";
import KebabIcon from "@/public/icons/KebabIcon";
import { calculateTimeDifference, convertIsoToDateAndTime } from "@/app/_utils/IsoToFriendlyDate";
import useAuthStore from "@/app/_store/useAuthStore";
import { useAddCommentMutation, useTodoCheckMutation } from "@/app/(team)/[id]/todo/_components/api/useMutation";
import DateTimeFrequency from "@/app/(team)/[id]/todo/_components/DateTimeFrequency";
import { useGetComments, useGetTodoContent } from "@/app/(team)/[id]/todo/_components/api/useQuery";

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

type User = {
	id: number;
	email: string;
	nickname: string;
	image: string | null;
};

export default function TodoDetail({ todoId, close, groupId, currentTaskId, currentDate, doneAt }: TodoDetailProps) {
	const user = useAuthStore((state) => state.user) as User;
	const [commentText, setCommentText] = useState("");
	const [isCheck, setIsCheck] = useState(!!doneAt);
	const { data: todoContent } = useGetTodoContent(todoId);
	const { data: comments } = useGetComments(todoId);
	const todoPatchMutation = useTodoCheckMutation(groupId, currentTaskId, currentDate);
	const addCommentMutation = useAddCommentMutation(groupId, currentTaskId, todoId, currentDate, user, setCommentText);
	const currentTime = new Date();

	const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCommentText(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (commentText.length === 0) return;
		if (addCommentMutation.isPending) return;
		addCommentMutation.mutate(commentText);
	};

	const handleCheckButtonClick = () => {
		setIsCheck((prev) => !prev);
		todoPatchMutation.mutate({ taskId: todoId, done: !isCheck });
	};

	const { date, time } = convertIsoToDateAndTime(todoContent?.date);

	return (
		<div className="px-6 pb-[38px] pt-6 text-text-primary">
			<button type="button" onClick={close} aria-label="버튼" className="">
				<CloseIcon width={24} height={24} />
			</button>
			{todoContent && (
				<div>
					<div className="mb-[116px] mt-[22px] h-40 tablet:mb-[198px]">
						{isCheck && (
							<div className="mb-[13px] flex items-center gap-[6px]">
								<Icon.TodoCheck width={16} height={16} />
								<div className="text-text-lime">완료</div>
							</div>
						)}
						<div className="flex justify-between">
							<div className={`${isCheck ? "line-through" : ""} text-xl font-bold text-text-primary`}>{todoContent.name}</div>
							<KebabIcon />
						</div>
						<div className="my-4 flex justify-between">
							<div className="flex items-center gap-3">
								<Image src={defaultImage} alt={todoContent.name} width={32} height={32} />
								<div className="text-md font-medium">{todoContent.user?.nickname}</div>
							</div>
							{/**
							 * 어떤 날짜를 사용할지 나중에 수정
							 * */}
							<div className="flex items-center text-md font-normal text-text-secondary">
								{todoContent.recurring.createdAt.split("T")[0].split("-").join(".")}
							</div>
						</div>
						<DateTimeFrequency date={date} time={time} frequency={frequency[todoContent.frequency as FrequencyType]} />
						<div>{todoContent.description}</div>
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

					<div className="desktop:max-h-[699px]scrollbar:w-2 flex max-h-[326px] flex-col gap-4 overflow-y-scroll scrollbar:bg-background-primary scrollbar-thumb:bg-background-tertiary tablet:max-h-[309px]">
						{comments &&
							comments.map((comment) => {
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
													<Image src={defaultImage} alt={todoContent.name} width={32} height={32} />
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
