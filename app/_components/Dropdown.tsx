/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/jsx-props-no-spreading */

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import KebabIcon from "@/public/icons/KebabIcon";
import Popover from "./Popover";

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
	align?: "LR" | "CC" | "RL" | "LL" | "RR";
	gapX?: number;
	gapY?: number;
}

export default function DropDown({ options, children, align = "LR", gapX = 0, gapY = 0 }: DropDownProps) {
	const menuRefs = useRef<HTMLDivElement[]>([]); // 메뉴 항목 참조 배열
	const addButtonRef = useRef<HTMLButtonElement>(null); // 팀 추가 버튼 참조
	const router = useRouter();

	// 키보드 이동 기능 추가
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const currentIndex = menuRefs.current.findIndex((ref) => ref === document.activeElement);

			if (event.key === "ArrowDown") {
				// 아래로 이동
				event.preventDefault();
				if (currentIndex === menuRefs.current.length - 1) {
					addButtonRef.current?.focus(); // 마지막 메뉴에서 버튼으로 이동
				} else {
					const nextIndex = (currentIndex + 1) % menuRefs.current.length;
					menuRefs.current[nextIndex]?.focus();
				}
			} else if (event.key === "ArrowUp") {
				// 위로 이동
				event.preventDefault();
				if (document.activeElement === addButtonRef.current) {
					menuRefs.current[menuRefs.current.length - 1]?.focus(); // 버튼에서 마지막 메뉴로 이동
				} else {
					const prevIndex = (currentIndex - 1 + menuRefs.current.length) % menuRefs.current.length;
					menuRefs.current[prevIndex]?.focus();
				}
			} else if (event.key === "Enter") {
				// Enter 키를 눌렀을 때 현재 항목을 선택
				event.preventDefault();
				(document.activeElement as HTMLElement)?.click();
			} else if (event.key === "Escape") {
				// Escape 키로 메뉴 닫기
				event.preventDefault();
				menuRefs.current[currentIndex]?.blur();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	function handleOptionClick(e: React.MouseEvent, onClick?: () => void, close?: () => void) {
		if (onClick) {
			onClick();
		}
		if (close) {
			close();
		}
	}

	function getPopoverOrigins() {
		switch (align) {
			case "LR":
				return {
					anchorOrigin: { vertical: "bottom" as const, horizontal: "left" as const },
					overlayOrigin: { vertical: "top" as const, horizontal: "right" as const },
				};
			case "CC":
				return {
					anchorOrigin: { vertical: "bottom" as const, horizontal: "center" as const },
					overlayOrigin: { vertical: "top" as const, horizontal: "center" as const },
				};
			case "RL":
				return {
					anchorOrigin: { vertical: "bottom" as const, horizontal: "right" as const },
					overlayOrigin: { vertical: "top" as const, horizontal: "left" as const },
				};
			case "LL":
				return {
					anchorOrigin: { vertical: "bottom" as const, horizontal: "left" as const },
					overlayOrigin: { vertical: "top" as const, horizontal: "left" as const },
				};
			case "RR":
				return {
					anchorOrigin: { vertical: "bottom" as const, horizontal: "right" as const },
					overlayOrigin: { vertical: "top" as const, horizontal: "right" as const },
				};
			default:
				return {
					anchorOrigin: { vertical: "bottom" as const, horizontal: "left" as const },
					overlayOrigin: { vertical: "top" as const, horizontal: "right" as const },
				};
		}
	}

	function recursive(items: Option[], close: () => void) {
		return (
			<div className="flex w-max min-w-[120px] flex-col rounded-[12px] border border-white border-opacity-5 bg-background-secondary text-[#F8FAFC]">
				<div
					className={`flex max-h-[308px] flex-col overflow-y-auto scrollbar:w-2 scrollbar:bg-background-primary scrollbar-thumb:bg-background-tertiary ${items.some((option) => option.image) ? "mt-2 space-y-2 p-[16px]" : ""}`}
				>
					{items.map((option, index) => (
						<div
							key={`${option.text} ${index}` || index}
							className="flex size-full items-center rounded-[8px] hover:bg-[#63748D] focus:bg-[#475569] focus:outline-none"
							tabIndex={0}
							ref={(el) => {
								menuRefs.current[index] = el!; // menuRefs.current[index]에 DOM 요소 참조를 저장
							}}
							onClick={(e) => handleOptionClick(e, option.onClick, close)}
						>
							<div className={`flex size-full items-center ${option.image ? "justify-start" : "justify-center"} gap-[12px]`}>
								<button type="button" className="flex max-w-[220px] cursor-pointer items-center justify-start gap-2 p-[8px]">
									{/* 이미지가 있는 경우 이미지를 렌더링 */}
									{option.image && (
										<div className="flex-shrink-0">
											<Image src={option.image} alt={option.text || "empty"} width={32} height={32} />
										</div>
									)}
									<p className="flex-grow truncate text-left">{option.text}</p>
								</button>
							</div>
							{/* 하위 옵션이 있는 경우 Popover를 렌더링 */}
							{option.options && option.options.length > 0 && (
								<Popover
									overlay={(subClose) =>
										recursive(option.options || [], () => {
											subClose();
											close();
										})
									}
									{...getPopoverOrigins()}
									gapX={gapX}
									gapY={gapY}
								>
									<div className={`cursor-pointer ${option.options && option.options.length > 0 ? "block" : "hidden"}`}>
										<KebabIcon />
									</div>
								</Popover>
							)}
						</div>
					))}
				</div>

				{/* 배열의 끝에 이미지를 가진 옵션이 있을 경우, 스크롤 영역 바깥에 추가 버튼을 렌더링 */}
				{items.some((option) => option.image) && (
					<div className="flex size-full items-center justify-center gap-[12px]">
						<button
							type="button"
							ref={addButtonRef}
							tabIndex={0}
							className="mx-[16px] mb-[16px] flex size-full h-[48px] cursor-pointer items-center justify-center rounded-[12px] border px-[47px] text-[16px] hover:bg-[#63748D] focus:bg-[#475569] focus:outline-none"
							onClick={() => {
								router.push("/create-team");
							}}
						>
							+ 팀 추가하기
						</button>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="flex">
			<Popover overlay={(close) => recursive(options, close)} {...getPopoverOrigins()} gapX={gapX} gapY={gapY}>
				<div className="cursor-pointer">{children}</div>
			</Popover>
		</div>
	);
}
