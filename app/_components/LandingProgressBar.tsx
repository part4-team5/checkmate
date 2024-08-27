"use client";

import CircularProgressBar from "@/app/(team)/[id]/_component/CircularProgressBar";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";
import { useState, useRef } from "react";
import Icon from "@/app/_icons";

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
			const x = e.clientX - rect.left - 13;
			const y = e.clientY - rect.top - 662;

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
			className="relative -ml-[60px] h-full max-h-[630px] grow cursor-none rounded-[20px] border-2 border-landing-border bg-landing-quinary"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onMouseMove={handleMouseMove}
			ref={containerRef}
		>
			<div className="absolute left-8 top-[10px] size-3 rounded-full bg-status-danger" />
			<div className="absolute left-16 top-[10px] size-3 rounded-full bg-point-yellow" />
			<div className="absolute left-24 top-[10px] size-3 rounded-full bg-brand-primary" />

			<div className="h-[34px] w-full border-b-2 border-landing-border" />

			<div className="flex size-full flex-col items-center justify-center">
				<CircularProgressBar
					percent={progress * 100}
					useGradient={false}
					size={360}
					strokeWidth={60}
					strokeColor="#10b981"
					backgroundColor="var(--landing-Septenary)"
					borderWidth={2}
					borderColor="#10b981"
				/>

				<div className="pt-12" />

				<div className="flex gap-7">
					{buttonStates.map((isVisible, index) => (
						<button
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							type="button"
							aria-label={`check-${index}`}
							className="relative min-h-[58px] min-w-[64px] cursor-none rounded-xl bg-landing-Senary"
							onClick={() => handleClick(index)}
						>
							{isVisible && (
								<div className="absolute bottom-5">
									<Image src="/icons/landingCheck.svg" alt="check" width={100} height={100} />
								</div>
							)}
							{index === 2 && !buttonStates[2] && (
								<motion.div
									className="absolute left-0 top-[-20px] w-full text-center text-sm font-semibold text-white"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
								>
									Click Here
								</motion.div>
							)}
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
						width: 78,
						height: 78,
					}}
				>
					<Icon.Pointer width={78} height={78} />
				</motion.div>
			)}
		</motion.div>
	);
}
