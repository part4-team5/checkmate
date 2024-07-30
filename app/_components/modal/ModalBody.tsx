"use client";

type ModalBodyProps = {
	children: React.ReactNode;
	className?: string;
};

export default function ModalBody({ children, className = "" }: ModalBodyProps) {
	return <div className={className}>{children}</div>;
}
