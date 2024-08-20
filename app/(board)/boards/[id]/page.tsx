"use client";

import { useState, useCallback, useLayoutEffect } from "react";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import KebabIcon from "@/public/icons/KebabIcon";
import Message from "@/app/_components/Message";
import Form from "@/app/_components/Form";
import DropDown from "@/app/_components/Dropdown";
import API from "@/app/_api";
import { calculateTimeDifference } from "@/app/_utils/IsoToFriendlyDate";

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
		queryKey: ["article", articleId],
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
		queryFn: ({ pageParam }) => API["{teamId}/articles/{articleId}/comments"].GET({ articleId, ...pageParam }),
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

	const [viewport, setViewport] = useState<HTMLElement>();

	// 무한 스크롤 감지
	// eslint-disable-next-line consistent-return
	useLayoutEffect(() => {
		if (viewport) {
			const observer = new IntersectionObserver((entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && hasNextPage) {
						fetchNextPage();
						observer.disconnect();
					}
				}
			});
			observer.observe(viewport);

			return () => observer.disconnect();
		}
	}, [viewport, hasNextPage, fetchNextPage]);

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
			queryClient.invalidateQueries({ queryKey: ["article", articleId] });
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
			queryClient.invalidateQueries({ queryKey: ["article", articleId] });
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

	if (isArticleLoading) return <div>Loading...</div>;
	if (articleError) return <div>Error loading article</div>;

	return (
		<main className="mx-auto flex h-full px-[16px] py-[56px] desktop:container tablet:px-[24px] tablet:py-[40px] desktop:px-0">
			<div>
				{/* 게시글 상세정보 */}
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold">{article?.title}</h1>
					{article?.image && <Image src={article.image} alt="Article Image" width={100} height="100" />}
					<p className="text-lg">{article?.content}</p>
					<div className="flex items-center gap-4">
						<button type="button" onClick={handleLike} className="flex items-center gap-2">
							{article?.isLiked ? <span>💔 {article?.likeCount}</span> : <span>❤️ {article?.likeCount}</span>}
						</button>
					</div>
				</div>
			</div>
			<div className="px-6 text-text-primary">
				{/* 댓글 목록 표시 */}
				<div className="flex flex-col gap-4 scrollbar-thumb:bg-background-tertiary">
					{comments?.pages.map((comment, index) => {
						const timeDifference = calculateTimeDifference(comment.createdAt, currentTime);

						const messageData = {
							content: comment.content,
							date: timeDifference,
							userProfile: comment.writer.image || defaultImage,
							userName: comment.writer.nickname,
						};

						return (
							<div key={comment.id} ref={comments.pages.length - 1 === index ? setViewport : undefined}>
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

				{/* 댓글 작성 폼 */}
				<Form onSubmit={handleAddComment}>
					<Form.TextArea id="commentText" init={commentText} placeholder="댓글을 달아주세요" />
					<Form.Submit>등록</Form.Submit>
				</Form>
			</div>
		</main>
	);
}
