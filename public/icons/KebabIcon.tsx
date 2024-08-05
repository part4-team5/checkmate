/* eslint-disable react/require-default-props */

import React from "react";

interface KebabIconProps {
	color?: string;
}

function KebabIcon({ color = "#64748B" }: KebabIconProps) {
	return (
		<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="8" cy="5" r="1" fill={color} />
			<circle cx="8" cy="8" r="1" fill={color} />
			<circle cx="8" cy="11" r="1" fill={color} />
		</svg>
	);
}

export default KebabIcon;
