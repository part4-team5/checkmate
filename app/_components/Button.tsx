/* eslint-disable no-nested-ternary */

"use client";

import { MouseEvent, PropsWithChildren } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface ButtonProps extends PropsWithChildren {
	id?: string;
	variant?: "primary" | "secondary" | "white" | "outline" | "danger";
	fontSize?: "xl" | "lg" | "md";
	rounded?: "full" | "xl";
	href?: string;
	type?: "button" | "submit" | "reset";
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
}

/**
 * 재사용 가능한 버튼 컴포넌트로, 링크 또는 버튼 엘리먼트로 사용할 수 있습니다.
 *
 * @param {ButtonProps} props - 버튼 컴포넌트의 속성들.
 * @param {*} props.children - 버튼 내부에 표시될 내용.
 * @param {("primary" | "secondary" | "white" | "outline" | "danger")} [props.variant="primary"] - 버튼의 종류.
 * @param {("lg" | "md" | "xl")} [props.fontSize="lg"] - 버튼 텍스트의 폰트 크기.
 * @param {("full" | "xl")} [props.rounded="xl"] - 버튼의 테두리 반경.
 * @param {string} [props.href] - 버튼이 링크로 사용될 경우의 URL.
 * @param {("button" | "submit" | "reset")} [props.type="button"] - 버튼의 타입.
 * @param {(e: MouseEvent<HTMLButtonElement>) => void} [props.onClick] - 버튼 클릭 이벤트 핸들러.
 * @param {boolean} [props.disabled=false] - 버튼 비활성화 여부.
 * @returns {JSX.Element} 주어진 속성에 따라 스타일링된 버튼 또는 링크 엘리먼트를 반환합니다.
 */
export default function Button({
	id,
	children,
	variant = "primary",
	fontSize = "lg",
	rounded = "xl",
	href,
	type = "button",
	onClick,
	disabled = false,
}: ButtonProps) {
	let btnVariant = "";

	switch (variant) {
		case "primary":
			btnVariant =
				"flex items-center justify-center bg-brand-primary font-semibold text-text-inverse hover:bg-interaction-hover active:bg-interaction-pressed disabled:bg-interaction-inactive shadow-loginButton disabled:shadow-buttonPrimary";
			break;
		case "secondary":
			btnVariant =
				"flex items-center justify-center border-2 border-brand-primary bg-background-inverse font-semibold text-brand-primary hover:border-interaction-hover hover:text-interaction-hover active:border-interaction-pressed active:text-interaction-pressed disabled:border-interaction-inactive disabled:text-interaction-inactive";
			break;
		case "white":
			btnVariant = "flex items-center justify-center border-2 border-text-secondary bg-background-inverse font-semibold text-text-default";
			break;
		case "outline":
			btnVariant =
				"flex items-center justify-center border-2 border-brand-primary bg-transparent font-semibold text-brand-primary hover:border-interaction-hover hover:text-interaction-hover active:border-interaction-pressed active:text-interaction-pressed disabled:border-interaction-inactive disabled:text-interaction-inactive";
			break;
		case "danger":
			btnVariant = "flex items-center justify-center bg-status-danger font-semibold text-text-inverse hover:bg-status-danger/80";
			break;
		default:
			btnVariant =
				"flex items-center justify-center bg-brand-primary font-semibold text-text-inverse hover:bg-interaction-hover active:bg-interaction-pressed disabled:bg-interaction-inactive";
			break;
	}

	btnVariant += rounded === "full" ? " rounded-full" : " rounded-xl";

	btnVariant += fontSize === "xl" ? " text-xl" : fontSize === "md" ? " text-md" : " text-lg";

	const btnStyle = `${btnVariant} py-2 transition-all duration-150 size-full`;

	const MotionLink = motion(Link);

	if (href) {
		return (
			<MotionLink id={id} className={btnStyle} href={href} whileTap={{ scale: 0.8 }}>
				{children}
			</MotionLink>
		);
	}

	return (
		<motion.button id={id} type={type} className={btnStyle} onClick={onClick} disabled={disabled} whileTap={{ scale: 0.8 }}>
			{children}
		</motion.button>
	);
}
