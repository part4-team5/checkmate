import React from "react";
import Image from "next/image";
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
	icon?: React.ReactNode;
	content?: React.ReactNode;
	styles?: string;
	options?: Option[];
	anchorOrigin?: Origin;
	overlayOrigin?: Origin;
	gapX?: number;
	gapY?: number;
};

interface DropDownProps {
	options: Option[];
	children: React.ReactNode;
	anchorOrigin?: Origin;
	overlayOrigin?: Origin;
	gapX?: number;
	gapY?: number;
}

export default function DropDown({ options, children, anchorOrigin, overlayOrigin, gapX, gapY }: DropDownProps) {
	function handleOptionClick(e: React.MouseEvent | React.KeyboardEvent, onClick?: () => void) {
		if (onClick) {
			onClick();
		} else {
			console.log("로직 추가하시면 됩니다"); // eslint-disable-line no-console
		}
	}

	/**
	 * @param items - 드롭다운 옵션 목록
	 */
	function recursive(items: Option[], close: () => void, parentAnchorOrigin?: Origin, parentOverlayOrigin?: Origin, parentGapX?: number, parentGapY?: number) {
		const [styleOptions, ...restOptions] = items;

		/** containerStyles 설정 */
		let containerStyles = "";
		if (restOptions.some((option) => option.image)) {
			containerStyles = `p-[16px] space-y-2 ${styleOptions?.styles || ""}`;
		} else {
			containerStyles = `${styleOptions?.styles || ""}`;
		}

		/** anchorOrigin 설정 */
		const recursiveAnchorOrigin = styleOptions.anchorOrigin || parentAnchorOrigin || anchorOrigin || { vertical: "bottom", horizontal: "left" };

		/** overlayOrigin 설정 */
		const recursiveOverlayOrigin = styleOptions.overlayOrigin || parentOverlayOrigin || overlayOrigin || { vertical: "top", horizontal: "left" };

		/** gapX 설정 */
		let recursiveGapX = 0;
		if (styleOptions.gapX !== undefined) {
			recursiveGapX = styleOptions.gapX;
		} else if (parentGapX !== undefined) {
			recursiveGapX = parentGapX;
		} else if (gapX !== undefined) {
			recursiveGapX = gapX;
		}

		/** gapY 설정 */
		let recursiveGapY = 0;
		if (styleOptions.gapY !== undefined) {
			recursiveGapY = styleOptions.gapY;
		} else if (parentGapY !== undefined) {
			recursiveGapY = parentGapY;
		} else if (gapY !== undefined) {
			recursiveGapY = gapY;
		}

		return (
			<div className={`rounded-[12px] border border-white border-opacity-5 bg-background-secondary text-[#F8FAFC] ${containerStyles}`}>
				{restOptions.map((option, index) => {
					let justifyClass = "justify-center";

					if (option.image && option.icon) {
						justifyClass = "justify-between";
					} else if (option.image) {
						justifyClass = "justify-start";
					}

					return (
						<div
							key={option.text || index}
							className={`flex items-center ${justifyClass} rounded-[8px] p-[8px] ${option.content ? "" : "hover:bg-[#63748D]"} ${option.styles || ""}`}
						>
							<div className="flex items-center justify-center gap-[12px]">
								{option.image && <Image src={option.image} alt={option.text || ""} />}
								<button
									type="button"
									className="cursor-pointer"
									onClick={(e) => {
										handleOptionClick(e, option.onClick);
										close();
									}}
									tabIndex={0}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											handleOptionClick(e, option.onClick);
											close();
										}
									}}
								>
									{option.text}
								</button>
							</div>
							{option.icon && option.options && (
								<Popover
									overlay={() => recursive(option.options!, close, recursiveAnchorOrigin, recursiveOverlayOrigin, recursiveGapX, recursiveGapY)}
									onOpen={() => console.log("짜잔")} // eslint-disable-line no-console
									anchorOrigin={recursiveAnchorOrigin}
									overlayOrigin={recursiveOverlayOrigin}
									gapX={recursiveGapX}
									gapY={recursiveGapY}
								>
									<div className="ml-auto cursor-pointer">{option.icon}</div>
								</Popover>
							)}
							{option.content && <div>{option.content}</div>}
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div>
			<Popover
				overlay={(close) => recursive(options, close, anchorOrigin, overlayOrigin, gapX, gapY)}
				anchorOrigin={anchorOrigin || { vertical: "bottom", horizontal: "left" }}
				overlayOrigin={overlayOrigin || { vertical: "top", horizontal: "left" }}
				gapX={gapX || 0}
				gapY={gapY || 0}
			>
				<div className="cursor-pointer">{children}</div>
			</Popover>
		</div>
	);
}

/** 기본 props 설정 */
DropDown.defaultProps = {
	anchorOrigin: { vertical: "bottom", horizontal: "left" },
	overlayOrigin: { vertical: "top", horizontal: "left" },
	gapX: 0,
	gapY: 0,
};
