"use client";

import { useState, useCallback, useLayoutEffect, useRef } from "react";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import KebabIcon from "@/public/icons/KebabIcon";
import Message from "@/app/_components/Message";
// import Form from "@/app/_components/Form";
import DropDown from "@/app/_components/Dropdown";
import API from "@/app/_api";
import { calculateTimeDifference } from "@/app/_utils/IsoToFriendlyDate";
import Icon from "@/app/_icons";

const options = [
	{ text: "수정", onClick: () => alert("수정") },
	{ text: "삭제", onClick: () => alert("삭제") },
];

export default function BoardDetail({ params }: { params: { id: string } }) {
	const articleId = Number(params.id);
	const [commentText, setCommentText] = useState("");
	const queryClient = useQueryClient();
	const currentTime = new Date();

	// 게시글 상세보기
	const {
		data: article,
		isLoading: isArticleLoading,
		error: articleError,
	} = useQuery({
		queryKey: ["articles", articleId],
		queryFn: () => API["{teamId}/articles/{articleId}"].GET({ articleId }),
	});

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
		},
		onError: (error) => {
			alert(`댓글 추가 중 오류 발생: ${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	// 좋아요 추가
	const likeMutation = useMutation<void, Error>({
		mutationFn: () => API["{teamId}/articles/{articleId}/like"].POST({ articleId }).then(() => {}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["articles", articleId] });
		},
		onError: (error) => {
			alert(`좋아요 추가 중 오류 발생: ${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	// 좋아요 삭제
	const unlikeMutation = useMutation<void, Error>({
		mutationFn: () => API["{teamId}/articles/{articleId}/like"].DELETE({ articleId }).then(() => {}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["articles", articleId] });
		},
		onError: (error) => {
			alert(`좋아요 삭제 중 오류 발생: ${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	// 댓글 추가 핸들러
	const handleAddComment = useCallback(() => {
		if (commentText.length === 0) return;
		addCommentMutation.mutate(commentText);
	}, [commentText, addCommentMutation]);

	// 좋아요 핸들러
	const handleLike = () => {
		if (article?.isLiked) {
			unlikeMutation.mutate();
		} else {
			likeMutation.mutate();
		}
	};

	const detailTimeDifference = calculateTimeDifference(article?.createdAt || "", currentTime);
	const detailMessageData = {
		content: article?.content,
		date: detailTimeDifference,
		userProfile: article?.image || defaultImage,
		userName: article?.writer.nickname,
	};

	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setCommentText(e.target.value);
	};

	if (isArticleLoading) return <div>Loading...</div>;
	if (articleError) return <div>Error loading article</div>;

	return (
		<main className="mx-auto h-full px-[16px] py-[56px] text-text-primary desktop:container tablet:px-[24px] tablet:py-[40px] desktop:px-0">
			{/* 게시글 상세정보 */}
			<section className="mb-8">
				<div className="flex items-center justify-between border-b border-solid border-b-[rgba(248,250,252,0.1)] py-[20px]">
					<h2 className="text-[18px] font-medium text-text-secondary">{article?.title}</h2>
					<div>
						<DropDown options={options}>
							<button type="button" aria-label="dropdown">
								<KebabIcon />
							</button>
						</DropDown>
					</div>
				</div>
				<Message data={detailMessageData}>
					<div className="flex justify-between">
						<div className="flex">
							<Message.Author />
							<Message.Date />
						</div>
						<div className="flex items-center gap-[15px]">
							<p>
								<Image src="/icons/comment.svg" alt="댓글수" width={15} height={15} />
								{article?.commentCount}
							</p>
							<button type="button" onClick={handleLike} className="flex items-center">
								<span>
									<Icon.Heart width={15} height={15} color={article?.isLiked ? "#FF0000" : "#64748B"} />
									{article?.likeCount}
								</span>
							</button>
						</div>
					</div>
					<Message.Content />
					{/* {article?.image && (
						<div className="relative max-w-full">
							<Image src={article.image} alt="Article Image" fill />
						</div>
					)} */}
				</Message>
			</section>
			<section className="mt-[80px]">
				{/* 댓글 작성 폼 */}
				<div>
					<div className="mb-[24px] text-xl font-bold">댓글달기</div>
					<form onSubmit={handleAddComment}>
						<div className="w-full">
							<textarea
								name=""
								id="commentText"
								onChange={handleCommentChange}
								className="h-[50px] w-full bg-background-secondary focus:outline-none"
								value={commentText}
								placeholder="댓글을 입력해주세요"
							/>
						</div>
						<button type="submit">등록</button>
					</form>
				</div>
				{/* 댓글 목록 표시 */}
				<div className="flex flex-col gap-4 scrollbar-thumb:bg-background-tertiary">
					{comments?.pages.map((comment, index) => {
						const timeDifference = calculateTimeDifference(comment.createdAt, currentTime);

						const messageData = {
							content: comment.content,
							date: timeDifference,
							userProfile: comment.writer?.image || defaultImage,
							userName: comment.writer?.nickname,
						};

						return (
							<div key={comment.id} ref={comments.pages.length - 1 === index ? viewportRef : null}>
								<Message data={messageData}>
									<Message.Content />
									<div className="flex justify-between">
										<Message.Author />
										<Message.Date />
									</div>
								</Message>
								<DropDown options={options}>
									<button type="button" aria-label="dropdown">
										<KebabIcon />
									</button>
								</DropDown>
							</div>
						);
					})}
					{hasNextPage && isFetching && <div>Loading more comments...</div>}
				</div>
			</section>
		</main>
	);
}
