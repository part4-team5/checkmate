"use client";

import { useMemo } from "react";

import API from "@/app/_api";

import Icon from "@/app/_icons";

import { useQuery } from "@tanstack/react-query";

import DropDown from "@/app/_components/Dropdown";

export default function Page() {
	const { data } = useQuery({ queryKey: ["my-history"], queryFn: () => API["{teamId}/user/history"].GET({}) });

	const builder = useMemo(
		() =>
			data?.reduce((accumulate: Record<string, (typeof data)[number]["tasksDone"]>, { tasksDone }) => {
				for (const task of tasksDone) {
					// eslint-disable-next-line no-param-reassign
					(accumulate[task.doneAt.split("T")[0]] ??= []).push(task);
				}
				return accumulate;
			}, {}),
		[data],
	);

	return (
		<main className="mt-[40px] flex justify-center text-text-primary">
			<div className="flex w-full flex-col gap-[24px] px-[16px] desktop:container tablet:px-[24px] desktop:px-0">
				<div className="text-xl font-bold">마이 히스토리</div>
				{/* eslint-disable-next-line react/no-array-index-key */}
				<div className="flex flex-col gap-[40px]">
					{(() => {
						if (builder && 0 < Object.keys(builder).length) {
							return Object.keys(builder).map((key) => (
								<div key={key} className="flex flex-col gap-[16px]">
									<div className="text-lg font-medium">{key}</div>
									<div className="flex flex-col gap-[16px]">
										{builder[key].map((task) => (
											<div key={task.id} className="flex h-[44px] items-center gap-[7px] rounded-[8px] bg-background-secondary px-[14px]">
												<div className="mx-[4px] my-[4px] flex items-center justify-center rounded-[6px] bg-brand-tertiary">
													<Icon.Check width={16} height={16} color="#FFFFFF" />
												</div>
												<div className="grow text-md font-normal line-through">{task.name}</div>
												<DropDown
													options={[
														{
															text: "뭘 넣어야 할까요..?",
														},
														{
															text: "뭘 넣어야 할까요..?",
														},
													]}
													anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
													overlayOrigin={{ vertical: "top", horizontal: "right" }}
												>
													<div className="mx-[4px] my-[4px] flex items-center justify-center">
														<Icon.Kebab width={16} height={16} color="#64748B" />
													</div>
												</DropDown>
											</div>
										))}
									</div>
								</div>
							));
						}
						return <div className="flex h-full w-full items-center justify-center text-md font-medium text-text-default">아직 히스토리가 없습니다</div>;
					})()}
				</div>
			</div>
		</main>
	);
}
