"use client";

import API from "@/app/_api";

import { useEffect, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import Icon from "@/app/_icons";
import Image from "next/image";
import Link from "next/link";
import DropDown from "@/app/_components/Dropdown";
import Button from "@/app/_components/Button";

const enum Category {
	ALL = "",
	NEWS = "[소식]",
	LIFE = "[일상]",
	TRADE = "[장터]",
}

export default function Page() {
	const [keyword, setKeyword] = useState("");
	const [category, setCategory] = useState(Category.ALL);

	const [display, setDisplay] = useState<"card" | "compact">("card");
	const [orderBy, setOrderBy] = useState<Parameters<(typeof API)["{teamId}/articles"]["GET"]>[0]["orderBy"]>("recent");

	const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery({
		queryKey: ["articles", category, orderBy],
		queryFn: ({ pageParam }) => API["{teamId}/articles"].GET(pageParam),
		initialPageParam: { page: 1, keyword: category, orderBy, pageSize: 10 },
		// eslint-disable-next-line consistent-return
		getNextPageParam(lastPage, allPages, lastPageParams) {
			if (allPages.flatMap((_) => _.list).length < lastPage.totalCount) {
				return { ...lastPageParams, page: lastPageParams.page + 1 };
			}
		},
		select: (_) => ({
			pages: _.pages.flatMap((page) => page.list),
			totalCount: _.pages.at(-1)?.totalCount ?? 0,
		}),
	});

	const [last, setLast] = useState<HTMLElement>();

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (hasNextPage && last) {
			const observer = new IntersectionObserver((entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						fetchNextPage();
						observer.disconnect();
					}
				}
			});
			observer.observe(last);
			return () => observer.disconnect();
		}
	}, [data, last, hasNextPage, fetchNextPage]);

	const posts = data?.pages.filter((post) => post.title.includes(keyword));

	return (
		<main className="h-[calc(100dvh-60px)]">
			<div className="mx-auto flex h-full flex-col gap-[24px] px-[16px] py-[32px] desktop:container tablet:px-[24px] tablet:py-[40px] desktop:px-0">
				<div className="hidden text-2xl text-text-primary tablet:block">자유게시판</div>
				<div className="relative mb-[72px] flex items-center justify-between gap-[64px] desktop:mb-0">
					<div className="flex items-center gap-[18px] text-2lg text-text-primary">
						<button
							type="button"
							// @ts-ignore
							style={{ borderColor: category === Category.ALL && "#10b981", backgroundColor: category === Category.ALL && "var(--background-Senary)" }}
							className="rounded-[12px] border border-transparent bg-background-secondary px-[12px] py-[12px] shadow-postboard hover:bg-background-Senary"
							onClick={() => setCategory(Category.ALL)}
						>
							전체
						</button>
						<button
							type="button"
							// @ts-ignore
							style={{ borderColor: category === Category.NEWS && "#10b981", backgroundColor: category === Category.NEWS && "var(--background-Senary)" }}
							className="rounded-[12px] border border-transparent bg-background-secondary px-[12px] py-[12px] shadow-postboard hover:bg-background-Senary"
							onClick={() => setCategory(Category.NEWS)}
						>
							소식
						</button>
						<button
							type="button"
							// @ts-ignore
							style={{ borderColor: category === Category.LIFE && "#10b981", backgroundColor: category === Category.LIFE && "var(--background-Senary)" }}
							className="rounded-[12px] border border-transparent bg-background-secondary px-[12px] py-[12px] shadow-postboard hover:bg-background-Senary"
							onClick={() => setCategory(Category.LIFE)}
						>
							일상
						</button>
						<button
							type="button"
							// @ts-ignore
							style={{ borderColor: category === Category.TRADE && "#10b981", backgroundColor: category === Category.TRADE && "var(--background-Senary)" }}
							className="rounded-[12px] border border-transparent bg-background-secondary px-[12px] py-[12px] shadow-postboard hover:bg-background-Senary"
							onClick={() => setCategory(Category.TRADE)}
						>
							장터
						</button>
					</div>
					<div className="absolute -bottom-[24px] left-0 right-[128px] flex grow translate-y-full items-center gap-[8px] rounded-[12px] bg-background-secondary px-[16px] shadow-postboard has-[input:focus]:border-brand-primary desktop:static desktop:translate-y-0">
						<Icon.Search width={24} height={24} color="var(--text-primary)" />
						<input
							className="h-full grow bg-transparent py-[12px] text-2lg text-text-primary outline-none"
							placeholder="검색어를 입력해주세요"
							onChange={(event) => setKeyword(event.target.value)}
						/>
					</div>
					<div className="absolute -bottom-[24px] right-0 flex translate-y-full items-center gap-[16px] desktop:static desktop:translate-y-0">
						<button
							type="button"
							aria-label="mode"
							className="flex aspect-square items-center rounded-[12px] bg-background-secondary px-[12px] shadow-postboard hover:bg-background-quinary"
							onClick={() => {
								// eslint-disable-next-line default-case
								switch (display) {
									case "card": {
										setDisplay("compact");
										break;
									}
									case "compact": {
										setDisplay("card");
										break;
									}
								}
							}}
						>
							<Icon.Mode width={24} height={24} color="var(--text-primary)" />
						</button>
						<DropDown
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
							align="RR"
							gapY={10}
						>
							<button
								type="button"
								aria-label="sort"
								className="flex aspect-square items-center rounded-[12px] bg-background-secondary px-[12px] shadow-postboard hover:bg-background-quinary"
							>
								<Icon.Sort width={24} height={24} color="var(--text-primary)" />
							</button>
						</DropDown>
					</div>
				</div>
				<div className="overflow-auto rounded-[12px] bg-background-secondary px-[12px] py-[12px] shadow-postboard">
					{display === "card" && (
						<div className="grid grid-cols-1 gap-[12px] text-text-primary tablet:grid-cols-2">
							{posts?.map((post) => (
								<Link
									key={post.id}
									ref={posts.at(-1) === post ? (ref) => setLast(ref!) : undefined}
									href={`/boards/${post.id}`}
									className="flex h-[190px] justify-between gap-[24px] rounded-[12px] bg-background-tertiary px-[12px] py-[12px] shadow-bestCard hover:bg-background-quinary"
								>
									<div className="flex flex-shrink-0 flex-col justify-between gap-[24px]">
										<div className="flex flex-col gap-[12px]">
											<div className="text-ellipsis text-xl">{post.title}</div>
											<div className="text-md">{new Date(post.createdAt).toLocaleDateString()}</div>
										</div>
										<div className="flex items-center gap-[8px] text-nowrap desktop:gap-[16px]">
											<div className="flex items-center gap-[8px]">
												<Image src={post.writer.image ?? "/images/profile.png"} alt="avatar" width={24} height={24} />
												{post.writer.nickname}
											</div>
											<div className="flex items-center gap-[8px]">
												<Icon.Comment width={16} height={16} color="#828282" />
												{post.commentCount}
											</div>
											<div className="flex items-center gap-[8px]">
												<Icon.Heart width={16} height={16} color={post.isLiked ? "rose" : "#828282"} />
												{post.likeCount}
											</div>
										</div>
									</div>
									{post.image && (
										<div
											className="aspect-square h-full overflow-hidden rounded-[12px] bg-background-secondary bg-cover"
											style={{ backgroundImage: `url("${post.image}")` }}
										/>
									)}
								</Link>
							))}
							{/* eslint-disable-next-line no-nested-ternary */}
							{new Array(isFetching ? (data ? Math.min(data.totalCount - data.pages.length, 10) : 10) : 0).fill(null).map((_, index) => (
								<div
									// eslint-disable-next-line react/no-array-index-key
									key={index}
									className="flex h-[125px] flex-col gap-[16px] rounded-[12px] bg-background-secondary px-[12px] py-[12px]"
								>
									<div className="bg-border-primary/25 h-[16px] w-6/12 animate-pulse rounded-md" />
									<div className="bg-border-primary/25 h-[16px] w-5/12 animate-pulse rounded-md" />
									<div className="bg-border-primary/25 h-[16px] w-3/12 animate-pulse rounded-md" />
									<div className="bg-border-primary/25 h-[16px] w-6/12 animate-pulse rounded-md" />
								</div>
							))}
						</div>
					)}
					{display === "compact" && (
						<div className="grid grid-cols-1 gap-[12px] text-text-primary">
							{posts?.map((post) => (
								<Link
									key={post.id}
									ref={posts.at(-1) === post ? (ref) => setLast(ref!) : undefined}
									href={`/boards/${post.id}`}
									className="flex flex-col justify-between gap-[8px] rounded-[12px] bg-background-tertiary px-[12px] py-[12px] shadow-bestCard hover:bg-background-quinary"
								>
									<div className="flex justify-between text-2lg">
										{post.title}
										<div className="flex items-center gap-[8px] text-md">
											<Icon.Comment width={16} height={16} color="#828282" />
											{post.commentCount}
										</div>
									</div>
									<div className="flex justify-between text-md">
										<div className="flex items-center gap-[16px]">
											<div className="flex items-center gap-[8px]">
												<Image src={post.writer.image ?? "/images/profile.png"} alt="avatar" width={24} height={24} />
												{post.writer.nickname}
											</div>
											{new Date(post.createdAt).toLocaleDateString()}
										</div>
										<div className="flex items-center gap-[8px]">
											<Icon.Heart width={16} height={16} color={post.isLiked ? "rose" : "#828282"} />
											{post.likeCount}
										</div>
									</div>
								</Link>
							))}
							{/* eslint-disable-next-line no-nested-ternary */}
							{new Array(isFetching ? (data ? Math.min(data.totalCount - data.pages.length, 10) : 10) : 0).fill(null).map((_, index) => (
								<div
									// eslint-disable-next-line react/no-array-index-key
									key={index}
									className="flex h-[80px] flex-col gap-[16px] rounded-[12px] bg-background-secondary px-[12px] py-[12px]"
								>
									<div className="bg-border-primary/25 h-[16px] w-6/12 animate-pulse rounded-md" />
									<div className="bg-border-primary/25 h-[16px] w-5/12 animate-pulse rounded-md" />
									<div className="bg-border-primary/25 h-[16px] w-3/12 animate-pulse rounded-md" />
									<div className="bg-border-primary/25 h-[16px] w-6/12 animate-pulse rounded-md" />
								</div>
							))}
						</div>
					)}
					{!isFetching && (posts?.length ?? 0) === 0 && <div className="text-center text-text-primary">없어요...</div>}
				</div>
			</div>
			<div className="shadow-lg fixed bottom-[45px] right-[16px] z-40 flex h-[48px] w-[104px] items-center justify-center overflow-hidden rounded-[40px] tablet:right-[24px] desktop:right-[calc((100%-1200px)/2)]">
				<Button href="/create-post">+ 글쓰기</Button>
			</div>
		</main>
	);
}
