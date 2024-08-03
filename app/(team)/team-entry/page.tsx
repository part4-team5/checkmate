"use client";

import { useSearchParams } from "next/navigation";

export default function TeamEntryPage() {
	const type = useSearchParams().get("type");

	return (
		<main className="h-dvh bg-background-primary text-text-default">
			<section className="flex h-full flex-col items-center justify-center">
				<div className="flex size-full max-h-[345px] max-w-screen-desktop flex-col items-center justify-center gap-12">
					<div className="text-center text-lg font-medium">
						{type === "join" ? (
							<>
								팀을 생성하고 <br />
								팀원들과 할 일 목록을 공유하세요.
							</>
						) : (
							<>
								팀에 참여하고 <br />
								팀원들과 할 일 목록을 공유하세요.
							</>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}
