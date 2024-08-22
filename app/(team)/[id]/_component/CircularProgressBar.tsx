"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface CircularProgressBarProps {
	percent: number;
	useGradient: boolean;
	strokeColor?: string;
	size?: number;
	strokeWidth?: number;
	backgroundColor?: string;
}

function CircularProgressBar({ percent, useGradient, strokeColor, size = 170, strokeWidth = 30, backgroundColor = "#334155" }: CircularProgressBarProps) {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const progressRef = useRef<SVGCircleElement | null>(null);
	const [isGlowing, setIsGlowing] = useState(false);

	const offset = useMemo(() => circumference - (percent / 100) * circumference, [percent, circumference]);

	useEffect(() => {
		setIsGlowing(true);
		const timer = setTimeout(() => setIsGlowing(false), 300);
		return () => clearTimeout(timer);
	}, [percent]);

	return (
		<div>
			<motion.svg
				className="circular-progress-bar"
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				animate={{
					scale: 1.0 + (percent === 100 ? 0.05 : 0.0),
				}}
				transition={{
					duration: 0.6,
					ease: "easeInOut",
				}}
			>
				{useGradient && (
					<defs>
						<linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%">
							<stop offset="0%" style={{ stopColor: "#10B981", stopOpacity: 1 }} />
							<stop offset="100%" style={{ stopColor: "#A3E635", stopOpacity: 1 }} />
						</linearGradient>
					</defs>
				)}

				<circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" stroke={backgroundColor} />
				<motion.circle
					ref={progressRef}
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeWidth={strokeWidth}
					fill="none"
					stroke={useGradient ? "url(#progressGradient)" : strokeColor}
					strokeDasharray={circumference}
					strokeDashoffset={circumference}
					strokeLinecap="round"
					animate={{
						strokeDashoffset: offset,
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
