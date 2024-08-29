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
import { useState, ChangeEvent } from "react";
import Button from "@/app/_components/Button";
import Quill from "@/app/_components/Quill";
import { useRouter } from "next/navigation";
import useAuthStore from "@/app/_store/useAuthStore";
import toast from "@/app/_utils/Toast";
import CommentIcon from "@/public/icons/ic_comment";

export default function BoardDetail({ params }: { params: { id: string } }) {
	const articleId = Number(params.id);
	const router = useRouter();
	const queryClient = useQueryClient();
	const { user } = useAuthStore();
	const [isEditing, setIsEditing] = useState(false);
	const [editArticleData, setEditArticleData] = useState({ title: "", content: "", image: "" });
	const [isAnimating, setIsAnimating] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	// 이미지 업로드
	const imageUpload = async (file: File) => {
		if (typeof file === "string") return { url: undefined };

		return API["{teamId}/images/upload"].POST({}, file);
	};

	// 게시글 상세보기
	const {
		data: article,
		isLoading: isArticleLoading,
		error: articleError,
	} = useQuery({
		queryKey: ["articles", articleId],
		queryFn: () => API["{teamId}/articles/{articleId}"].GET({ articleId }),
	});

	// 게시글 수정
	const editArticleMutation = useMutation({
		mutationFn: (updatedArticle: { title: string; content: string; image: string }) =>
			API["{teamId}/articles/{articleId}"].PATCH({ articleId }, updatedArticle),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["articles", articleId] });
			setIsEditing(false);
		},
		onError: (error) => {
			toast.error(`게시글 수정 중 오류 발생: ${error.message}`);
		},
	});

	// 게시글 삭제
	const deleteArticleMutation = useMutation({
		mutationFn: () => API["{teamId}/articles/{articleId}"].DELETE({ articleId }),
		onSuccess: () => {
			toast.success("게시글이 삭제되었습니다.");
			router.replace("/boards");
		},
		onError: (error) => {
			toast.error(`게시글 삭제 중 오류 발생: ${error.message}`);
		},
	});

	// 삭제 버튼 클릭 핸들러
	const handleDeleteClick = () => {
		if (window.confirm("정말 삭제하시겠습니까?")) {
			deleteArticleMutation.mutate();
		}
	};

	// 이미지 파일 선택 핸들러
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditArticleData((prev) => ({ ...prev, image: reader.result as string }));
			};
			reader.readAsDataURL(file);
		} else {
			// 이미지 선택이 취소되었을 때
			setSelectedImage(null);
			setEditArticleData((prev) => ({ ...prev, image: "" }));
		}
	};

	// 수정 버튼 클릭 핸들러
	const handleEditClick = () => {
		setEditArticleData({
			title: article?.title ?? "",
			content: article?.content ?? "",
			image: article?.image ?? "",
		});
		setIsEditing(true);
	};

	// 취소 버튼 클릭 핸들러
	const handleCancelClick = () => {
		setIsEditing(false);
		setEditArticleData({
			title: article?.title ?? "",
			content: article?.content ?? "",
			image: article?.image ?? "",
		});
		setSelectedImage(null);
	};

	// 저장 버튼 클릭 핸들러
	const handleSaveClick = async () => {
		let imageUrl: string | null = article?.image ?? null;

		if (selectedImage) {
			const response = await imageUpload(selectedImage);
			imageUrl = response.url ?? null;
		}

		const updatedArticle = {
			title: editArticleData.title ?? article?.title ?? "",
			content: editArticleData.content ?? article?.content ?? "",
			image: imageUrl,
		};

		editArticleMutation.mutate(updatedArticle as { title: string; content: string; image: string });
	};

	// 좋아요 추가
	const likeMutation = useMutation<void, Error>({
		mutationFn: () => API["{teamId}/articles/{articleId}/like"].POST({ articleId }).then(() => {}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["articles", articleId] });
			setIsAnimating(true);
			setTimeout(() => setIsAnimating(false), 200);
		},
		onError: (error) => {
			toast.error(`${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	// 좋아요 삭제
	const unlikeMutation = useMutation<void, Error>({
		mutationFn: () => API["{teamId}/articles/{articleId}/like"].DELETE({ articleId }).then(() => {}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["articles", articleId] });
			setIsAnimating(true);
			setTimeout(() => setIsAnimating(false), 200);
		},
		onError: (error) => {
			toast.error(`${error.message ?? "알 수 없는 오류 발생"}`);
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
		userProfile: defaultImage,
		userName: article?.writer.nickname,
	};

	if (articleError) {
		console.error("Article Fetch Error:", articleError);
		return <div>Error loading article</div>;
	}

	return (
		<main className="mx-auto h-full px-[16px] py-[56px] text-text-primary desktop:container tablet:px-[24px] tablet:py-[40px] desktop:px-0">
			<div className="rounded-xl bg-background-secondary shadow-postboard">
				{isArticleLoading ? (
					<div className="p-[20px_30px]">
						<div className="h-[16px] w-[70%] animate-pulse rounded-md bg-background-quaternary" />
						<div className="my-4 h-[24px] w-[30%] animate-pulse rounded-md bg-background-quaternary" />
						<div className="h-[200px] w-full animate-pulse rounded-md bg-background-quaternary" />
					</div>
				) : (
					<section className="mb-8">
						{isEditing ? (
							<div className="mx-[30px] border-b border-solid border-border-primary py-[20px]">
								<input
									className="h-[48px] w-full rounded-[12px] border border-border-primary bg-background-secondary px-[24px] text-lg text-text-primary focus:outline-none"
									value={editArticleData.title}
									onChange={(e) => setEditArticleData({ ...editArticleData, title: e.target.value })}
									type="text"
								/>
							</div>
						) : (
							<>
								{article?.image && (
									<div
										style={{ backgroundImage: `url("${article?.image}")` }}
										className="h-[200px] w-full rounded-t-xl bg-background-tertiary bg-cover bg-center"
									/>
								)}
								<div className="mx-[30px] flex items-center justify-between border-b border-solid border-border-primary py-[20px]">
									<h2 className="text-[18px] font-medium text-landing-inverse">{article?.title}</h2>
									<div>
										{article?.writer.id === user?.id && (
											<DropDown
												options={[
													{ text: "수정", onClick: handleEditClick },
													{ text: "삭제", onClick: handleDeleteClick },
												]}
											>
												<button type="button" aria-label="dropdown">
													<KebabIcon />
												</button>
											</DropDown>
										)}
									</div>
								</div>
							</>
						)}
						<div className="px-[30px]">
							<Message data={detailMessageData}>
								<div className="m-[16px_0_48px] flex justify-between">
									<div className="flex items-center">
										<Message.Author />
										<div className="flex items-center text-md text-text-primary before:mx-[15px] before:inline-block before:h-[12px] before:w-[1px] before:bg-border-primary">
											<Message.Date />
										</div>
									</div>
									<div className="flex items-center gap-[15px] text-md text-landing-inverse">
										<p className="flex items-center gap-[7px]">
											<CommentIcon width={15} height={15} color="var(--landing-inverse)" />
											{article?.commentCount}
										</p>
										<button type="button" onClick={handleLike} className="flex items-center">
											<span className="flex items-center gap-[7px]">
												<span className={`transition-transform ${isAnimating ? "animate-scaleUp" : ""}`}>
													{article?.isLiked ? (
														<Icon.HeartFull width={15} height={15} color="#FF0000" />
													) : (
														<Icon.Heart width={15} height={15} color="var(--landing-inverse)" />
													)}
												</span>
												{article?.likeCount}
											</span>
										</button>
									</div>
								</div>
								{isEditing ? (
									<>
										<Quill init={editArticleData.content} onChange={(data) => setEditArticleData({ ...editArticleData, content: data })} />
										<input type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
										{editArticleData.image && (
											<Image src={editArticleData.image} alt="Selected Image" width={100} height={100} objectFit="contain" className="mt-4" />
										)}
									</>
								) : (
									<Message.Content />
								)}
							</Message>
							{isEditing && (
								<div className="mt-4 flex justify-end">
									<div className="flex h-[48px] w-[300px] gap-3">
										{editArticleMutation.isPending || (
											<Button type="button" onClick={handleCancelClick} variant="secondary" fontSize="md">
												취소
											</Button>
										)}
										<Button type="button" onClick={handleSaveClick} disabled={editArticleMutation.isPending} fontSize="md">
											{editArticleMutation.isPending ? "수정중..." : "수정 완료"}
										</Button>
									</div>
								</div>
							)}
						</div>
					</section>
				)}
				<div className="p-[0_30px_30px]">
					<BoardDetailComments articleId={articleId} />
				</div>
			</div>
		</main>
	);
}
