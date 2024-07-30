"use client";

import Author from "@/app/_components/Author";
import Image from "next/image";
import { createContext, useContext, useMemo } from "react";

interface MessageProps {
	content: string;
	date: string;
	userProfile?: string;
	userName: string;
	commentCount?: number;
	likeCount?: number;
	boardImage?: string;
	variant?: "taskDetail" | "taskComment" | "bestBoard" | "boardList" | "boardDetail" | "boardComment";
}

interface MessageContextProps {
	content: string;
	date: string;
	commentCount?: number;
	likeCount?: number;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

function Content() {
	const context = useContext(MessageContext);
	if (!context) throw new Error("Message Content error");

	return <div className="text-primary text-md">{context.content}</div>;
}

function Date() {
	const context = useContext(MessageContext);
	if (!context) throw new Error("Message Date error");

	return <div className="text-secondary text-md">{context.date}</div>;
}

function Reaction() {
	const context = useContext(MessageContext);
	if (!context) throw new Error("Message Reaction error");

	return (
		<div className="flex items-center gap-[8px] text-md">
			<div>{context.commentCount ?? 0}</div>
			<div>{context.likeCount ?? 0}</div>
		</div>
	);
}

function BoardImage({ src }: { src: string }) {
	return <Image src={src} alt="Board" className="h-auto w-full" />;
}

export default function Message({ content, date, userProfile, userName, commentCount, likeCount, boardImage, variant = "taskDetail" }: MessageProps) {
	const contextValue = useMemo(() => ({ content, date, commentCount, likeCount }), [content, date, commentCount, likeCount]);

	const showReaction = ["bestBoard", "boardList", "boardDetail"].includes(variant);
	const showBoardImage = ["bestBoard", "boardList"].includes(variant);

	const variantClass = {
		taskDetail: {
			container: "bg-blue-100",
			content: "order-2",
		},
		taskComment: {
			container: "bg-green-100",
		},
		bestBoard: {
			container: "bg-yellow-100",
		},
		boardList: {
			container: "bg-red-100",
		},
		boardDetail: {
			container: "bg-purple-100",
		},
		boardComment: {
			container: "bg-pink-100",
		},
	}[variant];

	return (
		<MessageContext.Provider value={contextValue}>
			<div className={`flex flex-col gap-[16px] ${variantClass.container}`}>
				<div className={`${variantClass.content}`}>
					<Content />
				</div>
				<div className="flex items-center justify-between">
					<Author userName={userName} userProfile={userProfile} />
					<Date />
				</div>
				{showReaction && <Reaction />}
				{showBoardImage && boardImage && <BoardImage src={boardImage} />}
			</div>
		</MessageContext.Provider>
	);
}
