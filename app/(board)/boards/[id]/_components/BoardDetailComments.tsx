"use client";

import { useState, useCallback, useLayoutEffect, useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import KebabIcon from "@/public/icons/KebabIcon";
import Message from "@/app/_components/Message";
import DropDown from "@/app/_components/Dropdown";
import API from "@/app/_api";
import Button from "@/app/_components/Button";

type CommentsProps = {
	articleId: number;
};

export default function BoardDetailComments({ articleId }: CommentsProps) {
	const [commentText, setCommentText] = useState("");
	const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
	const [editingCommentText, setEditingCommentText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const queryClient = useQueryClient();

	// 댓글 목록
	const {
		data: comments,
		hasNextPage,
		fetchNextPage,
		isFetching,
	} = useInfiniteQuery({
		queryKey: ["comments", articleId],
		queryFn: ({ pageParam = { cursor: 0, limit: 10 } }) => API["{teamId}/articles/{articleId}/comments"].GET({ articleId, ...pageParam }),
		initialPageParam: { cursor: 0, limit: 10 },
		// eslint-disable-next-line arrow-body-style
		getNextPageParam: (lastPage) => {
			return lastPage.nextCursor ? { cursor: lastPage.nextCursor, limit: 10 } : undefined;
		},
		select: (data) => ({
			pages: data.pages.flatMap((page) => page.list),
			pageParams: data.pageParams,
		}),
	});

	const viewportRef = useRef<HTMLDivElement | null>(null);

	// 무한 스크롤 감지
	// eslint-disable-next-line consistent-return
	useLayoutEffect(() => {
		if (viewportRef.current) {
			const observer = new IntersectionObserver((entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && hasNextPage) {
						fetchNextPage();
						observer.disconnect();
					}
				}
			});
			observer.observe(viewportRef.current);

			return () => observer.disconnect();
		}
	}, [viewportRef, hasNextPage, fetchNextPage]);

	// 댓글 추가
	const addCommentMutation = useMutation({
		mutationFn: async (content: string) => API["{teamId}/articles/{articleId}/comments"].POST({ articleId }, { content }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
			setCommentText("");
			setIsSubmitting(false);
		},
		onError: (error) => {
			alert(`댓글 추가 중 오류 발생: ${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
			setIsSubmitting(false);
		},
	});

	// 댓글 수정
	const updateCommentMutation = useMutation({
		mutationFn: async ({ commentId, content }: { commentId: number; content: string }) =>
			API["{teamId}/comments/{commentId}"].PATCH({ commentId }, { content }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
			setEditingCommentId(null); // 수정 완료 후 수정 모드 종료
		},
		onError: (error) => {
			alert(`댓글 수정 중 오류 발생: ${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	// 댓글 삭제
	const deleteCommentMutation = useMutation({
		mutationFn: async (commentId: number) => API["{teamId}/comments/{commentId}"].DELETE({ commentId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
		},
		onError: (error) => {
			alert(`댓글 삭제 중 오류 발생: ${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	// 댓글 추가 핸들러
	const handleAddComment = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (commentText.length === 0 || isSubmitting) return;
			setIsSubmitting(true);
			addCommentMutation.mutate(commentText);
		},
		[commentText, addCommentMutation],
	);

	// 댓글 수정 핸들러
	const handleUpdateComment = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (editingCommentText.length === 0 || editingCommentId === null) return;
			updateCommentMutation.mutate({ commentId: editingCommentId, content: editingCommentText });
		},
		[editingCommentText, editingCommentId, updateCommentMutation],
	);

	// 댓글 삭제 핸들러
	const handleDeleteComment = useCallback(
		(commentId: number) => {
			if (window.confirm("댓글을 삭제하시겠습니까?")) {
				deleteCommentMutation.mutate(commentId);
			}
		},
		[deleteCommentMutation],
	);

	// 댓글 수정 모드 진입
	const enterEditMode = (commentId: number, currentContent: string) => {
		setEditingCommentId(commentId);
		setEditingCommentText(currentContent);
	};

	// 댓글 수정 취소
	const handleCancelEdit = () => {
		setEditingCommentId(null);
		setEditingCommentText("");
	};

	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCommentText(e.target.value);
	};

	const handleEditCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditingCommentText(e.target.value);
	};

	return (
		<section className="mt-[80px]">
			{/* 댓글 작성 폼 */}
			<div>
				<div className="mb-[24px] text-xl font-bold">댓글달기</div>
				<form onSubmit={handleAddComment}>
					<div className="w-full">
						<textarea
							id="commentText"
							onChange={handleCommentChange}
							className="h-[100px] w-full resize-none overflow-auto rounded-[12px] border border-border-primary bg-background-secondary px-[24px] py-[16px] text-lg text-text-primary placeholder:text-text-default focus:outline-none"
							value={commentText}
							placeholder="댓글을 입력해주세요"
						/>
					</div>
					<div className="mt-[16px] flex justify-end">
						<div className="h-[48px] w-[185px]">
							<Button type="submit" disabled={isSubmitting || addCommentMutation.isPending}>
								{isSubmitting || addCommentMutation.isPending ? "등록중..." : "등록"}
							</Button>
						</div>
					</div>
				</form>
			</div>
			{/* 댓글 목록 표시 */}
			<div className="my-[40px] flex flex-col gap-4 border-t border-solid border-t-[rgba(248,250,252,0.1)] pt-[40px]">
				{comments?.pages.map((comment, index) => {
					const messageData = {
						content: comment.content,
						date: new Date(comment.createdAt).toLocaleDateString(),
						userProfile: comment.writer?.image || defaultImage,
						userName: comment.writer?.nickname,
					};

					return (
						<div
							key={comment.id}
							ref={comments.pages.length - 1 === index ? viewportRef : null}
							className="rounded-[12px] bg-background-secondary px-[24px] py-[16px]"
						>
							{editingCommentId === comment.id ? (
								<div className="flex flex-col gap-4">
									<form onSubmit={handleUpdateComment}>
										<textarea
											id={`editComment-${comment.id}`}
											onChange={handleEditCommentChange}
											onKeyDown={(e) => {
												if (e.key === "Enter" && !e.shiftKey) {
													e.preventDefault();
												}
											}}
											className="h-[100px] w-full resize-none overflow-auto rounded-[12px] border border-border-primary bg-background-secondary px-[24px] py-[16px] text-lg text-text-primary placeholder:text-text-default focus:outline-none"
											value={editingCommentText}
										/>
										<div className="mt-[16px] flex justify-end">
											<div className="flex h-[40px] w-[200px] gap-3">
												{updateCommentMutation.isPending || (
													<Button type="button" onClick={handleCancelEdit} variant="secondary" fontSize="md">
														취소
													</Button>
												)}
												<Button type="submit" disabled={updateCommentMutation.isPending} fontSize="md">
													{updateCommentMutation.isPending ? "수정중..." : "수정 완료"}
												</Button>
											</div>
										</div>
									</form>
								</div>
							) : (
								<div className="flex items-start justify-between">
									<div className="flex flex-col gap-[32px]">
										<Message data={messageData}>
											<Message.Content />
											<div className="flex items-center">
												<Message.Author />
												<div className="flex items-center text-md text-text-primary before:mx-[15px] before:inline-block before:h-[12px] before:w-[1px] before:bg-background-tertiary">
													<Message.Date />
												</div>
											</div>
										</Message>
									</div>
									<DropDown
										options={[
											{ text: "수정", onClick: () => enterEditMode(comment.id, comment.content) },
											{ text: "삭제", onClick: () => handleDeleteComment(comment.id) },
										]}
									>
										<button type="button" aria-label="dropdown">
											<KebabIcon />
										</button>
									</DropDown>
								</div>
							)}
						</div>
					);
				})}
				{hasNextPage && isFetching && <div>Loading more comments...</div>}
			</div>
		</section>
	);
}