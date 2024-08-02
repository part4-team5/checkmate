// eslint-disable-next-line react/require-default-props
export default function MenuIcon({ width, height, color = "#64748B" }: { width: number; height: number; color?: string }) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="3" y="6" width="18" height="2" rx="1" fill={color} />
			<rect x="3" y="11" width="18" height="2" rx="1" fill={color} />
			<rect x="3" y="16" width="18" height="2" rx="1" fill={color} />
		</svg>
	);
}
