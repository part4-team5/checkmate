export default function Mail({ width, height }: { width: number; height: number }) {
	return (
		<svg width={width} height={height} viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g filter="url(#filter0_d_362_52908)">
				<rect x="14" y="14" width="48" height="48" rx="12" fill="#1E293B" />
				<rect x="14.5" y="14.5" width="47" height="47" rx="11.5" stroke="#F8FAFC" strokeOpacity="0.1" />
			</g>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M29.0132 35.1513C29 35.6902 29 36.3021 29 37V39C29 41.8284 29 43.2426 29.8787 44.1213C30.7574 45 32.1716 45 35 45H41C43.8284 45 45.2426 45 46.1213 44.1213C47 43.2426 47 41.8284 47 39V37C47 36.3021 47 35.6902 46.9868 35.1513L38.9713 39.6044C38.3672 39.9399 37.6328 39.9399 37.0287 39.6044L29.0132 35.1513ZM29.243 33.0297C29.3258 33.0505 29.4074 33.0824 29.4856 33.1258L38 37.856L46.5144 33.1258C46.5926 33.0824 46.6742 33.0505 46.757 33.0297C46.6271 32.5562 46.4276 32.1849 46.1213 31.8787C45.2426 31 43.8284 31 41 31H35C32.1716 31 30.7574 31 29.8787 31.8787C29.5724 32.1849 29.3729 32.5562 29.243 33.0297Z"
				fill="url(#paint0_linear_362_52908)"
			/>
			<defs>
				<filter id="filter0_d_362_52908" x="0" y="0" width={width} height={height} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
					<feMorphology radius="2" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_362_52908" />
					<feOffset />
					<feGaussianBlur stdDeviation="6" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_362_52908" />
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_362_52908" result="shape" />
				</filter>
				<linearGradient id="paint0_linear_362_52908" x1="29" y1="38" x2="47" y2="38" gradientUnits="userSpaceOnUse">
					<stop stopColor="#10B981" />
					<stop offset="1" stopColor="#A3E635" />
				</linearGradient>
			</defs>
		</svg>
	);
}
