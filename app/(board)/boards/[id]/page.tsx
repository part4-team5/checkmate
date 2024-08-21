"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import KebabIcon from "@/public/icons/KebabIcon";
import Message from "@/app/_components/Message";
import DropDown from "@/app/_components/Dropdown";
import API from "@/app/_api";
import Icon from "@/app/_icons";
import BoardDetailComments from "@/app/(board)/boards/[id]/_components/BoardDetailComments";

const options = [
	{ text: "수정", onClick: () => alert("수정") },
	{ text: "삭제", onClick: () => alert("삭제") },
];

export default function BoardDetail({ params }: { params: { id: string } }) {
	const articleId = Number(params.id);
	const queryClient = useQueryClient();

	// 게시글 상세보기
	const {
		data: article,
		isLoading: isArticleLoading,
		error: articleError,
	} = useQuery({
		queryKey: ["articles", articleId],
		queryFn: () => API["{teamId}/articles/{articleId}"].GET({ articleId }),
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

	// 좋아요 핸들러
	const handleLike = () => {
		if (article?.isLiked) {
			unlikeMutation.mutate();
		} else {
			likeMutation.mutate();
		}
	};

	const detailMessageData = {
		content: article?.content,
		date: new Date(article?.createdAt ?? "").toLocaleDateString(),
		userProfile: article?.image ?? defaultImage,
		userName: article?.writer.nickname,
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
					<div className="m-[16px_0_48px] flex justify-between">
						<div className="flex items-center">
							<Message.Author />
							<div className="flex items-center text-md text-text-primary before:mx-[15px] before:inline-block before:h-[12px] before:w-[1px] before:bg-background-tertiary">
								<Message.Date />
							</div>
						</div>
						<div className="flex items-center gap-[15px] text-text-disabled">
							<p className="flex items-center gap-[3px]">
								<Image src="/icons/comment.svg" alt="댓글수" width={15} height={15} />
								{article?.commentCount}
							</p>
							<button type="button" onClick={handleLike} className="flex items-center">
								<span className="flex items-center gap-[3px]">
									<Icon.Heart width={15} height={15} color={article?.isLiked ? "#FF0000" : "#64748B"} />
									{article?.likeCount}
								</span>
							</button>
						</div>
					</div>
					<Message.Content />
				</Message>
			</section>
			<BoardDetailComments articleId={articleId} />
		</main>
	);
}
