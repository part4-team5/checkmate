"use client";

import Image from "next/image";
import defaultImage from "@/public/icons/defaultAvatar.svg";

interface UserInfoProps {
	userProfile?: string;
	userName: string;
	userEmail?: string;
}

export default function UserInfo({ userProfile, userName, userEmail }: UserInfoProps) {
	return (
		<div className="flex items-center gap-[12px]">
			<div className="hidden tablet:block">
				<Image src={userProfile || defaultImage} alt={userName} width={32} height={32} />
			</div>
			<div className="flex flex-col gap-[6px]">
				<div className="flex items-center justify-center gap-[8px] tablet:hidden">
					<Image src={userProfile || defaultImage} alt={userName} width={32} height={32} />
					<div className="text-primary text-md font-medium">{userName}</div>
				</div>
				<div className="text-primary hidden text-md font-medium tablet:block">{userName}</div>
				{userEmail && <div className="text-secondary text-xs">{userEmail}</div>}
			</div>
		</div>
	);
}
