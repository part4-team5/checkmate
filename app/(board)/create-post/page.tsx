"use client";

import { useCallback, useRef } from "react";

import Quill from "@/app/_components/Quill";
import Button from "@/app/_components/Button";

export default function Page() {
	const outline = useRef<HTMLDivElement>(null);

	const onDragEnter = useCallback((event: React.DragEvent) => {
		// :3
		event.preventDefault();
		event.stopPropagation();

		outline.current?.style.setProperty("border-color", "#474d66");
	}, []);

	const onDragLeave = useCallback((event: React.DragEvent) => {
		// :3
		event.preventDefault();
		event.stopPropagation();

		outline.current?.style.setProperty("border-color", null);
	}, []);

	const onDrop = useCallback((event: React.DragEvent) => {
		// :3
		event.preventDefault();
		event.stopPropagation();

		outline.current?.style.setProperty("border-color", null);
	}, []);

	return (
		<main className="flex w-full flex-col items-center tablet:px-[60px] tablet:py-[30px] desktop:pt-[60px]">
			<form className="h-full w-full bg-background-secondary desktop:container tablet:rounded-[10px] tablet:shadow-lg">
				<div
					onDrop={onDrop}
					onDragEnd={onDrop}
					onDragOver={onDragEnter}
					onDragEnter={onDragEnter}
					onDragLeave={onDragLeave}
					className="relative flex h-[150px] items-center justify-center overflow-hidden tablet:rounded-t-[10px]"
				>
					<div className="pointer-events-none absolute inset-0 bg-background-tertiary bg-cover bg-center transition-colors" />
					<div
						ref={outline}
						className="pointer-events-none absolute inset-[5px] flex items-center justify-center rounded-[10px] border-[1.75px] border-dashed border-transparent text-3xl text-text-default"
					>
						대표 사진
					</div>
				</div>
				<div className="mx-[15px] mt-[15px] flex h-[40px] items-center gap-[15px]">
					<div className="flex h-full grow items-center gap-[10px] overflow-hidden rounded-[10px] border border-background-tertiary px-[10px]">
						<input className="h-full grow bg-transparent text-text-primary outline-none" placeholder="제목을 입력해주세요" />
					</div>
					<div className="h-full w-[70px]">
						<Button>
							<div className="text-xs">작성하기</div>
						</Button>
					</div>
				</div>
				<div className="px-[15px] py-[15px]">
					<Quill />
				</div>
			</form>
			<div className="mt-[32px] h-[45px] w-[140px]">
				<Button href="/boards" variant="outline">
					목록으로
				</Button>
			</div>
		</main>
	);
}
