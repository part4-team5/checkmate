"use client";

import Image from "next/image";
import defaultImage from "@/public/images/profile.png";

interface AuthorProps {
	userProfile?: string;
	userName: string;
	userEmail?: string;
}

export default function Author({ userProfile, userName, userEmail }: AuthorProps) {
	return (
		<div className="flex items-center gap-[12px]">
			<Image src={userProfile ?? defaultImage} alt={userName} width={32} height={32} />
			<div>
				<div className="text-primary text-md font-medium">{userName}</div>
				{userEmail && <div className="text-secondary text-xs">{userEmail}</div>}
			</div>
		</div>
	);
}
