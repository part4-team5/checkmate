"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CircularProgressBarProps {
	percent: number;
}

function CircularProgressBar({ percent }: CircularProgressBarProps) {
	const progressRef = useRef<SVGCircleElement | null>(null);
	const [isGlowing, setIsGlowing] = useState(false);

	const radius = 70;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percent / 100) * circumference;

	useEffect(() => {
		// 막대바가 차오를 때 빛나게 설정
		setIsGlowing(true);
		// 300ms 후 빛남 효과 제거
		const timer = setTimeout(() => setIsGlowing(false), 300);
		// 컴포넌트 언마운트 시 타이머 클리어
		return () => clearTimeout(timer);
	}, [percent]);

	return (
		<div>
			<motion.svg
				className="circular-progress-bar"
				width="170"
				height="170"
				viewBox="0 0 170 170"
				animate={{
					// 100%일 때 5% 확대
					scale: percent === 100 ? 1.05 : 1,
				}}
				transition={{
					duration: 0.6,
					ease: "easeInOut",
				}}
			>
				<defs>
					<linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%">
						<stop offset="0%" style={{ stopColor: "#10B981", stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: "#A3E635", stopOpacity: 1 }} />
					</linearGradient>
				</defs>

				<circle cx="85" cy="85" r="70" strokeWidth="30" fill="none" stroke="#334155" />
				<motion.circle
					ref={progressRef}
					cx="85"
					cy="85"
					r="70"
					strokeWidth="30"
					fill="none"
					stroke="url(#progressGradient)"
					strokeDasharray={circumference}
					strokeDashoffset={circumference}
					strokeLinecap="round"
					animate={{
						strokeDashoffset: offset,
						// 막대바가 차오를 때만 빛남
						filter: isGlowing ? "brightness(1.2)" : "brightness(1)",
					}}
					transition={{
						duration: 0.3,
						ease: "easeInOut",
					}}
				/>
			</motion.svg>
		</div>
	);
}

export default CircularProgressBar;
