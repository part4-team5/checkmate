"use client";

import API from "@/app/_api";

import Icon from "@/app/_icons";

import { useQuery } from "@tanstack/react-query";

export default function Page() {
	const { data } = useQuery({
		queryKey: ["my-history"],
		queryFn: () => API["{teamId}/user/history"].GET({}),
		select: (response) =>
			response.tasksDone.reduce((accumulate: Record<string, (typeof response)["tasksDone"]>, task) => {
				// eslint-disable-next-line no-param-reassign
				(accumulate[task.doneAt.split("T")[0]] ??= []).push(task);
				return accumulate;
			}, {}),
	});

	return (
		<main className="flex h-full justify-center pb-[120px] pt-[40px] text-text-primary">
			<div className="flex w-full flex-col gap-[24px] px-[16px] desktop:container tablet:px-[24px] desktop:px-0">
				<div className="hidden text-xl font-bold tablet:block">마이 히스토리</div>
				{/* eslint-disable-next-line react/no-array-index-key */}
				<div className="relative flex h-full flex-col gap-[40px]">
					{(() => {
						if (data && 0 < Object.keys(data).length) {
							return (
								<>
									<div className="absolute left-1/2 h-[15px] w-[15px] -translate-x-1/2 rounded-full bg-brand-primary" />
									<div className="absolute left-1/2 h-full w-[4px] -translate-x-1/2 bg-brand-primary" />
									{Object.keys(data).map((key) => (
										<div key={key} className="group flex w-1/2 flex-col gap-[16px] odd:pr-[30px] even:self-end even:pl-[30px]">
											<div className="grow text-lg font-medium group-odd:text-right group-even:text-left">{key}</div>
											<div className="relative flex flex-col gap-[16px] rounded-[12px] bg-background-secondary px-[12px] py-[12px] shadow-bestCard">
												{data[key].map((task) => (
													<div key={task.id} className="flex h-[44px] items-center gap-[7px] rounded-[8px] bg-background-tertiary px-[14px] shadow-bestCard">
														<div className="mx-[4px] my-[4px] flex items-center justify-center rounded-[6px] bg-brand-tertiary">
															<Icon.Check width={16} height={16} color="#FFFFFF" />
														</div>
														<div className="grow overflow-hidden text-ellipsis text-md font-normal line-through">{task.name}</div>
													</div>
												))}
												<div className="absolute top-1/2 h-[15px] w-[15px] -translate-y-1/2 rounded-full bg-brand-primary group-odd:-right-[37.5px] group-even:-left-[37.5px]" />
												<div className="absolute top-1/2 h-[4px] w-[30px] -translate-y-1/2 bg-brand-primary group-odd:-right-[30px] group-even:-left-[30px]" />
											</div>
										</div>
									))}
									<div className="absolute bottom-[0px] left-1/2 h-[15px] w-[15px] -translate-x-1/2 rounded-full bg-brand-primary" />
									<div className="absolute -bottom-[60px] left-1/2 -translate-x-1/2 translate-y-[35px] rounded-[12px] border-[2.5px] border-dotted border-text-default px-[12px] py-[12px]">
										앞으로의 일정을 완료해보세요!
									</div>
								</>
							);
						}
						return <div className="flex h-full w-full items-center justify-center text-md font-medium text-text-default">아직 히스토리가 없습니다</div>;
					})()}
				</div>
			</div>
		</main>
	);
}
