"use client";

import API from "@/app/_api";

import Icon from "@/app/_icons";

import { useQuery } from "@tanstack/react-query";

import DropDown from "@/app/_components/Dropdown";

export default function Page() {
	const { data } = useQuery({
		queryKey: ["my-history"],
		queryFn: () => API["{teamId}/user/history"].GET({}),
		select: (response) =>
			response.reduce((accumulate: Record<string, (typeof response)[number]["tasksDone"]>, { tasksDone }) => {
				for (const task of tasksDone) {
					// eslint-disable-next-line no-param-reassign
					(accumulate[task.doneAt.split("T")[0]] ??= []).push(task);
				}
				return accumulate;
			}, {}),
	});

	return (
		<main className="flex h-full justify-center pt-[40px] text-text-primary">
			<div className="flex w-full flex-col gap-[24px] px-[16px] desktop:container tablet:px-[24px] desktop:px-0">
				<div className="text-xl font-bold">마이 히스토리</div>
				{/* eslint-disable-next-line react/no-array-index-key */}
				<div className="flex h-full flex-col gap-[40px]">
					{(() => {
						if (data && 0 < Object.keys(data).length) {
							return Object.keys(data).map((key) => (
								<div key={key} className="flex flex-col gap-[16px]">
									<div className="text-lg font-medium">{key}</div>
									<div className="flex flex-col gap-[16px]">
										{data[key].map((task) => (
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
													align="RL"
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
