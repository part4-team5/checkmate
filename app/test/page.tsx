"use client";

import Message from "@/app/_components/Message";
import API from "@/app/_api/index";
import { useEffect, useState } from "react";

// 동적으로 API의 반환 타입을 추론하여 사용
type ApiResponse = Awaited<ReturnType<(typeof API)["{teamId}/articles"]["GET"]>>;

export default function Page() {
	const [data, setData] = useState<ApiResponse["list"] | null>(null);

	const loadData = async () => {
		try {
			const response: ApiResponse = await API["{teamId}/articles"].GET({ teamId: "6-5" });
			setData(response.list);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return (
		<div>
			{data === null ? (
				<p>Loading...</p>
			) : (
				data.map((article) => {
					const messageData = {
						content: article.title,
						date: article.createdAt,
						userProfile: "", // 사용자 프로필 정보가 없는 경우 기본값 설정
						userName: article.writer.nickname,
						commentCount: 0, // 댓글 수가 없는 경우 기본값 설정
						likeCount: article.likeCount,
						boardImage: article.image,
					};

					return (
						<Message key={article.id} data={messageData}>
							<Message.Content />
							<div className="flex justify-between">
								<Message.Author />
								<Message.Date />
							</div>
							<Message.Reaction />
							<Message.BoardImage />
						</Message>
					);
				})
			)}
		</div>
	);
}
