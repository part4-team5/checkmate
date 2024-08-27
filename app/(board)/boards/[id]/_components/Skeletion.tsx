interface SkeletonProps {
	className?: string;
	variant?: "rect" | "circle"; // 사각형 또는 원형
}

export default function Skeleton({ className, variant = "rect" }: SkeletonProps) {
	const baseStyle = "animate-pulse bg-gray-300";
	const variantStyle = variant === "circle" ? "rounded-full" : "rounded-md";

	return <div className={`${baseStyle} ${variantStyle} ${className}`} />;
}
