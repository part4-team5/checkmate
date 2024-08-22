"use client";

import Image from "next/image";
import defaultImage from "@/public/icons/defaultAvatar.svg";
import Icon from "@/app/_icons";

interface UserInfoProps {
	userProfile?: string;
	userName: string;
	userEmail?: string;
	isAdmin?: boolean;
}

export default function UserInfo({ userProfile, userName, userEmail, isAdmin }: UserInfoProps) {
	return (
		<div className="flex items-center gap-[12px]">
			<div className="hidden tablet:block">
				<Image src={userProfile || defaultImage} alt={userName} width={32} height={32} />
			</div>
			<div className="flex flex-col gap-[6px]">
				<div className="flex items-center justify-start gap-[6px] tablet:hidden">
					<Image src={userProfile || defaultImage} alt={userName} width={32} height={32} />
					<div className="text-primary text-md font-medium">{userName}</div>
					{isAdmin && <Icon.Crown width={11} height={11} />}
				</div>
				<div className="text-primary hidden items-center gap-[6px] text-md font-medium tablet:flex">
					{userName}
					{isAdmin && <Icon.Crown width={11} height={11} />}
				</div>
				{userEmail && <div className="text-secondary text-xs">{userEmail}</div>}
			</div>
		</div>
	);
}
