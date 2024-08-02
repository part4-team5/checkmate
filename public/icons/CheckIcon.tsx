/* eslint-disable react/require-default-props */

import React from "react";

function CheckIcon({ width, height, color = "#F8FAFC" }: { width: number | string; height: number | string; color?: string }) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

export default CheckIcon;
