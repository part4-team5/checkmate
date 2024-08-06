"use client";

import Image from "next/image";
import { createContext, useContext, ReactNode, useMemo } from "react";
import defaultImage from "@/public/images/profile.png";
import HeartIcon from "@/public/icons/ic_heart";
import CommentIcon from "@/public/icons/ic_comment";

interface MessageData {
	content?: string;
	date?: string;
	userProfile?: string;
	userName?: string;
	commentCount?: number;
	likeCount?: number;
	boardImage?: string;
}

interface MessageContextProps {
	data: MessageData;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export default function Message({ data, children }: { data: MessageData; children: ReactNode }) {
	const contextValue = useMemo(() => ({ data }), [data]);

	return <MessageContext.Provider value={contextValue}>{children}</MessageContext.Provider>;
}

function useMessageContext() {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error("MessageContext is missing.");
	}
	return context.data;
}

Message.Content = function Content() {
	const data = useMessageContext();
	return <div className="text-primary text-md">{data.content}</div>;
};

Message.Date = function Date() {
	const data = useMessageContext();
	return <div className="text-secondary text-md">{data.date}</div>;
};

Message.Author = function Author() {
	const data = useMessageContext();
	return (
		<div className="flex items-center gap-[12px]">
			<Image src={data.userProfile ?? defaultImage} alt={data.userName ?? ""} width={32} height={32} />
			<div>
				<div className="text-primary text-md font-medium">{data.userName}</div>
			</div>
		</div>
	);
};

Message.Reaction = function Reaction() {
	const data = useMessageContext();
	return (
		<div className="flex items-center gap-[8px] text-md">
			<div className="flex gap-[4px]">
				<HeartIcon width={16} height={16} />
				{data.commentCount ?? 0}
			</div>
			<div className="flex gap-[4px]">
				<CommentIcon width={16} height={16} />
				{data.likeCount ?? 0}
			</div>
		</div>
	);
};

Message.BoardImage = function BoardImage() {
	const data = useMessageContext();
	return (
		<div className="md:w-[72px] md:h-[72px] border-[1px_solid_rgb(248 250 252 / 10%)] relative h-[64px] w-[64px] overflow-hidden rounded-lg">
			<Image src={data.boardImage ?? ""} alt="board" fill />
		</div>
	);
};
