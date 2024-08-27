"use client";

import { useCallback, useState, useRef } from "react";

import API from "@/app/_api";

import Quill from "@/app/_components/Quill";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";

const [FILE_SIZE, FILE_NAME] = [1024 * 10000, /^[a-zA-Z0-9._\-\s]+\.(?:gif|png|jpe?g|webp)$/];

export default function Page() {
	const router = useRouter();

	const [image, setImage] = useState<string>();
	const [title, setTitle] = useState<string>();
	const [content, setContent] = useState<string>();

	const outline = useRef<HTMLDivElement>(null);

	const upload = useCallback((file?: File | null) => {
		if (!file) return;
		if (FILE_SIZE < file.size) return;
		if (!FILE_NAME.test(file.name)) return;

		API["{teamId}/images/upload"].POST({}, file).then((response) => {
			setImage(response.url);
		});
	}, []);

	const onDragEnter = useCallback((event: React.DragEvent) => {
		// :3
		event.preventDefault();
		event.stopPropagation();

		outline.current?.style.setProperty("border-color", "black");
	}, []);

	const onDragLeave = useCallback((event: React.DragEvent) => {
		// :3
		event.preventDefault();
		event.stopPropagation();

		outline.current?.style.setProperty("border-color", null);
	}, []);

	const onDrop = useCallback(
		(event: React.DragEvent) => {
			// :3
			event.preventDefault();
			event.stopPropagation();

			upload(event.dataTransfer.items[0].getAsFile());

			outline.current?.style.setProperty("border-color", null);
		},
		[upload],
	);

	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			// :3
			event.preventDefault();
			event.stopPropagation();

			upload(event.target.files?.[0]);

			outline.current?.style.setProperty("border-color", null);
		},
		[upload],
	);

	const ongoing = useRef(false);

	const onSubmit = useCallback(
		(event: React.FormEvent) => {
			// :3
			event.preventDefault();
			event.stopPropagation();

			if (ongoing.current) return;

			if (1 <= (title?.length ?? 0) && 1 <= (content?.length ?? 0)) {
				API["{teamId}/articles"]
					.POST({}, { image, title: title!, content: content! })
					.then((response) => {
						router.push(`boards/${response.id}`);
					})
					.finally(() => {
						ongoing.current = false;
					});
				ongoing.current = true;
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[image, title, content],
	);

	return (
		<main className="flex w-full flex-col items-center tablet:px-[60px] tablet:py-[30px] desktop:pt-[60px]">
			<form className="tablet:shadow-lg h-full w-full bg-background-secondary desktop:container tablet:rounded-[10px]" onSubmit={onSubmit}>
				<label
					htmlFor="image"
					onDrop={onDrop}
					onDragEnd={onDrop}
					onDragOver={onDragEnter}
					onDragEnter={onDragEnter}
					onDragLeave={onDragLeave}
					className="relative flex h-[150px] items-center justify-center overflow-hidden tablet:rounded-t-[10px]"
				>
					<div
						style={{ backgroundImage: `url("${image}")` }}
						className="pointer-events-none absolute inset-0 bg-background-tertiary bg-cover bg-center transition-colors"
					/>
					<div
						ref={outline}
						className="pointer-events-none absolute inset-[5px] flex items-center justify-center rounded-[10px] border-[2.25px] border-dashed border-transparent text-3xl text-text-default"
					>
						대표 사진
					</div>
					<input id="image" type="file" className="hidden" onChange={onChange} />
				</label>
				<div className="mx-[15px] mt-[15px] flex h-[45px] items-center gap-[15px]">
					<div className="flex h-full grow items-center gap-[10px] overflow-hidden rounded-[10px] border border-white/15 px-[10px] has-[input:focus]:border-brand-primary">
						<input
							className="h-full grow bg-transparent text-text-primary outline-none"
							placeholder="제목을 입력해주세요"
							onChange={(event) => setTitle(event.target.value)}
						/>
					</div>
					<div className="h-full w-[75px]">
						<Button type="submit" fontSize="md" disabled={!(1 <= (title?.length ?? 0) && 1 <= (content?.length ?? 0))}>
							작성하기
						</Button>
					</div>
				</div>
				<div className="px-[15px] py-[15px]">
					<Quill placeholder="본문을 입력해주세요" onChange={(data) => setContent(data)} />
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
