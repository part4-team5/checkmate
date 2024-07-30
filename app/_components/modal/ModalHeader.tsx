type ModalHeaderProps = {
	title: string;
	children?: React.ReactNode;
	textAlign?: "left" | "center" | "right";
};

/**
 * title: 헤더의 제목 children: 헤더의 설명
 *  모달의 머릿말을 표시하는 컴포넌트
 *  @example
 * <ModalHeader title="제목" textAlign="center">부가 설명란</ModalHeader>
 */
export default function ModalHeader({ title, children, textAlign = "center" }: ModalHeaderProps) {
	const align = `text-${textAlign}`;
	return (
		<div>
			<h1 className={`mb-2 ${align} text-lg`}>{title}</h1>
			<p className="mx-auto mb-6 max-w-[227px] text-center text-xs font-medium">{children}</p>
		</div>
	);
}
