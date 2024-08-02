interface IconProps {
	width: number;
	height: number;
	// eslint-disable-next-line react/require-default-props
	color?: string;
}

export default function ArrowLeftIcon({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M8.5347 12.7151C8.2346 12.3975 8.2346 11.9008 8.53469 11.5832L13.994 5.8047C14.506 5.26275 15.4171 5.6251 15.4171 6.37066V17.9276C15.4171 18.6732 14.506 19.0355 13.994 18.4936L8.5347 12.7151Z"
				fill={color}
			/>
		</svg>
	);
}
