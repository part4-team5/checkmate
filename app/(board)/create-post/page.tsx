"use client";

import { useCallback, useState, useRef, useEffect } from "react";

import API from "@/app/_api";

import Quill from "@/app/_components/Quill";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";
import Tour from "@/app/_utils/Tour";

const [FILE_SIZE, FILE_NAME] = [1024 * 10000, /^[a-zA-Z0-9._\-\s]+\.(?:gif|png|jpe?g|webp)$/];

const enum Category {
	ALL = "",
	NEWS = "[소식]",
	LIFE = "[일상]",
	TRADE = "[장터]",
}

export default function Page() {
	const router = useRouter();

	const [image, setImage] = useState<string>();
	const [title, setTitle] = useState<string>();
	const [content, setContent] = useState<string>();
	const [category, setCategory] = useState(Category.ALL);

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
					.POST({}, { image, title: category === Category.ALL ? title! : [category, title!].join("\u0020"), content: content! })
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
		[image, title, content, category],
	);

	useEffect(() => {
		Tour.play([
			{
				query: "#thumb",
				content: "Click 또는 Drag & Drop 으로 사진을 추가할 수 있어요",
				position: "bottom",
			},
			{
				query: "#editor",
				content: "Markdown 문법을 지원해요",
				position: "top",
			},
			{
				query: "#to-viewer",
				content: "작성한 내용을 미리 볼 수 있어요",
				position: "right",
			},
			{
				query: "#create-post",
				content: "작성을 완료하면 이 버튼을 누르세요",
				position: "left",
			},
		]);
	}, []);

	return (
		<main className="flex w-full flex-col items-center tablet:px-[60px] tablet:py-[30px] desktop:pt-[60px]">
			<form className="h-full w-full bg-background-secondary shadow-postboard desktop:container tablet:rounded-[10px]" onSubmit={onSubmit}>
				<label
					id="thumb"
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
					<input
						className="h-full grow rounded-[10px] bg-transparent px-[10px] text-text-primary shadow-postboardTitle outline-none focus:border-brand-primary"
						placeholder="제목을 입력해주세요"
						onChange={(event) => setTitle(event.target.value)}
					/>
					<button
						type="button"
						// @ts-ignore
						style={{ borderColor: category === Category.ALL && "#10b981", backgroundColor: category === Category.ALL && "var(--background-Senary)" }}
						className="h-full rounded-[10px] border border-transparent bg-background-tertiary px-[12px] text-text-primary shadow-postboard hover:bg-background-Senary"
						onClick={() => setCategory(Category.ALL)}
					>
						전체
					</button>
					<button
						type="button" // @ts-ignore
						style={{ borderColor: category === Category.NEWS && "#10b981", backgroundColor: category === Category.NEWS && "var(--background-Senary)" }}
						className="h-full rounded-[10px] border border-transparent bg-background-tertiary px-[12px] text-text-primary shadow-postboard hover:bg-background-Senary"
						onClick={() => setCategory(Category.NEWS)}
					>
						소식
					</button>
					<button
						type="button" // @ts-ignore
						style={{ borderColor: category === Category.LIFE && "#10b981", backgroundColor: category === Category.LIFE && "var(--background-Senary)" }}
						className="h-full rounded-[10px] border border-transparent bg-background-tertiary px-[12px] text-text-primary shadow-postboard hover:bg-background-Senary"
						onClick={() => setCategory(Category.LIFE)}
					>
						일상
					</button>
					<button
						type="button" // @ts-ignore
						style={{ borderColor: category === Category.TRADE && "#10b981", backgroundColor: category === Category.TRADE && "var(--background-Senary)" }}
						className="h-full rounded-[10px] border border-transparent bg-background-tertiary px-[12px] text-text-primary shadow-postboard hover:bg-background-Senary"
						onClick={() => setCategory(Category.TRADE)}
					>
						장터
					</button>
					<div className="h-full w-[75px]">
						<Button id="create-post" type="submit" fontSize="md" disabled={!(1 <= (title?.length ?? 0) && 1 <= (content?.length ?? 0))}>
							작성하기
						</Button>
					</div>
				</div>
				<div className="px-[15px] py-[15px]">
					<Quill placeholder="본문을 입력해주세요" onChange={(data) => setContent(data)} />
				</div>
			</form>
		</main>
	);
}
