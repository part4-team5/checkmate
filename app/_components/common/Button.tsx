/* eslint-disable indent */
/* eslint-disable react/require-default-props */

"use client";

import classNames from "classnames";
import Link from "next/link";
import { MouseEvent, PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren {
	className?: string;
	variant?: "primary" | "secondary" | "white" | "outline" | "danger";
	fontSize?: "lg" | "md";
	rounded?: "full" | "xl";
	href?: string;
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
}

/**
 * 재사용 가능한 버튼 컴포넌트로, 링크 또는 버튼 엘리먼트로 사용할 수 있습니다.
 *
 * @param {ButtonProps} props - 버튼 컴포넌트의 속성들.
 * @param {*} props.children - 버튼 내부에 표시될 내용.
 * @param {string} [props.className] - 버튼에 적용할 추가 커스텀 클래스 이름.
 * @param {("primary" | "secondary" | "white" | "outline" | "danger")} [props.variant="primary"] - 버튼의 종류.
 * @param {("lg" | "md")} [props.fontSize="lg"] - 버튼 텍스트의 폰트 크기.
 * @param {("full" | "xl")} [props.rounded="xl"] - 버튼의 테두리 반경.
 * @param {string} [props.href] - 버튼이 링크로 사용될 경우의 URL.
 * @param {(e: MouseEvent<HTMLButtonElement>) => void} [props.onClick=() => {}] - 버튼 클릭 이벤트 핸들러.
 * @param {boolean} [props.disabled=false] - 버튼 비활성화 여부.
 * @returns {JSX.Element} 주어진 속성에 따라 스타일링된 버튼 또는 링크 엘리먼트를 반환합니다.
 */
export default function Button({
	children,
	className,
	variant = "primary",
	fontSize = "lg",
	rounded = "xl",
	href,
	onClick = () => {},
	disabled = false,
}: ButtonProps) {
	const btnStyle = classNames(
		`btn-${variant}`,
		{
			"rounded-full": rounded === "full",
			"rounded-xl": rounded === "xl",
			"text-lg": fontSize === "lg",
			"text-md": fontSize === "md",
		},
		className,
	);

	if (href) {
		return (
			<Link className={btnStyle} href={href}>
				{children}
			</Link>
		);
	}

	return (
		<button type="button" className={btnStyle} onClick={onClick} disabled={disabled}>
			{children}
		</button>
	);
}
