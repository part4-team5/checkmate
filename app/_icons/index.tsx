interface IconProps {
	width: number | string;
	height: number | string;
	// eslint-disable-next-line react/require-default-props
	color?: string;
}

export default function Icon() {
	throw new Error();
}

Icon.Close = function Close({ width, height, color = "#64748B" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

Icon.Toggle = function Toggle({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12.7151 15.4653C12.3975 15.7654 11.9008 15.7654 11.5832 15.4653L5.8047 10.006C5.26275 9.49404 5.6251 8.58286 6.37066 8.58286L17.9276 8.58286C18.6732 8.58286 19.0355 9.49404 18.4936 10.006L12.7151 15.4653Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Visible = function Visible({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12.0031 15.5769C13.1362 15.5769 14.0985 15.1803 14.8902 14.3871C15.6819 13.5939 16.0777 12.6308 16.0777 11.4977C16.0777 10.3646 15.6811 9.40224 14.888 8.61058C14.0948 7.81891 13.1316 7.42308 11.9985 7.42308C10.8655 7.42308 9.90308 7.81966 9.11141 8.61282C8.31975 9.40601 7.92391 10.3692 7.92391 11.5023C7.92391 12.6353 8.3205 13.5977 9.11366 14.3894C9.90685 15.181 10.87 15.5769 12.0031 15.5769ZM12.0008 14.2C11.2508 14.2 10.6133 13.9375 10.0883 13.4125C9.56331 12.8875 9.30081 12.25 9.30081 11.5C9.30081 10.75 9.56331 10.1125 10.0883 9.58748C10.6133 9.06248 11.2508 8.79998 12.0008 8.79998C12.7508 8.79998 13.3883 9.06248 13.9133 9.58748C14.4383 10.1125 14.7008 10.75 14.7008 11.5C14.7008 12.25 14.4383 12.8875 13.9133 13.4125C13.3883 13.9375 12.7508 14.2 12.0008 14.2ZM12.0008 18.5C9.8957 18.5 7.97039 17.9384 6.22489 16.8153C4.47937 15.6923 3.0861 14.2147 2.04509 12.3827C1.96175 12.2391 1.90085 12.0944 1.86239 11.9485C1.82392 11.8027 1.80469 11.653 1.80469 11.4995C1.80469 11.346 1.82392 11.1965 1.86239 11.051C1.90085 10.9054 1.96175 10.7609 2.04509 10.6173C3.0861 8.78525 4.47937 7.30769 6.22489 6.18463C7.97039 5.06154 9.8957 4.5 12.0008 4.5C14.1059 4.5 16.0312 5.06154 17.7767 6.18463C19.5223 7.30769 20.9155 8.78525 21.9565 10.6173C22.0399 10.7609 22.1008 10.9056 22.1392 11.0514C22.1777 11.1973 22.1969 11.347 22.1969 11.5005C22.1969 11.654 22.1777 11.8035 22.1392 11.949C22.1008 12.0945 22.0399 12.2391 21.9565 12.3827C20.9155 14.2147 19.5223 15.6923 17.7767 16.8153C16.0312 17.9384 14.1059 18.5 12.0008 18.5ZM12.0008 17C13.8841 17 15.6133 16.5041 17.1883 15.5125C18.7633 14.5208 19.9675 13.1833 20.8008 11.5C19.9675 9.81664 18.7633 8.47914 17.1883 7.48748C15.6133 6.49581 13.8841 5.99998 12.0008 5.99998C10.1175 5.99998 8.38831 6.49581 6.81331 7.48748C5.23831 8.47914 4.03415 9.81664 3.20081 11.5C4.03415 13.1833 5.23831 14.5208 6.81331 15.5125C8.38831 16.5041 10.1175 17 12.0008 17Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Invisible = function Invisible({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M15.7736 12.9729L14.6506 11.8499C14.8211 10.9601 14.5871 10.2012 13.9486 9.57296C13.3102 8.94476 12.5441 8.70374 11.6506 8.84989L10.5275 7.72684C10.7596 7.61914 10.9983 7.54157 11.2438 7.49414C11.4894 7.44671 11.7416 7.42299 12.0006 7.42299C13.1352 7.42299 14.0983 7.81882 14.89 8.61049C15.6816 9.40216 16.0775 10.3653 16.0775 11.4999C16.0775 11.7589 16.0553 12.0111 16.0111 12.2566C15.9669 12.5021 15.8877 12.7409 15.7736 12.9729ZM18.9544 16.0845L17.8506 15.0499C18.4839 14.5666 19.0506 14.0291 19.5506 13.4374C20.0506 12.8457 20.4672 12.1999 20.8006 11.4999C19.9672 9.81656 18.7631 8.47906 17.1881 7.48739C15.6131 6.49572 13.8839 5.99989 12.0006 5.99989C11.5172 5.99989 11.0464 6.03322 10.5881 6.09989C10.1297 6.16656 9.66723 6.26656 9.20056 6.39989L8.03521 5.23454C8.6711 4.98326 9.31949 4.798 9.98039 4.67877C10.6413 4.55953 11.3147 4.49991 12.0006 4.49991C14.1493 4.49991 16.123 5.05825 17.9217 6.17491C19.7204 7.29158 21.1037 8.80247 22.0717 10.7076C22.1384 10.8345 22.1867 10.9624 22.2169 11.0912C22.247 11.2201 22.2621 11.3563 22.2621 11.4999C22.2621 11.6435 22.2496 11.7797 22.2246 11.9085C22.1996 12.0374 22.1537 12.1653 22.0871 12.2922C21.7332 13.0448 21.289 13.7396 20.7544 14.3768C20.2198 15.014 19.6198 15.5832 18.9544 16.0845ZM12.0006 18.4999C9.89545 18.4999 7.96597 17.9374 6.21214 16.8124C4.45829 15.6874 3.06405 14.2056 2.02944 12.3672C1.9461 12.2403 1.88521 12.1025 1.84676 11.9537C1.8083 11.805 1.78906 11.6537 1.78906 11.4999C1.78906 11.346 1.80573 11.1973 1.83906 11.0537C1.8724 10.9102 1.93073 10.7698 2.01406 10.6326C2.38586 9.95311 2.80702 9.30599 3.27754 8.69124C3.74805 8.07649 4.28908 7.52553 4.90061 7.03837L2.64291 4.76526C2.50445 4.61655 2.43618 4.43995 2.43811 4.23546C2.44003 4.03098 2.51342 3.85631 2.65829 3.71144C2.80315 3.56657 2.9788 3.49414 3.18521 3.49414C3.39161 3.49414 3.56725 3.56657 3.71211 3.71144L20.289 20.2883C20.4275 20.4268 20.5009 20.5983 20.5092 20.8027C20.5175 21.0072 20.4441 21.187 20.289 21.3422C20.1441 21.487 19.9685 21.5595 19.7621 21.5595C19.5557 21.5595 19.3801 21.487 19.2352 21.3422L15.716 17.8537C15.1262 18.0819 14.5201 18.2467 13.8977 18.3479C13.2753 18.4492 12.6429 18.4999 12.0006 18.4999ZM5.95444 8.09216C5.36854 8.54473 4.84193 9.0566 4.37461 9.62777C3.9073 10.1989 3.51595 10.823 3.20056 11.4999C4.0339 13.1832 5.23806 14.5207 6.81306 15.5124C8.38806 16.5041 10.1172 16.9999 12.0006 16.9999C12.4301 16.9999 12.8528 16.971 13.2689 16.9133C13.6849 16.8557 14.098 16.7666 14.5083 16.646L13.2429 15.3499C13.0403 15.4383 12.8381 15.4982 12.6361 15.5297C12.4342 15.5611 12.2224 15.5768 12.0006 15.5768C10.866 15.5768 9.90283 15.181 9.11116 14.3893C8.3195 13.5976 7.92366 12.6345 7.92366 11.4999C7.92366 11.2781 7.94097 11.0662 7.97559 10.8643C8.0102 10.6624 8.06854 10.4601 8.15059 10.2576L5.95444 8.09216Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Check = function Check({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 7.14286L6.90909 10L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

Icon.Alert = function Alert({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M12 16H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

Icon.Gear = function Gear({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M13.8744 22H10.1244C9.87436 22 9.65769 21.9167 9.47436 21.75C9.29103 21.5833 9.18269 21.375 9.14936 21.125L8.84936 18.8C8.63269 18.7167 8.42869 18.6167 8.23736 18.5C8.04536 18.3833 7.85769 18.2583 7.67436 18.125L5.49936 19.025C5.26603 19.1083 5.03269 19.1167 4.79936 19.05C4.56603 18.9833 4.38269 18.8417 4.24936 18.625L2.39936 15.4C2.26603 15.1833 2.22436 14.95 2.27436 14.7C2.32436 14.45 2.44936 14.25 2.64936 14.1L4.52436 12.675C4.50769 12.5583 4.49936 12.4457 4.49936 12.337V11.662C4.49936 11.554 4.50769 11.4417 4.52436 11.325L2.64936 9.9C2.44936 9.75 2.32436 9.55 2.27436 9.3C2.22436 9.05 2.26603 8.81667 2.39936 8.6L4.24936 5.375C4.36603 5.14167 4.54503 4.99567 4.78636 4.937C5.02836 4.879 5.26603 4.89167 5.49936 4.975L7.67436 5.875C7.85769 5.74167 8.04936 5.61667 8.24936 5.5C8.44936 5.38333 8.64936 5.28333 8.84936 5.2L9.14936 2.875C9.18269 2.625 9.29103 2.41667 9.47436 2.25C9.65769 2.08333 9.87436 2 10.1244 2H13.8744C14.1244 2 14.341 2.08333 14.5244 2.25C14.7077 2.41667 14.816 2.625 14.8494 2.875L15.1494 5.2C15.366 5.28333 15.5704 5.38333 15.7624 5.5C15.9537 5.61667 16.141 5.74167 16.3244 5.875L18.4994 4.975C18.7327 4.89167 18.966 4.88333 19.1994 4.95C19.4327 5.01667 19.616 5.15833 19.7494 5.375L21.5994 8.6C21.7327 8.81667 21.7744 9.05 21.7244 9.3C21.6744 9.55 21.5494 9.75 21.3494 9.9L19.4744 11.325C19.491 11.4417 19.4994 11.554 19.4994 11.662V12.337C19.4994 12.4457 19.4827 12.5583 19.4494 12.675L21.3244 14.1C21.5244 14.25 21.6494 14.45 21.6994 14.7C21.7494 14.95 21.7077 15.1833 21.5744 15.4L19.7244 18.6C19.591 18.8167 19.4037 18.9627 19.1624 19.038C18.9204 19.1127 18.6827 19.1083 18.4494 19.025L16.3244 18.125C16.141 18.2583 15.9494 18.3833 15.7494 18.5C15.5494 18.6167 15.3494 18.7167 15.1494 18.8L14.8494 21.125C14.816 21.375 14.7077 21.5833 14.5244 21.75C14.341 21.9167 14.1244 22 13.8744 22ZM12.0494 15.5C13.016 15.5 13.841 15.1583 14.5244 14.475C15.2077 13.7917 15.5494 12.9667 15.5494 12C15.5494 11.0333 15.2077 10.2083 14.5244 9.525C13.841 8.84167 13.016 8.5 12.0494 8.5C11.066 8.5 10.2367 8.84167 9.56136 9.525C8.88669 10.2083 8.54936 11.0333 8.54936 12C8.54936 12.9667 8.88669 13.7917 9.56136 14.475C10.2367 15.1583 11.066 15.5 12.0494 15.5Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Hamburger = function Hamburger({ width, height, color = "#64748B" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="3" y="6" width="18" height="2" rx="1" fill={color} />
			<rect x="3" y="11" width="18" height="2" rx="1" fill={color} />
			<rect x="3" y="16" width="18" height="2" rx="1" fill={color} />
		</svg>
	);
};

Icon.User = function User({ width, height, color = "#F8FAFC" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M13.3327 14V12.6667C13.3327 11.9594 13.0517 11.2811 12.5516 10.781C12.0515 10.281 11.3733 10 10.666 10H5.33268C4.62544 10 3.94716 10.281 3.44706 10.781C2.94697 11.2811 2.66602 11.9594 2.66602 12.6667V14"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8.00065 7.33333C9.47341 7.33333 10.6673 6.13943 10.6673 4.66667C10.6673 3.19391 9.47341 2 8.00065 2C6.52789 2 5.33398 3.19391 5.33398 4.66667C5.33398 6.13943 6.52789 7.33333 8.00065 7.33333Z"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="8.5" cy="4.5" r="2.5" fill={color} />
			<path d="M4 10H12L13.5 14.75H2.5L4 10Z" fill={color} />
		</svg>
	);
};

Icon.Search = function Search({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_2562_48083)">
				<circle cx="10.7541" cy="9.80566" r="6" transform="rotate(-45 10.7541 9.80566)" stroke="#F8FAFC" strokeWidth="2" />
				<path
					d="M18.3901 18.7554C18.7807 19.1459 19.4138 19.1459 19.8044 18.7554C20.1949 18.3649 20.1949 17.7317 19.8044 17.3412L18.3901 18.7554ZM14.1475 14.5128L18.3901 18.7554L19.8044 17.3412L15.5617 13.0986L14.1475 14.5128Z"
					fill={color}
				/>
			</g>
			<defs>
				<clipPath id="clip0_2562_48083">
					<rect width={width} height={height} fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

Icon.ArrowLeft = function ArrowLeft({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M10 4L6 8L10 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

Icon.ArrowRight = function ArrowRight({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6 12L10 8L6 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

Icon.ArrowDown = function ArrowDown({ width, height, color = "#F8FAFC" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

Icon.Kebab = function Kebab({ width, height, color }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="12" cy="7.5" r="1.5" fill={color} />
			<circle cx="12" cy="12" r="1.5" fill={color} />
			<circle cx="12" cy="16.5" r="1.5" fill={color} />
		</svg>
	);
};

Icon.Bold = function Bold({ width, height, color }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z" />
		</svg>
	);
};

Icon.Italic = function Italic({ width, height, color }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z" />
		</svg>
	);
};

Icon.Underline = function Underline({ width, height, color }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z" />
		</svg>
	);
};

Icon.StrikeThrough = function StrikeThrough({ width, height, color }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M80-400v-80h800v80H80Zm340-160v-120H200v-120h560v120H540v120H420Zm0 400v-160h120v160H420Z" />
		</svg>
	);
};

Icon.OrderedList = function OrderedList({ width, height, color }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z" />
		</svg>
	);
};

Icon.UnorderedList = function UnorderedList({ width, height, color }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z" />
		</svg>
	);
};

Icon.Photo = function Photo({ width, height, color }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm480-480v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM240-280h480L570-480 450-320l-90-120-120 160Zm-40-480v560-560Z" />
		</svg>
	);
};

Icon.LogoTypo = function LogoTypo({ width, height, color = "#10B981" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 163 32" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.93517 15.9652C2.98255 17.9178 2.98255 21.0837 4.93517 23.0363C6.88779 24.9889 10.0536 24.9889 12.0062 23.0363L12.0064 23.0362L12.0065 23.0363C13.9591 24.9889 17.1249 24.9889 19.0776 23.0363C21.0302 21.0837 21.0302 17.9178 19.0776 15.9652L19.0774 15.9651C21.0299 14.0125 21.0299 10.8467 19.0773 8.89415C17.1247 6.94157 13.959 6.94153 12.0064 8.89403C10.0537 6.94153 6.888 6.94157 4.93542 8.89415C2.98284 10.8467 2.98279 14.0125 4.93529 15.9651L4.93517 15.9652Z"
				fill={color}
			/>
			<path
				d="M40.5609 13.5469H37.4501C37.3933 13.1444 37.2773 12.7869 37.1021 12.4744C36.9269 12.1572 36.702 11.8873 36.4274 11.6648C36.1528 11.4422 35.8355 11.2718 35.4757 11.1534C35.1206 11.035 34.7347 10.9759 34.318 10.9759C33.5652 10.9759 32.9094 11.1629 32.3507 11.5369C31.792 11.9062 31.3587 12.446 31.051 13.1562C30.7432 13.8617 30.5893 14.7187 30.5893 15.7273C30.5893 16.7642 30.7432 17.6354 31.051 18.3409C31.3635 19.0464 31.7991 19.5791 32.3578 19.9389C32.9165 20.2988 33.5628 20.4787 34.2967 20.4787C34.7086 20.4787 35.0898 20.4242 35.4402 20.3153C35.7953 20.2064 36.1101 20.0478 36.3848 19.8395C36.6594 19.6264 36.8867 19.3684 37.0666 19.0653C37.2512 18.7623 37.3791 18.4167 37.4501 18.0284L40.5609 18.0426C40.4804 18.7102 40.2792 19.3542 39.9572 19.9744C39.64 20.59 39.2115 21.1416 38.6717 21.6293C38.1367 22.1122 37.4975 22.4957 36.7541 22.7798C36.0154 23.0592 35.1797 23.1989 34.247 23.1989C32.9496 23.1989 31.7896 22.9053 30.7669 22.3182C29.7489 21.7311 28.944 20.8812 28.3521 19.7685C27.765 18.6558 27.4714 17.3087 27.4714 15.7273C27.4714 14.1411 27.7697 12.7917 28.3663 11.679C28.9629 10.5663 29.7725 9.71875 30.7953 9.13636C31.818 8.54924 32.9686 8.25568 34.247 8.25568C35.0898 8.25568 35.871 8.37405 36.5907 8.6108C37.3152 8.84754 37.9567 9.19318 38.5154 9.64773C39.0742 10.0975 39.5287 10.6491 39.8791 11.3026C40.2342 11.956 40.4615 12.7041 40.5609 13.5469ZM56.1326 15.7273C56.1326 17.3134 55.832 18.6629 55.2306 19.7756C54.6341 20.8883 53.8197 21.7382 52.7875 22.3253C51.76 22.9077 50.6047 23.1989 49.3216 23.1989C48.0289 23.1989 46.8689 22.9053 45.8414 22.3182C44.814 21.7311 44.002 20.8812 43.4054 19.7685C42.8088 18.6558 42.5105 17.3087 42.5105 15.7273C42.5105 14.1411 42.8088 12.7917 43.4054 11.679C44.002 10.5663 44.814 9.71875 45.8414 9.13636C46.8689 8.54924 48.0289 8.25568 49.3216 8.25568C50.6047 8.25568 51.76 8.54924 52.7875 9.13636C53.8197 9.71875 54.6341 10.5663 55.2306 11.679C55.832 12.7917 56.1326 14.1411 56.1326 15.7273ZM53.0147 15.7273C53.0147 14.6998 52.8609 13.8333 52.5531 13.1278C52.2501 12.4223 51.8216 11.8873 51.2676 11.5227C50.7136 11.1581 50.0649 10.9759 49.3216 10.9759C48.5782 10.9759 47.9295 11.1581 47.3755 11.5227C46.8216 11.8873 46.3907 12.4223 46.0829 13.1278C45.7799 13.8333 45.6284 14.6998 45.6284 15.7273C45.6284 16.7547 45.7799 17.6212 46.0829 18.3267C46.3907 19.0322 46.8216 19.5672 47.3755 19.9318C47.9295 20.2964 48.5782 20.4787 49.3216 20.4787C50.0649 20.4787 50.7136 20.2964 51.2676 19.9318C51.8216 19.5672 52.2501 19.0322 52.5531 18.3267C52.8609 17.6212 53.0147 16.7547 53.0147 15.7273ZM61.138 23L56.976 8.45455H60.3354L62.7431 18.5611H62.8638L65.5201 8.45455H68.3965L71.0456 18.5824H71.1735L73.5811 8.45455H76.9405L72.7786 23H69.7814L67.0115 13.4901H66.8979L64.1351 23H61.138ZM91.1326 15.7273C91.1326 17.3134 90.832 18.6629 90.2306 19.7756C89.6341 20.8883 88.8197 21.7382 87.7875 22.3253C86.76 22.9077 85.6047 23.1989 84.3216 23.1989C83.0289 23.1989 81.8689 22.9053 80.8414 22.3182C79.814 21.7311 79.002 20.8812 78.4054 19.7685C77.8088 18.6558 77.5105 17.3087 77.5105 15.7273C77.5105 14.1411 77.8088 12.7917 78.4054 11.679C79.002 10.5663 79.814 9.71875 80.8414 9.13636C81.8689 8.54924 83.0289 8.25568 84.3216 8.25568C85.6047 8.25568 86.76 8.54924 87.7875 9.13636C88.8197 9.71875 89.6341 10.5663 90.2306 11.679C90.832 12.7917 91.1326 14.1411 91.1326 15.7273ZM88.0147 15.7273C88.0147 14.6998 87.8609 13.8333 87.5531 13.1278C87.2501 12.4223 86.8216 11.8873 86.2676 11.5227C85.7136 11.1581 85.0649 10.9759 84.3216 10.9759C83.5782 10.9759 82.9295 11.1581 82.3755 11.5227C81.8216 11.8873 81.3907 12.4223 81.0829 13.1278C80.7799 13.8333 80.6284 14.6998 80.6284 15.7273C80.6284 16.7547 80.7799 17.6212 81.0829 18.3267C81.3907 19.0322 81.8216 19.5672 82.3755 19.9318C82.9295 20.2964 83.5782 20.4787 84.3216 20.4787C85.0649 20.4787 85.7136 20.2964 86.2676 19.9318C86.8216 19.5672 87.2501 19.0322 87.5531 18.3267C87.8609 17.6212 88.0147 16.7547 88.0147 15.7273ZM93.4107 23V8.45455H99.1493C100.248 8.45455 101.185 8.65104 101.962 9.04403C102.743 9.43229 103.337 9.9839 103.744 10.6989C104.156 11.4091 104.362 12.2448 104.362 13.206C104.362 14.1719 104.154 15.0028 103.737 15.6989C103.321 16.3902 102.717 16.9205 101.926 17.2898C101.14 17.6591 100.189 17.8438 99.0712 17.8438H95.2289V15.3722H98.574C99.1612 15.3722 99.6489 15.2917 100.037 15.1307C100.425 14.9697 100.714 14.7282 100.904 14.4062C101.098 14.0843 101.195 13.6842 101.195 13.206C101.195 12.723 101.098 12.3158 100.904 11.9844C100.714 11.6529 100.423 11.402 100.03 11.2315C99.6417 11.0563 99.1517 10.9688 98.5598 10.9688H96.486V23H93.4107ZM101.266 16.3807L104.881 23H101.486L97.949 16.3807H101.266ZM106.536 23V8.45455H109.611V14.8679H109.803L115.037 8.45455H118.723L113.325 14.9673L118.787 23H115.108L111.124 17.0199L109.611 18.8665V23H106.536ZM120.325 23V8.45455H130.126V10.9901H123.4V14.456H129.622V16.9915H123.4V20.4645H130.154V23H120.325ZM132.571 23V8.45455H138.309C139.408 8.45455 140.345 8.65104 141.122 9.04403C141.903 9.43229 142.497 9.9839 142.905 10.6989C143.317 11.4091 143.523 12.2448 143.523 13.206C143.523 14.1719 143.314 15.0028 142.898 15.6989C142.481 16.3902 141.877 16.9205 141.086 17.2898C140.3 17.6591 139.349 17.8438 138.231 17.8438H134.389V15.3722H137.734C138.321 15.3722 138.809 15.2917 139.197 15.1307C139.586 14.9697 139.874 14.7282 140.064 14.4062C140.258 14.0843 140.355 13.6842 140.355 13.206C140.355 12.723 140.258 12.3158 140.064 11.9844C139.874 11.6529 139.583 11.402 139.19 11.2315C138.802 11.0563 138.312 10.9688 137.72 10.9688H135.646V23H132.571ZM140.426 16.3807L144.041 23H140.646L137.109 16.3807H140.426ZM153.586 12.6378C153.53 12.0649 153.286 11.6198 152.855 11.3026C152.424 10.9853 151.839 10.8267 151.101 10.8267C150.599 10.8267 150.175 10.8977 149.829 11.0398C149.484 11.1771 149.219 11.3688 149.034 11.6151C148.854 11.8613 148.764 12.1406 148.764 12.4531C148.755 12.7135 148.809 12.9408 148.927 13.1349C149.05 13.3291 149.219 13.4972 149.432 13.6392C149.645 13.7765 149.891 13.8973 150.17 14.0014C150.45 14.1009 150.748 14.1861 151.065 14.2571L152.372 14.5696C153.006 14.7116 153.589 14.901 154.119 15.1378C154.649 15.3745 155.109 15.6657 155.497 16.0114C155.885 16.357 156.186 16.7642 156.399 17.233C156.617 17.7017 156.728 18.2391 156.733 18.8452C156.728 19.7353 156.501 20.5071 156.051 21.1605C155.606 21.8092 154.962 22.3134 154.119 22.6733C153.281 23.0284 152.27 23.206 151.086 23.206C149.912 23.206 148.89 23.026 148.018 22.6662C147.152 22.3063 146.475 21.7737 145.987 21.0682C145.504 20.358 145.251 19.4796 145.227 18.4332H148.203C148.236 18.9209 148.376 19.3281 148.622 19.6548C148.873 19.9768 149.207 20.2206 149.623 20.3864C150.045 20.5473 150.521 20.6278 151.051 20.6278C151.572 20.6278 152.024 20.5521 152.407 20.4006C152.796 20.2491 153.096 20.0384 153.309 19.7685C153.523 19.4986 153.629 19.1884 153.629 18.8381C153.629 18.5114 153.532 18.2367 153.338 18.0142C153.148 17.7917 152.869 17.6023 152.5 17.446C152.135 17.2898 151.688 17.1477 151.157 17.0199L149.574 16.6222C148.347 16.3239 147.379 15.8575 146.669 15.223C145.959 14.5885 145.606 13.7339 145.611 12.6591C145.606 11.7784 145.84 11.009 146.314 10.3509C146.792 9.69271 147.448 9.17898 148.281 8.80966C149.114 8.44034 150.061 8.25568 151.122 8.25568C152.202 8.25568 153.144 8.44034 153.949 8.80966C154.758 9.17898 155.388 9.69271 155.838 10.3509C156.288 11.009 156.52 11.7713 156.534 12.6378H153.586Z"
				fill={color}
			/>
		</svg>
	);
};
