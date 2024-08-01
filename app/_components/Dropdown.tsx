"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TeamItem from "@/app/_components/TeamItem";
import PlusIcon from "@/public/icons/PlusIcon";
import Link from "next/link";
import Popover from "./Popover";
import { useDropdownStore, DropdownItem, DropdownType } from "../_store/Dropdown";

interface DropdownProps {
	type: DropdownType;
	icon?: ReactNode;
	gap?: number;
	anchorOrigin: { vertical: "top" | "center" | "bottom"; horizontal: "left" | "center" | "right" };
	overlayOrigin: { vertical: "top" | "center" | "bottom"; horizontal: "left" | "center" | "right" };
}

function Dropdown({ type, icon, gap = 8, anchorOrigin, overlayOrigin }: DropdownProps) {
	const [items, setItems] = useState<DropdownItem[]>([]);
	const getItems = useDropdownStore((state) => state.getItems);
	const router = useRouter();

	useEffect(() => {
		const dropdownItems = getItems(type);
		setItems(dropdownItems);
	}, [type, getItems]);

	const handleItemClick = (item: DropdownItem) => {
		switch (item.actionType) {
			case "modal":
				break;
			case "logout":
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				router.push("/");
				break;
			default:
				break;
		}
	};

	const overlayClassNames = {
		user: "w-[120px] text-[14px] flex flex-col items-center",
		team: "p-[16px]",
		edit: "w-[120px]",
	};

	const getOverlayClassNames = () => overlayClassNames[type] || "";

	const getTriggerElement = () => {
		if (icon) return icon;

		if (type === "team" && items.length > 0) {
			return <TeamItem name={items[0].name!} image={items[0].image!} iconType="header" navigatePath={items[0].path!} />;
		}

		if (items.length > 0) {
			return <span>{items[0].label}</span>;
		}

		return null;
	};

	const triggerElement = getTriggerElement();

	const renderItemContent = (item: DropdownItem) => {
		const isTeamItem = item.name && item.image;
		const isNavigate = item.actionType === "navigate";
		const linkHref = item.path as string;

		if (isTeamItem) {
			return <TeamItem name={item.name!} image={item.image!} iconType="menu" navigatePath={linkHref} />;
		}

		if (isNavigate) {
			return (
				<Link href={linkHref} className="flex h-full w-full items-center justify-center">
					{item.label}
				</Link>
			);
		}

		return <p>{item.label}</p>;
	};

	const renderItem = (item: DropdownItem, index: number) => (
		<div
			key={index}
			className={`${
				item.name && item.image ? "mb-[8px]" : "flex h-[40px] cursor-pointer items-center justify-center rounded-[12px] text-white hover:bg-[#404C5E]"
			} text-white`}
			onClick={item.actionType === "navigate" ? undefined : () => handleItemClick(item)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					handleItemClick(item);
				}
			}}
			role="button"
			tabIndex={0}
		>
			{renderItemContent(item)}
		</div>
	);

	return (
		<div className="inline-block">
			<Popover
				gap={gap}
				overlay={
					<div className={`rounded-[12px] border border-white border-opacity-5 bg-background-secondary text-white ${getOverlayClassNames()}`}>
						{items.map(renderItem)}
						{type === "team" && (
							<button
								type="button"
								className="mt-[16px] flex h-[48px] w-[186px] cursor-pointer items-center justify-center gap-[4px] rounded-[12px] border border-[#F8FAFC] text-center text-white hover:bg-[#404C5E]"
								onClick={() => {}}
							>
								<PlusIcon />팀 추가하기
							</button>
						)}
					</div>
				}
				anchorOrigin={anchorOrigin}
				overlayOrigin={overlayOrigin}
			>
				{triggerElement}
			</Popover>
		</div>
	);
}

Dropdown.defaultProps = {
	icon: null,
	gap: 8,
};

export default Dropdown;
