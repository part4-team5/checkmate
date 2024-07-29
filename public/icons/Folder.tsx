export default function Folder({ width, height }: { width: number; height: number }) {
	return (
		<svg width={width} height={height} viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g filter="url(#filter0_d_591_18672)">
				<rect x="14" y="14" width="48" height="48" rx="12" fill="#1E293B" />
				<rect x="14.5" y="14.5" width="47" height="47" rx="11.5" stroke="#F8FAFC" strokeOpacity="0.1" />
			</g>
			<path
				d="M29 34H42.2C43.8802 34 44.7202 34 45.362 34.327C45.9265 34.6146 46.3854 35.0735 46.673 35.638C47 36.2798 47 37.1198 47 38.8V40.2C47 41.8802 47 42.7202 46.673 43.362C46.3854 43.9265 45.9265 44.3854 45.362 44.673C44.7202 45 43.8802 45 42.2 45H33.8C32.1198 45 31.2798 45 30.638 44.673C30.0735 44.3854 29.6146 43.9265 29.327 43.362C29 42.7202 29 41.8802 29 40.2V34Z"
				fill="url(#paint0_linear_591_18672)"
			/>
			<path
				d="M29 34C29 33.0681 29 32.6022 29.1522 32.2346C29.3552 31.7446 29.7446 31.3552 30.2346 31.1522C30.6022 31 31.0681 31 32 31H34.3431C35.1606 31 35.5694 31 35.9369 31.1522C36.3045 31.3045 36.5935 31.5935 37.1716 32.1716L39 34H29Z"
				fill="url(#paint1_linear_591_18672)"
			/>
			<defs>
				<filter id="filter0_d_591_18672" x="0" y="0" width="76" height="76" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
					<feMorphology radius="2" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_591_18672" />
					<feOffset />
					<feGaussianBlur stdDeviation="6" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_591_18672" />
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_591_18672" result="shape" />
				</filter>
				<linearGradient id="paint0_linear_591_18672" x1="29" y1="39.5" x2="47" y2="39.5" gradientUnits="userSpaceOnUse">
					<stop stopColor="#10B981" />
					<stop offset="1" stopColor="#A3E635" />
				</linearGradient>
				<linearGradient id="paint1_linear_591_18672" x1="29" y1="32.5" x2="39" y2="32.5" gradientUnits="userSpaceOnUse">
					<stop stopColor="#10B981" />
					<stop offset="1" stopColor="#A3E635" />
				</linearGradient>
			</defs>
		</svg>
	);
}
