"use client";

import API from "@/app/_api";

import { useLayoutEffect, useRef, useState } from "react";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Icon from "@/app/_icons";
import Image from "next/image";
import useBreakPoint from "@/app/_hooks/useBreakPoint";
import Link from "next/link";
import DropDown from "@/app/_components/Dropdown";

export default function Page() {
	const { isMobile, isTablet } = useBreakPoint();

	const { data: favorite } = useQuery({ queryKey: ["favorite"], queryFn: () => API["{teamId}/articles"].GET({ orderBy: "like" }) });

	const [keyword, setKeyword] = useState<Parameters<(typeof API)["{teamId}/articles"]["GET"]>[0]["keyword"]>("");
	const [orderBy, setOrderBy] = useState<Parameters<(typeof API)["{teamId}/articles"]["GET"]>[0]["orderBy"]>("recent");

	const {
		data: articles,
		isFetching,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: ["articles", keyword, orderBy],
		queryFn: ({ pageParam }) => API["{teamId}/articles"].GET(pageParam),

		initialPageParam: { page: 1, keyword, orderBy, pageSize: 10 },
		// eslint-disable-next-line consistent-return
		getNextPageParam(lastPage, allPages, lastPageParams) {
			if (allPages.flatMap((_) => _.list).length < lastPage.totalCount) return { ...lastPageParams, page: lastPageParams.page + 1 };
		},
		select: (data) => ({
			pages: data.pages.flatMap((_) => _.list),
			totalCount: data.pages.at(-1)?.totalCount ?? 0,
		}),
	});

	const [viewport, setViewport] = useState<HTMLElement>();

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

	const timeout = useRef<NodeJS.Timeout>();

	return (
		<main className="h-full">
			<Link
				href="/create-post"
				className="fixed bottom-[45px] right-[16px] flex h-[48px] w-[104px] items-center justify-center rounded-[40px] bg-brand-primary text-text-primary tablet:right-[24px] desktop:right-[calc((100%-1200px)/2)]"
			>
				+ 글쓰기
			</Link>
			<div className="mx-auto flex flex-col gap-[24px] px-[16px] py-[32px] desktop:container tablet:px-[24px] tablet:py-[40px] desktop:px-0">
				<div className="flex flex-col gap-[24px] text-2lg font-bold text-text-primary">
					자유게시판
					<div className="flex h-[56px] w-full items-center gap-[8px] rounded-[12px] border border-border-primary bg-background-secondary px-[16px] has-[input:focus]:border-brand-primary">
						<Icon.Search width={24} height={24} color="#64748B" />
						<input
							placeholder="검색어를 입력해주세요"
							className="grow bg-transparent outline-none"
							onChange={(event) => {
								// @ts-ignore debounce
								timeout.current = clearTimeout(timeout.current) ?? setTimeout(() => setKeyword(event.target.value), 250);
							}}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-[24px] text-2lg font-bold text-text-primary">
					인기글
					<div className="grid grid-cols-1 gap-[16px] tablet:grid-cols-2 desktop:grid-cols-3 desktop:gap-[20px]">
						{/* eslint-disable-next-line no-nested-ternary */}
						{favorite?.list.slice(0, isMobile ? 1 : isTablet ? 2 : 3).map((article) => (
							<Link
								key={article.id}
								href={`/boards/${article.id}`}
								className="flex h-[220px] flex-col rounded-[12px] border border-border-primary bg-background-secondary px-[16px] py-[16px]"
							>
								<div className="flex gap-[4px] text-md font-semibold text-text-primary">
									<Image src="/images/medal.webp" alt="icon" width={16} height={16} />
									Best
								</div>
								<div className="mt-[14px] text-md font-medium text-text-secondary">{article.title}</div>
								<div className="mt-[12px] grow text-md font-medium text-text-default">{new Date(article.createdAt).toLocaleDateString()}</div>
								<div className="mt-[14px] flex items-center justify-between">
									<div className="flex items-center gap-[12px]">
										<Image src="/images/profile.png" alt="avatar" width={32} height={32} />
										<div className="text-md font-medium text-text-primary">{article.writer.nickname}</div>
									</div>
									<div className="flex items-center gap-[4px]">
										<Icon.Heart width={16} height={16} color={article.isLiked ? "#EF4444" : "#64748B"} />
										<div className="text-md font-normal text-text-default">{article.likeCount}</div>
									</div>
								</div>
							</Link>
						)) ??
							// eslint-disable-next-line no-nested-ternary
							new Array(isMobile ? 1 : isTablet ? 2 : 3).fill(null).map((_, index) => (
								<div
									// eslint-disable-next-line react/no-array-index-key
									key={index}
									className="flex h-[220px] flex-col gap-[12px] rounded-[12px] border border-border-primary bg-background-secondary/75 px-[16px] py-[16px]"
								>
									<div className="h-[16px] w-6/12 animate-pulse rounded-md bg-border-primary/25" />
									<div className="h-[16px] w-5/12 animate-pulse rounded-md bg-border-primary/25" />
									<div className="h-[16px] w-3/12 animate-pulse rounded-md bg-border-primary/25" />
									<div className="h-[16px] w-6/12 animate-pulse rounded-md bg-border-primary/25" />
								</div>
							))}
					</div>
				</div>
				<hr className="my-[40px] border-border-primary" />
				<div className="flex flex-col gap-[24px] text-2lg font-bold text-text-primary">
					<div className="flex items-center justify-between">
						게시글
						<DropDown
							gapY={6}
							align="RR"
							options={[
								{
									text: "최신순",
									onClick() {
										setOrderBy("recent");
									},
								},
								{
									text: "좋아요순",
									onClick() {
										setOrderBy("like");
									},
								},
							]}
						>
							<div className="flex w-[94px] items-center justify-between rounded-[12px] bg-background-secondary px-[8px] py-[8px] text-md font-normal text-text-primary tablet:w-[120px]">
								{orderBy === "recent" ? "최신순" : "좋아요순"}
								<Icon.Toggle width={24} height={24} color="#64748B" />
							</div>
						</DropDown>
					</div>
					<div className="grid grid-cols-1 gap-[24px] desktop:grid-cols-2">
						{articles?.pages.map((article, index) => (
							<Link
								key={article.id}
								// @ts-ignore
								ref={articles.pages.length - 1 === index ? (ref) => setViewport(ref) : undefined}
								href={`/boards/${article.id}`}
								className="flex h-[176px] flex-col rounded-[12px] border border-border-primary bg-background-secondary px-[16px] py-[16px]"
							>
								<div className="text-md font-medium text-text-secondary">{article.title}</div>
								<div className="mt-[12px] grow text-md font-medium text-text-default">{new Date(article.createdAt).toLocaleDateString()}</div>
								<div className="mt-[14px] flex items-center justify-between">
									<div className="flex items-center gap-[12px]">
										<Image src="/images/profile.png" alt="avatar" width={32} height={32} />
										<div className="text-md font-medium text-text-primary">{article.writer.nickname}</div>
									</div>
									<div className="flex items-center gap-[4px]">
										<Icon.Heart width={16} height={16} color={article.isLiked ? "#EF4444" : "#64748B"} />
										<div className="text-md font-normal text-text-default">{article.likeCount}</div>
									</div>
								</div>
							</Link>
						))}
						{/* eslint-disable-next-line no-nested-ternary */}
						{new Array(isFetching ? (articles ? Math.min(articles.totalCount - articles.pages.length, 10) : 3) : 0).fill(null).map((_, index) => (
							<div
								// eslint-disable-next-line react/no-array-index-key
								key={index}
								className="flex h-[176px] flex-col gap-[12px] rounded-[12px] border border-border-primary bg-background-secondary px-[16px] py-[16px]"
							>
								<div className="h-[16px] w-8/12 animate-pulse rounded-md bg-border-primary/25" />
								<div className="h-[16px] w-6/12 animate-pulse rounded-md bg-border-primary/25" />
								<div className="h-[16px] w-7/12 animate-pulse rounded-md bg-border-primary/25" />
								<div className="h-[16px] w-4/12 animate-pulse rounded-md bg-border-primary/25" />
								<div className="h-[16px] w-5/12 animate-pulse rounded-md bg-border-primary/25" />
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
