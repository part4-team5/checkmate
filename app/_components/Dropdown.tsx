/* eslint-disable react/require-default-props */

"use client";

import React from "react";
import Image from "next/image";
import KebabIcon from "@/public/icons/KebabIcon";
import Popover from "./Popover";

/**
 * 메뉴 위치를 정의하는 타입
 */
type Origin = {
	vertical: "top" | "center" | "bottom";
	horizontal: "left" | "center" | "right";
};

/**
 * 드롭다운 옵션을 정의하는 타입
 */
type Option = {
	text?: string;
	onClick?: () => void;
	image?: string;
	content?: React.ReactNode;
	options?: Option[];
};

export interface DropDownProps {
	options: Option[];
	children: React.ReactNode;
	anchorOrigin?: Origin;
	overlayOrigin?: Origin;
	gapX?: number;
	gapY?: number;
}

export default function DropDown({
	options,
	children,
	anchorOrigin = { vertical: "bottom", horizontal: "left" },
	overlayOrigin = { vertical: "top", horizontal: "left" },
	gapX = 0,
	gapY = 0,
}: DropDownProps) {
	function handleOptionClick(e: React.MouseEvent, onClick?: () => void, close?: () => void) {
		if (onClick) {
			onClick();
		}
		if (close) {
			close();
		}
	}

	function recursive(items: Option[], close: () => void) {
		return (
			<div
				className={`flex w-max min-w-[120px] rounded-[12px] border border-white border-opacity-5 bg-background-secondary text-[#F8FAFC] ${
					items.some((option) => option.image) ? "space-y-2" : ""
				}`}
			>
				{items.map((option, index) => (
					<div key={`${option.text} ${index}` || index} className={`flex size-full items-center rounded-[8px] ${option.content ? "" : "hover:bg-[#63748D]"} `}>
						{option.content ? (
							<button type="button" onClick={(e) => handleOptionClick(e, option.onClick, close)} className="size-full">
								{option.content}
							</button>
						) : (
							<div className="flex size-full items-center justify-center gap-[12px]">
								<button
									type="button"
									className="flex size-full cursor-pointer items-center justify-center gap-2 p-[8px]"
									onClick={(e) => handleOptionClick(e, option.onClick, close)}
								>
									{option.image && <Image src={option.image} alt={option.text || "empty"} width={32} height={32} />}
									<p className={`full flex flex-grow ${!option.image && "justify-center"}`}>{option.text}</p>
								</button>
							</div>
						)}
						{option.options && option.options.length > 0 && (
							<Popover
								overlay={(subClose) =>
									recursive(option.options || [], () => {
										subClose();
										close();
									})
								}
								anchorOrigin={anchorOrigin}
								overlayOrigin={overlayOrigin}
							>
								<div className={`cursor-pointer ${option.options && option.options.length > 0 ? "block" : "hidden"}`}>
									<KebabIcon />
								</div>
							</Popover>
						)}
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="flex">
			<Popover overlay={(close) => recursive(options, close)} anchorOrigin={anchorOrigin} overlayOrigin={overlayOrigin} gapX={gapX} gapY={gapY}>
				<div className="cursor-pointer">{children}</div>
			</Popover>
		</div>
	);
}
