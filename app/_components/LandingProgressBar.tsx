"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

import Icon from "@/app/_icons";

import CircularProgressBar from "@/app/(team)/[id]/_components/CircularProgressBar";

export default function LandingProgressBar() {
	const [isHovered, setIsHovered] = useState(false);
	const [buttonStates, setButtonStates] = useState([true, true, false, false, false, false]);
	const [progress, setProgress] = useState(2 / 6);

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const containerRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const container = containerRef.current;
		if (container) {
			const rect = container.getBoundingClientRect();
			const x = e.clientX - rect.left - 20;
			const y = e.clientY - rect.top - 610;

			mouseX.set(x);
			mouseY.set(y);
		}
	};

	const handleClick = (index: number) => {
		setButtonStates((prevStates) => {
			const newStates = [...prevStates];
			newStates[index] = !newStates[index];

			const newProgress = newStates.filter((state) => state).length / newStates.length;

			setProgress(newProgress);
			return newStates;
		});
	};

	return (
		<motion.div
			className="relative grow cursor-none rounded-[20px] bg-landing-quinary"
			style={{ boxShadow: "12px 12px 16px 0px rgba(93, 97, 100, 0.02)" }}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onMouseMove={handleMouseMove}
			ref={containerRef}
		>
			<div className="relative flex h-[45px] w-full items-center gap-[12px] overflow-hidden rounded-[20px_20px_0_0] bg-landing-secondary px-[26px]">
				<div className="size-3 rounded-full bg-status-danger" />
				<div className="size-3 rounded-full bg-point-yellow" />
				<div className="size-3 rounded-full bg-brand-primary" />
			</div>

			<div className="flex flex-col items-center justify-center gap-[30px] py-[80px]">
				<CircularProgressBar percent={progress * 100} useGradient size={260} strokeWidth={60} strokeColor="#10b981" backgroundColor="#d1d1d1" />

				<div className="mt-[10px] text-lg font-medium text-text-secondary">
					오늘 할 일을 <b className="text-brand-primary">체크</b>해보세요!
				</div>

				<div className="flex gap-6">
					{buttonStates.map((isVisible, index) => (
						<button
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							type="button"
							aria-label={`check-${index}`}
							className={`${isVisible ? "border-brand-primary" : "border-landing-Senary"} relative h-[42px] w-[42px] cursor-none rounded-[10px] border-2`}
							onClick={() => handleClick(index)}
						>
							{isVisible && (
								<div className="absolute inset-0">
									<Icon.Check width={40} height={40} color="#10b981" />
								</div>
							)}
							{/* {index === 2 && !buttonStates[2] && (
								<motion.div
									className="absolute left-0 top-[-20px] w-full text-center text-sm font-semibold text-white"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
								>
									Click Here
								</motion.div>
							)} */}
						</button>
					))}
				</div>
			</div>
			{isHovered && (
				<motion.div
					className="pointer-events-none absolute"
					style={{
						x: mouseX,
						y: mouseY,
						width: 60,
						height: 60,
					}}
				>
					<Icon.Pointer width={60} height={60} />
				</motion.div>
			)}
		</motion.div>
	);
}
