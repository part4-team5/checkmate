"use client";

import React from "react";
import CheckIcon from "@/public/icons/CheckIcon";
import Link from "next/link";
import Image from "next/image";

interface TeamItemProps {
	name: string;
	image: string;
	iconType?: "header" | "menu";
	navigatePath: string;
}

function TeamItem({ name, image, iconType, navigatePath }: TeamItemProps) {
	const renderIcon = () => {
		if (iconType === "header") {
			return <CheckIcon />;
		}
		if (iconType === "menu") {
			return null;
		}
		return null;
	};

	const baseStyles = "mb-[0] bg-background-secondary flex items-center text-[15px] text-white";
	const headerStyles = "bg-blue-500 text-white h-[32px] w-[97px] text-[14px] gap-[12px] justify-between";
	const menuStyles = "text-white h-[46px] w-[186px] gap-[36px] justify-between py-[7px] px-[8px] hover:bg-[#404C5E] rounded-[8px]";

	return (
		<div className={`${baseStyles} ${iconType === "header" ? headerStyles : menuStyles}`}>
			{iconType === "menu" ? (
				<Link href={navigatePath} className="flex cursor-pointer items-center justify-center gap-[12px]">
					<Image src={image} alt={name} width={32} height={32} />
					{name}
				</Link>
			) : (
				<div className="flex items-center justify-center gap-[12px]">{name}</div>
			)}
			{renderIcon()}
		</div>
	);
}

TeamItem.defaultProps = {
	iconType: undefined,
};

export default TeamItem;
