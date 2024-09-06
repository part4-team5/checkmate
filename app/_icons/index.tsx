import { motion } from "framer-motion";

interface IconProps {
	width: number | string;
	height: number | string;
	// eslint-disable-next-line react/require-default-props
	color?: string;
}

export default function Icon() {
	throw new Error();
}

Icon.Close = function Close({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

Icon.Dropdown = function Toggle({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12.7151 15.4653C12.3975 15.7654 11.9008 15.7654 11.5832 15.4653L5.8047 10.006C5.26275 9.49404 5.6251 8.58286 6.37066 8.58286L17.9276 8.58286C18.6732 8.58286 19.0355 9.49404 18.4936 10.006L12.7151 15.4653Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Visible = function Visible({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12.0031 15.5769C13.1362 15.5769 14.0985 15.1803 14.8902 14.3871C15.6819 13.5939 16.0777 12.6308 16.0777 11.4977C16.0777 10.3646 15.6811 9.40224 14.888 8.61058C14.0948 7.81891 13.1316 7.42308 11.9985 7.42308C10.8655 7.42308 9.90308 7.81966 9.11141 8.61282C8.31975 9.40601 7.92391 10.3692 7.92391 11.5023C7.92391 12.6353 8.3205 13.5977 9.11366 14.3894C9.90685 15.181 10.87 15.5769 12.0031 15.5769ZM12.0008 14.2C11.2508 14.2 10.6133 13.9375 10.0883 13.4125C9.56331 12.8875 9.30081 12.25 9.30081 11.5C9.30081 10.75 9.56331 10.1125 10.0883 9.58748C10.6133 9.06248 11.2508 8.79998 12.0008 8.79998C12.7508 8.79998 13.3883 9.06248 13.9133 9.58748C14.4383 10.1125 14.7008 10.75 14.7008 11.5C14.7008 12.25 14.4383 12.8875 13.9133 13.4125C13.3883 13.9375 12.7508 14.2 12.0008 14.2ZM12.0008 18.5C9.8957 18.5 7.97039 17.9384 6.22489 16.8153C4.47937 15.6923 3.0861 14.2147 2.04509 12.3827C1.96175 12.2391 1.90085 12.0944 1.86239 11.9485C1.82392 11.8027 1.80469 11.653 1.80469 11.4995C1.80469 11.346 1.82392 11.1965 1.86239 11.051C1.90085 10.9054 1.96175 10.7609 2.04509 10.6173C3.0861 8.78525 4.47937 7.30769 6.22489 6.18463C7.97039 5.06154 9.8957 4.5 12.0008 4.5C14.1059 4.5 16.0312 5.06154 17.7767 6.18463C19.5223 7.30769 20.9155 8.78525 21.9565 10.6173C22.0399 10.7609 22.1008 10.9056 22.1392 11.0514C22.1777 11.1973 22.1969 11.347 22.1969 11.5005C22.1969 11.654 22.1777 11.8035 22.1392 11.949C22.1008 12.0945 22.0399 12.2391 21.9565 12.3827C20.9155 14.2147 19.5223 15.6923 17.7767 16.8153C16.0312 17.9384 14.1059 18.5 12.0008 18.5ZM12.0008 17C13.8841 17 15.6133 16.5041 17.1883 15.5125C18.7633 14.5208 19.9675 13.1833 20.8008 11.5C19.9675 9.81664 18.7633 8.47914 17.1883 7.48748C15.6133 6.49581 13.8841 5.99998 12.0008 5.99998C10.1175 5.99998 8.38831 6.49581 6.81331 7.48748C5.23831 8.47914 4.03415 9.81664 3.20081 11.5C4.03415 13.1833 5.23831 14.5208 6.81331 15.5125C8.38831 16.5041 10.1175 17 12.0008 17Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Invisible = function Invisible({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M15.7736 12.9729L14.6506 11.8499C14.8211 10.9601 14.5871 10.2012 13.9486 9.57296C13.3102 8.94476 12.5441 8.70374 11.6506 8.84989L10.5275 7.72684C10.7596 7.61914 10.9983 7.54157 11.2438 7.49414C11.4894 7.44671 11.7416 7.42299 12.0006 7.42299C13.1352 7.42299 14.0983 7.81882 14.89 8.61049C15.6816 9.40216 16.0775 10.3653 16.0775 11.4999C16.0775 11.7589 16.0553 12.0111 16.0111 12.2566C15.9669 12.5021 15.8877 12.7409 15.7736 12.9729ZM18.9544 16.0845L17.8506 15.0499C18.4839 14.5666 19.0506 14.0291 19.5506 13.4374C20.0506 12.8457 20.4672 12.1999 20.8006 11.4999C19.9672 9.81656 18.7631 8.47906 17.1881 7.48739C15.6131 6.49572 13.8839 5.99989 12.0006 5.99989C11.5172 5.99989 11.0464 6.03322 10.5881 6.09989C10.1297 6.16656 9.66723 6.26656 9.20056 6.39989L8.03521 5.23454C8.6711 4.98326 9.31949 4.798 9.98039 4.67877C10.6413 4.55953 11.3147 4.49991 12.0006 4.49991C14.1493 4.49991 16.123 5.05825 17.9217 6.17491C19.7204 7.29158 21.1037 8.80247 22.0717 10.7076C22.1384 10.8345 22.1867 10.9624 22.2169 11.0912C22.247 11.2201 22.2621 11.3563 22.2621 11.4999C22.2621 11.6435 22.2496 11.7797 22.2246 11.9085C22.1996 12.0374 22.1537 12.1653 22.0871 12.2922C21.7332 13.0448 21.289 13.7396 20.7544 14.3768C20.2198 15.014 19.6198 15.5832 18.9544 16.0845ZM12.0006 18.4999C9.89545 18.4999 7.96597 17.9374 6.21214 16.8124C4.45829 15.6874 3.06405 14.2056 2.02944 12.3672C1.9461 12.2403 1.88521 12.1025 1.84676 11.9537C1.8083 11.805 1.78906 11.6537 1.78906 11.4999C1.78906 11.346 1.80573 11.1973 1.83906 11.0537C1.8724 10.9102 1.93073 10.7698 2.01406 10.6326C2.38586 9.95311 2.80702 9.30599 3.27754 8.69124C3.74805 8.07649 4.28908 7.52553 4.90061 7.03837L2.64291 4.76526C2.50445 4.61655 2.43618 4.43995 2.43811 4.23546C2.44003 4.03098 2.51342 3.85631 2.65829 3.71144C2.80315 3.56657 2.9788 3.49414 3.18521 3.49414C3.39161 3.49414 3.56725 3.56657 3.71211 3.71144L20.289 20.2883C20.4275 20.4268 20.5009 20.5983 20.5092 20.8027C20.5175 21.0072 20.4441 21.187 20.289 21.3422C20.1441 21.487 19.9685 21.5595 19.7621 21.5595C19.5557 21.5595 19.3801 21.487 19.2352 21.3422L15.716 17.8537C15.1262 18.0819 14.5201 18.2467 13.8977 18.3479C13.2753 18.4492 12.6429 18.4999 12.0006 18.4999ZM5.95444 8.09216C5.36854 8.54473 4.84193 9.0566 4.37461 9.62777C3.9073 10.1989 3.51595 10.823 3.20056 11.4999C4.0339 13.1832 5.23806 14.5207 6.81306 15.5124C8.38806 16.5041 10.1172 16.9999 12.0006 16.9999C12.4301 16.9999 12.8528 16.971 13.2689 16.9133C13.6849 16.8557 14.098 16.7666 14.5083 16.646L13.2429 15.3499C13.0403 15.4383 12.8381 15.4982 12.6361 15.5297C12.4342 15.5611 12.2224 15.5768 12.0006 15.5768C10.866 15.5768 9.90283 15.181 9.11116 14.3893C8.3195 13.5976 7.92366 12.6345 7.92366 11.4999C7.92366 11.2781 7.94097 11.0662 7.97559 10.8643C8.0102 10.6624 8.06854 10.4601 8.15059 10.2576L5.95444 8.09216Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Check = function Check({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 7.14286L6.90909 10L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

Icon.Gear = function Gear({ width, height, color = "var(--text-primary)" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M13.8744 22H10.1244C9.87436 22 9.65769 21.9167 9.47436 21.75C9.29103 21.5833 9.18269 21.375 9.14936 21.125L8.84936 18.8C8.63269 18.7167 8.42869 18.6167 8.23736 18.5C8.04536 18.3833 7.85769 18.2583 7.67436 18.125L5.49936 19.025C5.26603 19.1083 5.03269 19.1167 4.79936 19.05C4.56603 18.9833 4.38269 18.8417 4.24936 18.625L2.39936 15.4C2.26603 15.1833 2.22436 14.95 2.27436 14.7C2.32436 14.45 2.44936 14.25 2.64936 14.1L4.52436 12.675C4.50769 12.5583 4.49936 12.4457 4.49936 12.337V11.662C4.49936 11.554 4.50769 11.4417 4.52436 11.325L2.64936 9.9C2.44936 9.75 2.32436 9.55 2.27436 9.3C2.22436 9.05 2.26603 8.81667 2.39936 8.6L4.24936 5.375C4.36603 5.14167 4.54503 4.99567 4.78636 4.937C5.02836 4.879 5.26603 4.89167 5.49936 4.975L7.67436 5.875C7.85769 5.74167 8.04936 5.61667 8.24936 5.5C8.44936 5.38333 8.64936 5.28333 8.84936 5.2L9.14936 2.875C9.18269 2.625 9.29103 2.41667 9.47436 2.25C9.65769 2.08333 9.87436 2 10.1244 2H13.8744C14.1244 2 14.341 2.08333 14.5244 2.25C14.7077 2.41667 14.816 2.625 14.8494 2.875L15.1494 5.2C15.366 5.28333 15.5704 5.38333 15.7624 5.5C15.9537 5.61667 16.141 5.74167 16.3244 5.875L18.4994 4.975C18.7327 4.89167 18.966 4.88333 19.1994 4.95C19.4327 5.01667 19.616 5.15833 19.7494 5.375L21.5994 8.6C21.7327 8.81667 21.7744 9.05 21.7244 9.3C21.6744 9.55 21.5494 9.75 21.3494 9.9L19.4744 11.325C19.491 11.4417 19.4994 11.554 19.4994 11.662V12.337C19.4994 12.4457 19.4827 12.5583 19.4494 12.675L21.3244 14.1C21.5244 14.25 21.6494 14.45 21.6994 14.7C21.7494 14.95 21.7077 15.1833 21.5744 15.4L19.7244 18.6C19.591 18.8167 19.4037 18.9627 19.1624 19.038C18.9204 19.1127 18.6827 19.1083 18.4494 19.025L16.3244 18.125C16.141 18.2583 15.9494 18.3833 15.7494 18.5C15.5494 18.6167 15.3494 18.7167 15.1494 18.8L14.8494 21.125C14.816 21.375 14.7077 21.5833 14.5244 21.75C14.341 21.9167 14.1244 22 13.8744 22ZM12.0494 15.5C13.016 15.5 13.841 15.1583 14.5244 14.475C15.2077 13.7917 15.5494 12.9667 15.5494 12C15.5494 11.0333 15.2077 10.2083 14.5244 9.525C13.841 8.84167 13.016 8.5 12.0494 8.5C11.066 8.5 10.2367 8.84167 9.56136 9.525C8.88669 10.2083 8.54936 11.0333 8.54936 12C8.54936 12.9667 8.88669 13.7917 9.56136 14.475C10.2367 15.1583 11.066 15.5 12.0494 15.5Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Hamburger = function Hamburger({ width, height, color = "#adadad" }: IconProps) {
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

Icon.Search = function Search({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_2562_48083)">
				<circle cx="10.7541" cy="9.80566" r="6" transform="rotate(-45 10.7541 9.80566)" stroke={color} strokeWidth="2" />
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

Icon.ArrowLeft = function ArrowLeft({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M10 4L6 8L10 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

Icon.ArrowRight = function ArrowRight({ width, height, color = "#adadad" }: IconProps) {
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

Icon.Kebab = function Kebab({ width = 16, height = 16, color = "#F8FAFC" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="12" cy="7.5" r="1.5" fill={color} />
			<circle cx="12" cy="12" r="1.5" fill={color} />
			<circle cx="12" cy="16.5" r="1.5" fill={color} />
		</svg>
	);
};

Icon.Bold = function Bold({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M272-200v-560h221q65 0 120 40t55 111q0 51-23 78.5T602-491q25 11 55.5 41t30.5 90q0 89-65 124.5T501-200H272Zm121-112h104q48 0 58.5-24.5T566-372q0-11-10.5-35.5T494-432H393v120Zm0-228h93q33 0 48-17t15-38q0-24-17-39t-44-15h-95v109Z" />
		</svg>
	);
};

Icon.Italic = function Italic({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M200-200v-100h160l120-360H320v-100h400v100H580L460-300h140v100H200Z" />
		</svg>
	);
};

Icon.Underline = function Underline({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M200-120v-80h560v80H200Zm280-160q-101 0-157-63t-56-167v-330h103v336q0 56 28 91t82 35q54 0 82-35t28-91v-336h103v330q0 104-56 167t-157 63Z" />
		</svg>
	);
};

Icon.StrikeThrough = function StrikeThrough({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M80-400v-80h800v80H80Zm340-160v-120H200v-120h560v120H540v120H420Zm0 400v-160h120v160H420Z" />
		</svg>
	);
};

Icon.TodoCheck = function TodoCheck({ width = 16, height = 16, color = "#A3E635" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M3 8.5L7.11349 11.7908C7.25974 11.9078 7.47219 11.8889 7.59553 11.748L13.5 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
		</svg>
	);
};

Icon.Edit = function Edit({ width = 24, height = 24, color = "var(--text-secondary)" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M4.99997 19H6.2615L16.4981 8.7634L15.2366 7.50188L4.99997 17.7385V19ZM4.40385 20.5C4.14777 20.5 3.93311 20.4133 3.75987 20.2401C3.58662 20.0668 3.5 19.8522 3.5 19.5961V17.8635C3.5 17.6196 3.5468 17.3871 3.6404 17.1661C3.73398 16.9451 3.86282 16.7526 4.02692 16.5885L16.6904 3.93078C16.8416 3.79343 17.0086 3.68729 17.1913 3.61237C17.374 3.53746 17.5656 3.5 17.7661 3.5C17.9666 3.5 18.1608 3.53558 18.3488 3.60675C18.5368 3.6779 18.7032 3.79103 18.848 3.94615L20.0692 5.18268C20.2243 5.32754 20.3349 5.49424 20.4009 5.68278C20.4669 5.87129 20.5 6.05981 20.5 6.24833C20.5 6.44941 20.4656 6.64131 20.3969 6.82403C20.3283 7.00676 20.219 7.17373 20.0692 7.32495L7.41147 19.973C7.24738 20.1371 7.05483 20.266 6.83383 20.3596C6.61281 20.4532 6.38037 20.5 6.1365 20.5H4.40385ZM15.8563 8.1437L15.2366 7.50188L16.4981 8.7634L15.8563 8.1437Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.EditCheck = function EditCheck({ width = 24, height = 24, color = "var(--text-secondary)" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M10.6 13.8L8.45 11.65C8.26667 11.4667 8.03333 11.375 7.75 11.375C7.46667 11.375 7.23333 11.4667 7.05 11.65C6.86667 11.8333 6.775 12.0667 6.775 12.35C6.775 12.6333 6.86667 12.8667 7.05 13.05L9.9 15.9C10.1 16.1 10.3333 16.2 10.6 16.2C10.8667 16.2 11.1 16.1 11.3 15.9L16.95 10.25C17.1333 10.0667 17.225 9.83333 17.225 9.55C17.225 9.26667 17.1333 9.03333 16.95 8.85C16.7667 8.66667 16.5333 8.575 16.25 8.575C15.9667 8.575 15.7333 8.66667 15.55 8.85L10.6 13.8ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.EditCancel = function EditCancel({ width = 24, height = 24, color = "var(--text-secondary)" }: IconProps) {
	return (
		<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 808.000000 791.000000" preserveAspectRatio="xMidYMid meet">
			<g transform="translate(0.000000,791.000000) scale(0.100000,-0.100000)" fill={color} stroke="none">
				<path
					d="M3665 7824 c-394 -44 -681 -111 -1025 -242 -905 -343 -1679 -1052
-2105 -1927 -128 -264 -243 -585 -295 -825 -6 -30 -18 -82 -25 -115 -85 -393
-98 -907 -34 -1330 122 -812 488 -1552 1054 -2134 199 -205 381 -359 590 -503
862 -591 1895 -811 2920 -622 570 105 1143 357 1609 708 700 528 1193 1248
1429 2091 140 500 174 1067 96 1590 -102 684 -378 1316 -818 1870 -122 154
-442 474 -596 596 -716 569 -1558 863 -2454 858 -124 -1 -280 -8 -346 -15z
m-488 -2116 c95 -95 173 -177 173 -183 0 -6 -115 -125 -255 -265 -140 -140
-255 -258 -255 -262 0 -5 400 -8 888 -8 1013 0 1057 -3 1284 -75 394 -126 720
-401 907 -765 164 -320 214 -650 150 -1005 -100 -548 -506 -1016 -1034 -1190
-206 -68 -212 -68 -762 -73 l-503 -3 0 255 0 256 404 0 c404 0 504 6 626 37
279 71 520 263 658 523 299 563 10 1274 -598 1470 -151 48 -186 50 -1122 50
-483 0 -878 -3 -878 -8 0 -4 110 -117 245 -252 135 -135 245 -249 245 -255 0
-14 -342 -355 -356 -355 -15 0 -1134 1128 -1134 1143 0 14 1121 1137 1135
1137 5 0 87 -78 182 -172z"
				/>
			</g>
		</svg>
	);
};

Icon.Heart = function Heart({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M3.55596 9.31157C3.40625 9.18016 3.28648 9.07475 3.1987 8.99739V8.95147L3.02296 8.77574C2.32915 8.08193 1.93203 7.16547 1.93203 6.2V6.07612C1.9935 4.2062 3.59056 2.66667 5.46536 2.66667C5.74364 2.66667 6.11285 2.76344 6.4809 2.96162C6.82823 3.14864 7.1331 3.40383 7.33555 3.68842C7.63003 4.31494 8.53783 4.30366 8.81023 3.65457C8.97797 3.36092 9.27196 3.0955 9.62427 2.89902C9.9919 2.694 10.3584 2.6 10.5987 2.6C12.528 2.6 14.0704 4.12742 14.132 6.07581V6.2C14.132 7.24201 13.7286 8.14473 13.0599 8.75771L12.8654 8.93606V8.97957C12.7643 9.06525 12.634 9.17766 12.4821 9.30974C12.1449 9.6029 11.6935 9.99999 11.202 10.4332C11.0443 10.5722 10.8824 10.7149 10.7188 10.8592C9.86259 11.6143 8.95806 12.4119 8.34469 12.9417C8.16816 13.0861 7.89589 13.0861 7.71937 12.9417C6.98716 12.3093 5.82455 11.2962 4.8352 10.4316C4.33957 9.9984 3.88783 9.60286 3.55596 9.31157Z"
				stroke={color}
				strokeWidth="1.2"
			/>
		</svg>
	);
};

Icon.HeartFill = function HeartFill({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M2.55791 7.31158C2.4082 7.18017 2.28843 7.07476 2.20065 6.9974V6.95148L2.02492 6.77575C1.33111 6.08194 0.933983 5.16548 0.933983 4.20001V4.07613C0.995453 2.20621 2.59252 0.666676 4.46732 0.666676C4.7456 0.666676 5.11481 0.763446 5.48286 0.961626C5.83019 1.14865 6.13506 1.40384 6.3375 1.68843C6.63199 2.31495 7.53978 2.30367 7.81218 1.65458C7.97992 1.36093 8.27391 1.09551 8.62623 0.899026C8.99385 0.694006 9.3603 0.600006 9.6007 0.600006C11.53 0.600006 13.0723 2.12743 13.134 4.07582V4.20001C13.134 5.24202 12.7306 6.14474 12.0619 6.75772L11.8673 6.93607V6.97958C11.7662 7.06526 11.6359 7.17767 11.484 7.30975C11.1469 7.60291 10.6955 8 10.2039 8.43321C10.0462 8.57221 9.8844 8.71491 9.7208 8.85921C8.86455 9.61431 7.96001 10.4119 7.34664 10.9417C7.17012 11.0861 6.89785 11.0861 6.72132 10.9417C5.98911 10.3093 4.8265 9.29621 3.83715 8.43161C3.34152 7.99841 2.88978 7.60287 2.55791 7.31158Z"
				fill={color}
				stroke={color}
				strokeWidth="1.2"
			/>
		</svg>
	);
};

Icon.TodoDelete = function TodoDelete({ width = 16, height = 16, color = "#ff0000" }: IconProps) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			aria-labelledby="removeIconTitle"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
			color="#000000"
		>
			<title id="removeIconTitle">Remove</title> <path d="M17,12 L7,12" /> <circle cx="12" cy="12" r="10" />
		</svg>
	);
};

Icon.Crown = function Crown({ width = 16, height = 16, color = "#FDD446" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_540_4887)">
				<path
					d="M14.5115 12.25H3.07821C2.83635 12.25 2.63846 12.4469 2.63846 12.6875V13.5625C2.63846 13.8031 2.83635 14 3.07821 14H14.5115C14.7534 14 14.9513 13.8031 14.9513 13.5625V12.6875C14.9513 12.4469 14.7534 12.25 14.5115 12.25ZM16.2705 3.5C15.5422 3.5 14.9513 4.08789 14.9513 4.8125C14.9513 5.00664 14.9953 5.18711 15.0722 5.35391L13.0824 6.54063C12.6591 6.79219 12.1122 6.65 11.8676 6.22344L9.62764 2.32422C9.92171 2.08359 10.1141 1.72266 10.1141 1.3125C10.1141 0.587891 9.5232 0 8.79487 0C8.06655 0 7.47564 0.587891 7.47564 1.3125C7.47564 1.72266 7.66803 2.08359 7.96211 2.32422L5.72216 6.22344C5.47756 6.65 4.92788 6.79219 4.50737 6.54063L2.52028 5.35391C2.59449 5.18984 2.64121 5.00664 2.64121 4.8125C2.64121 4.08789 2.0503 3.5 1.32198 3.5C0.593654 3.5 0 4.08789 0 4.8125C0 5.53711 0.590905 6.125 1.31923 6.125C1.39069 6.125 1.46215 6.11406 1.53086 6.10313L3.51795 11.375H14.0718L16.0589 6.10313C16.1276 6.11406 16.1991 6.125 16.2705 6.125C16.9988 6.125 17.5897 5.53711 17.5897 4.8125C17.5897 4.08789 16.9988 3.5 16.2705 3.5Z"
					fill={color}
				/>
			</g>
			<defs>
				<clipPath id="clip0_540_4887">
					<rect width="17.5897" height="14" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

Icon.CheckAnimation = function CheckAnimation({ width = 14, height = 14, primary = "#10B981", secondary = "#fff" }) {
	const circleVariants = {
		hidden: { scale: 0, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: 0.3,
				delay: 0.1,
				type: "spring",
				stiffness: 300,
			},
		},
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={circleVariants}
			style={{
				width: 24,
				height: 24,
				borderRadius: "50%",
				backgroundColor: primary,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<motion.svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke={secondary}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				width={width}
				height={height}
			>
				<motion.path d="M5 13l4 4L19 7" initial="hidden" animate="visible" />
			</motion.svg>
		</motion.div>
	);
};

Icon.Info = function Info({ width = 24, height = 24, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10 0-5.52-4.48-10-10-10zM11 7h2v2h-2V7zm0 4h2v6h-2V11z" fill={color} />
		</svg>
	);
};

Icon.Loading = function Loading({ width = 24, height = 24, color = "#10B981" }: IconProps) {
	return (
		<svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle cx="12" cy="12" r="10" stroke="#00000040" strokeWidth="4" />
			<path fill={color} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
		</svg>
	);
};

Icon.Star = function Star({
	width = 24,
	height = 24,
	primary = "#10B981",
	secondary = "#fff",
}: {
	width?: number;
	height?: number;
	primary?: string;
	secondary?: string;
}) {
	return (
		<svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
			<g fill={secondary}>
				<path fill={primary} d="M30 33.5l-2.3-7.1 6.1-4.4h-7.5L24 14.9 21.7 22h-7.5l6.1 4.4-2.3 7.1 6-4.4z" />
				<path d="M24 8.5l2.9 8.8c.5 1.7 2.1 2.8 3.8 2.8H40l-7.5 5.4c-1.4 1-2 2.8-1.5 4.5l2.9 8.8-7.5-5.4c-.7-.5-1.5-.8-2.4-.8-.9 0-1.7.3-2.4.8l-7.5 5.4L17 30c.5-1.7 0-3.5-1.5-4.5L8.1 20h9.3c1.7 0 3.3-1.1 3.8-2.8L24 8.5m0-2c-.8 0-1.6.5-1.9 1.4l-2.9 8.8c-.3.8-1 1.4-1.9 1.4H8.1c-1.9 0-2.7 2.5-1.2 3.6l7.5 5.4c.7.5 1 1.4.7 2.2l-2.9 8.8c-.5 1.4.7 2.6 1.9 2.6.4 0 .8-.1 1.2-.4l7.5-5.4c.4-.3.8-.4 1.2-.4s.8.1 1.2.4l7.5 5.4c.4.3.8.4 1.2.4 1.2 0 2.4-1.2 1.9-2.6l-2.9-8.8c-.3-.8 0-1.7.7-2.2l7.5-5.4c1.6-1.1.8-3.6-1.2-3.6h-9.3c-.9 0-1.6-.6-1.9-1.4l-2.9-8.8c-.2-1-1-1.4-1.8-1.4z" />
			</g>
		</svg>
	);
};

Icon.Light = function Light({ width = 24, height = 24, color = "#adadad" }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z" />
		</svg>
	);
};

Icon.Dark = function Dark({ width = 24, height = 24, color = "#adadad" }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z" />
		</svg>
	);
};

Icon.EmptyImage = function EmptyImage({ width = 24, height = 24, color = "#10B981" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.23 2H10C5.58172 2 2 5.58172 2 10V14.24C2 18.6583 5.58172 22.24 10 22.24H14.23C18.6483 22.24 22.23 18.6583 22.23 14.24V10C22.23 5.58172 18.6483 2 14.23 2ZM8.12 6.12C9.22457 6.12 10.12 7.01543 10.12 8.12C10.12 9.22457 9.22457 10.12 8.12 10.12C7.01543 10.12 6.12 9.22457 6.12 8.12C6.12 7.01543 7.01543 6.12 8.12 6.12ZM15.51 20.12C18.3411 19.0627 20.2212 16.3621 20.23 13.34L20.2 11.62C20.2 11.21 20.12 10.44 20.12 10.44H18.49C14.7164 10.4515 11.2706 12.5862 9.58 15.96C8.35291 14.863 6.76591 14.2546 5.12 14.25H3.91C3.82074 16.5747 5.08341 18.7415 7.15 19.81C7.88878 20.2036 8.71293 20.4096 9.55 20.41H13.72C14.329 20.4187 14.9349 20.3206 15.51 20.12Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.MailAccept = function MailAccept2({ width = 24, height = 24, color = "#fff" }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M638-80 468-250l56-56 114 114 226-226 56 56L638-80ZM480-520l320-200H160l320 200Zm0 80L160-640v400h206l80 80H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v174l-80 80v-174L480-440Zm0 0Zm0-80Zm0 80Z" />
		</svg>
	);
};

Icon.MailReject = function MailReject({ width = 24, height = 24, color = "#EF4444" }: IconProps) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={color}>
			<path d="M383-463Zm194-34ZM791-55 686-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800l80 80h-80v480h446L55-791l57-57 736 736-57 57Zm80-148-71-71v-366L575-499l-49-49 274-172H354l-80-80h526q33 0 56.5 23.5T880-720v480q0 10-2 19.5t-7 17.5Z" />
		</svg>
	);
};

Icon.UnCheckBox = function UnCheckBox({ width = 24, height = 24, color = "#10B981" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="4.5" y="4.5" width="15" height="15" rx="5.5" stroke={color} />
		</svg>
	);
};

Icon.CommentCount = function CommentCount({ width = 16, height = 16, color = "var(--text-secondary)" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2 6.93268C2 5.43921 2 4.69247 2.29065 4.12204C2.54631 3.62028 2.95426 3.21233 3.45603 2.95666C4.02646 2.66602 4.77319 2.66602 6.26667 2.66602H9.73333C11.2268 2.66602 11.9735 2.66602 12.544 2.95666C13.0457 3.21233 13.4537 3.62028 13.7094 4.12204C14 4.69247 14 5.43921 14 6.93268V7.73268C14 9.22616 14 9.97289 13.7094 10.5433C13.4537 11.0451 13.0457 11.453 12.544 11.7087C11.9735 11.9993 11.2268 11.9993 9.73333 11.9993L4.94281 11.9993C4.766 11.9993 4.59643 12.0696 4.4714 12.1946L3.13807 13.5279C2.7181 13.9479 2 13.6505 2 13.0565V11.9993V8.66602V6.93268ZM6 5.33301C5.63181 5.33301 5.33333 5.63148 5.33333 5.99967C5.33333 6.36786 5.63181 6.66634 6 6.66634H10C10.3682 6.66634 10.6667 6.36786 10.6667 5.99967C10.6667 5.63148 10.3682 5.33301 10 5.33301H6ZM6 7.99967C5.63181 7.99967 5.33333 8.29815 5.33333 8.66634C5.33333 9.03453 5.63181 9.33301 6 9.33301H8C8.36819 9.33301 8.66667 9.03453 8.66667 8.66634C8.66667 8.29815 8.36819 7.99967 8 7.99967H6Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Calendar = function Calendar({ width = 16, height = 16, color = "var(--text-secondary)" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11.2654 2.3813H11.332C13.173 2.3813 14.6654 3.87369 14.6654 5.71464V11.7146C14.6654 13.5556 13.173 15.048 11.332 15.048H4.66536C3.78131 15.048 2.93346 14.6968 2.30834 14.0717C1.68322 13.4465 1.33203 12.5987 1.33203 11.7146V5.71464C1.33203 3.87369 2.82442 2.3813 4.66536 2.3813H4.73203V1.16797C4.73203 0.891826 4.95589 0.667969 5.23203 0.667969C5.50817 0.667969 5.73203 0.891826 5.73203 1.16797V2.3813H10.2654V1.16797C10.2654 0.891826 10.4892 0.667969 10.7654 0.667969C11.0415 0.667969 11.2654 0.891826 11.2654 1.16797V2.3813ZM4.9987 6.4413H10.9987C11.2748 6.4413 11.4987 6.21744 11.4987 5.9413C11.4987 5.66516 11.2748 5.4413 10.9987 5.4413H4.9987C4.72256 5.4413 4.4987 5.66516 4.4987 5.9413C4.4987 6.21744 4.72256 6.4413 4.9987 6.4413Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.Cycles = function Cycles({ width = 16, height = 16, color = "var(--text-secondary)" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M10 10L8 12L10 14" fill={color} />
			<path d="M10 10L8 12L10 14V10Z" stroke="#adadad" strokeLinecap="round" strokeLinejoin="round" />
			<path
				d="M8 12H12.8462C14.0357 12 15 11.0449 15 9.86667V6.13333C15 4.95512 14.0357 4 12.8462 4H11.2308"
				stroke={color}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M6 6L8 4L6 2" fill={color} />
			<path d="M6 6L8 4L6 2V6Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
			<path
				d="M8 4H3.15385C1.96431 4 1 4.95513 1 6.13333V9.86667C1 11.0449 1.96431 12 3.15385 12H4.76923"
				stroke={color}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

Icon.CalendarLeftArrow = function CalendarLeftArrow({ width = 24, height = 24, color = "var(--background-secondary)" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_1996_77861)">
				<circle cx="8" cy="8" r="8" fill={color} />
				<path d="M9.5 5L6.5 8L9.5 11" stroke="var(--text-secondary)" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
			</g>
			<defs>
				<clipPath id="clip0_1996_77861">
					<rect width={width} height={height} fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

Icon.DoneCheck = function DoneCheck({ width = 24, height = 24, color = "#EF4444" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_1996_78592)">
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M9.66462 2.4487C8.77555 1.68377 7.46081 1.68377 6.57174 2.4487C6.18771 2.77912 5.70794 2.97784 5.20275 3.01576C4.03319 3.10353 3.10353 4.03319 3.01576 5.20275C2.97784 5.70794 2.77912 6.18771 2.4487 6.57174C1.68377 7.46081 1.68377 8.77555 2.4487 9.66462C2.77912 10.0486 2.97784 10.5284 3.01576 11.0336C3.10353 12.2032 4.03319 13.1328 5.20275 13.2206C5.70794 13.2585 6.18771 13.4572 6.57174 13.7877C7.46081 14.5526 8.77555 14.5526 9.66462 13.7877C10.0486 13.4572 10.5284 13.2585 11.0336 13.2206C12.2032 13.1328 13.1328 12.2032 13.2206 11.0336C13.2585 10.5284 13.4572 10.0486 13.7877 9.66462C14.5526 8.77555 14.5526 7.46081 13.7877 6.57174C13.4572 6.18771 13.2585 5.70794 13.2206 5.20275C13.1328 4.03319 12.2032 3.10353 11.0336 3.01576C10.5284 2.97784 10.0486 2.77912 9.66462 2.4487ZM11.231 6.80719C11.4734 6.53779 11.4516 6.12285 11.1822 5.8804C10.9128 5.63794 10.4979 5.65978 10.2554 5.92918L7.52801 8.95962L5.91332 7.61404C5.63488 7.38201 5.22108 7.41963 4.98905 7.69806C4.75702 7.97649 4.79464 8.3903 5.07307 8.62233L7.04366 10.2645C7.38688 10.5505 7.8948 10.5141 8.19368 10.182L11.231 6.80719Z"
					fill={color}
				/>
			</g>
			<defs>
				<clipPath id="clip0_1996_78592">
					<rect width="14" height="14" fill="white" transform="translate(1 1)" />
				</clipPath>
			</defs>
		</svg>
	);
};

Icon.CalendarRightArrow = function CalendarRightArrow({ width = 24, height = 24, color = "var(--background-secondary)" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_1996_77862)">
				<circle cx="8" cy="8" r="8" fill={color} />
				<path d="M6.5 5L9.5 8L6.5 11" stroke="var(--text-secondary)" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
			</g>
			<defs>
				<clipPath id="clip0_1996_77862">
					<rect width="16" height="16" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

Icon.CalendarButton = function CalendarButton({ width = 24, height = 24, color = "var(--background-secondary)" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill={color} />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.45 7.785H14.5C15.8807 7.785 17 8.90429 17 10.285V14.785C17 16.1657 15.8807 17.285 14.5 17.285H9.5C8.83696 17.285 8.20107 17.0216 7.73223 16.5528C7.26339 16.0839 7 15.448 7 14.785V10.285C7 8.90429 8.11929 7.785 9.5 7.785H9.55V6.875C9.55 6.66789 9.71789 6.5 9.925 6.5C10.1321 6.5 10.3 6.66789 10.3 6.875V7.785H13.7V6.875C13.7 6.66789 13.8679 6.5 14.075 6.5C14.2821 6.5 14.45 6.66789 14.45 6.875V7.785ZM9.75 10.83H14.25C14.4571 10.83 14.625 10.6621 14.625 10.455C14.625 10.2479 14.4571 10.08 14.25 10.08H9.75C9.54289 10.08 9.375 10.2479 9.375 10.455C9.375 10.6621 9.54289 10.83 9.75 10.83Z"
				fill="var(--text-secondary)"
			/>
		</svg>
	);
};

Icon.Pointer = function Pointer({ width = 24, height = 24, color = "#8EDCC3" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 63 67" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g filter="url(#filter0_d_29_317)">
				<path
					d="M19.1337 16.3125C19.3723 13.2426 22.8448 11.5822 25.3841 13.3239L45.1006 26.8471C47.6399 28.5888 47.3416 32.4262 44.5636 33.7545L22.9939 44.0679C20.2159 45.3961 17.0418 43.2191 17.2805 40.1491L19.1337 16.3125Z"
					fill={color}
				/>
				<rect x="28.3262" y="36.9863" width="8.17635" height="24.529" rx="4" transform="rotate(-25.5545 28.3262 36.9863)" fill={color} />
			</g>
			<defs>
				<filter id="filter0_d_29_317" x="13.2676" y="8.61731" width="41.5708" height="57.1653" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
					<feOffset dx="2" dy="2" />
					<feGaussianBlur stdDeviation="3" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix type="matrix" values="0 0 0 0 0.364649 0 0 0 0 0.378792 0 0 0 0 0.392936 0 0 0 0.14 0" />
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_29_317" />
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_29_317" result="shape" />
				</filter>
			</defs>
		</svg>
	);
};

Icon.Grid = function Grid({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M1 3.86364C1 3.10415 1.3017 2.37578 1.83874 1.83874C2.37578 1.3017 3.10415 1 3.86364 1H6.72727C7.48676 1 8.21513 1.3017 8.75217 1.83874C9.28921 2.37578 9.59091 3.10415 9.59091 3.86364V6.72727C9.59091 7.48676 9.28921 8.21513 8.75217 8.75217C8.21513 9.28921 7.48676 9.59091 6.72727 9.59091H3.86364C3.10415 9.59091 2.37578 9.28921 1.83874 8.75217C1.3017 8.21513 1 7.48676 1 6.72727V3.86364ZM1 16.2727C1 15.5132 1.3017 14.7849 1.83874 14.2478C2.37578 13.7108 3.10415 13.4091 3.86364 13.4091H6.72727C7.48676 13.4091 8.21513 13.7108 8.75217 14.2478C9.28921 14.7849 9.59091 15.5132 9.59091 16.2727V19.1364C9.59091 19.8958 9.28921 20.6242 8.75217 21.1613C8.21513 21.6983 7.48676 22 6.72727 22H3.86364C3.10415 22 2.37578 21.6983 1.83874 21.1613C1.3017 20.6242 1 19.8958 1 19.1364V16.2727ZM13.4091 3.86364C13.4091 3.10415 13.7108 2.37578 14.2478 1.83874C14.7849 1.3017 15.5132 1 16.2727 1H19.1364C19.8958 1 20.6242 1.3017 21.1613 1.83874C21.6983 2.37578 22 3.10415 22 3.86364V6.72727C22 7.48676 21.6983 8.21513 21.1613 8.75217C20.6242 9.28921 19.8958 9.59091 19.1364 9.59091H16.2727C15.5132 9.59091 14.7849 9.28921 14.2478 8.75217C13.7108 8.21513 13.4091 7.48676 13.4091 6.72727V3.86364ZM13.4091 16.2727C13.4091 15.5132 13.7108 14.7849 14.2478 14.2478C14.7849 13.7108 15.5132 13.4091 16.2727 13.4091H19.1364C19.8958 13.4091 20.6242 13.7108 21.1613 14.2478C21.6983 14.7849 22 15.5132 22 16.2727V19.1364C22 19.8958 21.6983 20.6242 21.1613 21.1613C20.6242 21.6983 19.8958 22 19.1364 22H16.2727C15.5132 22 14.7849 21.6983 14.2478 21.1613C13.7108 20.6242 13.4091 19.8958 13.4091 19.1364V16.2727Z"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

Icon.Sort = function Sort({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M7.35556 2.7H23M7.35556 12.5H23M7.35556 22.3H23M1.48889 2.7H1.49801V2.71493H1.48889V2.7ZM1.97778 2.7C1.97778 2.88565 1.92627 3.0637 1.83459 3.19497C1.7429 3.32625 1.61855 3.4 1.48889 3.4C1.35923 3.4 1.23488 3.32625 1.14319 3.19497C1.05151 3.0637 1 2.88565 1 2.7C1 2.51435 1.05151 2.3363 1.14319 2.20503C1.23488 2.07375 1.35923 2 1.48889 2C1.61855 2 1.7429 2.07375 1.83459 2.20503C1.92627 2.3363 1.97778 2.51435 1.97778 2.7ZM1.48889 12.5H1.49801V12.5149H1.48889V12.5ZM1.97778 12.5C1.97778 12.6857 1.92627 12.8637 1.83459 12.995C1.7429 13.1263 1.61855 13.2 1.48889 13.2C1.35923 13.2 1.23488 13.1263 1.14319 12.995C1.05151 12.8637 1 12.6857 1 12.5C1 12.3143 1.05151 12.1363 1.14319 12.005C1.23488 11.8737 1.35923 11.8 1.48889 11.8C1.61855 11.8 1.7429 11.8737 1.83459 12.005C1.92627 12.1363 1.97778 12.3143 1.97778 12.5ZM1.48889 22.3H1.49801V22.3149H1.48889V22.3ZM1.97778 22.3C1.97778 22.4857 1.92627 22.6637 1.83459 22.795C1.7429 22.9263 1.61855 23 1.48889 23C1.35923 23 1.23488 22.9263 1.14319 22.795C1.05151 22.6637 1 22.4857 1 22.3C1 22.1143 1.05151 21.9363 1.14319 21.805C1.23488 21.6737 1.35923 21.6 1.48889 21.6C1.61855 21.6 1.7429 21.6737 1.83459 21.805C1.92627 21.9363 1.97778 22.1143 1.97778 22.3Z"
				stroke={color}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

Icon.Comment = function Comment({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2 6.93268C2 5.43921 2 4.69247 2.29065 4.12204C2.54631 3.62028 2.95426 3.21233 3.45603 2.95666C4.02646 2.66602 4.77319 2.66602 6.26667 2.66602H9.73333C11.2268 2.66602 11.9735 2.66602 12.544 2.95666C13.0457 3.21233 13.4537 3.62028 13.7094 4.12204C14 4.69247 14 5.43921 14 6.93268V7.73268C14 9.22616 14 9.97289 13.7094 10.5433C13.4537 11.0451 13.0457 11.453 12.544 11.7087C11.9735 11.9993 11.2268 11.9993 9.73333 11.9993L4.94281 11.9993C4.766 11.9993 4.59643 12.0696 4.4714 12.1946L3.13807 13.5279C2.7181 13.9479 2 13.6505 2 13.0565V11.9993V8.66602V6.93268ZM6 5.33301C5.63181 5.33301 5.33333 5.63148 5.33333 5.99967C5.33333 6.36786 5.63181 6.66634 6 6.66634H10C10.3682 6.66634 10.6667 6.36786 10.6667 5.99967C10.6667 5.63148 10.3682 5.33301 10 5.33301H6ZM6 7.99967C5.63181 7.99967 5.33333 8.29815 5.33333 8.66634C5.33333 9.03453 5.63181 9.33301 6 9.33301H8C8.36819 9.33301 8.66667 9.03453 8.66667 8.66634C8.66667 8.29815 8.36819 7.99967 8 7.99967H6Z"
				fill={color}
			/>
		</svg>
	);
};

Icon.TrashCan = function TrashCan({ width, height, color = "#adadad" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M6.08975 17.0832C5.67549 17.0832 5.32085 16.9356 5.02585 16.6406C4.73084 16.3456 4.58333 15.991 4.58333 15.5767V4.99984H4.375C4.19792 4.99984 4.04948 4.93992 3.92969 4.82007C3.8099 4.70024 3.75 4.55174 3.75 4.37457C3.75 4.19742 3.8099 4.04901 3.92969 3.92936C4.04948 3.8097 4.19792 3.74986 4.375 3.74986H7.49998C7.49998 3.54581 7.57183 3.37193 7.71552 3.22824C7.85922 3.08454 8.03309 3.0127 8.23715 3.0127H11.7628C11.9669 3.0127 12.1407 3.08454 12.2844 3.22824C12.4281 3.37193 12.5 3.54581 12.5 3.74986H15.625C15.802 3.74986 15.9505 3.80979 16.0703 3.92963C16.1901 4.04948 16.25 4.19798 16.25 4.37513C16.25 4.5523 16.1901 4.70071 16.0703 4.82036C15.9505 4.94002 15.802 4.99984 15.625 4.99984H15.4166V15.5767C15.4166 15.991 15.2691 16.3456 14.9741 16.6406C14.6791 16.9356 14.3245 17.0832 13.9102 17.0832H6.08975ZM14.1666 4.99984H5.83331V15.5767C5.83331 15.6515 5.85735 15.713 5.90544 15.7611C5.95352 15.8091 6.01496 15.8332 6.08975 15.8332H13.9102C13.985 15.8332 14.0464 15.8091 14.0945 15.7611C14.1426 15.713 14.1666 15.6515 14.1666 15.5767V4.99984ZM8.46181 14.1665C8.63897 14.1665 8.78737 14.1066 8.90702 13.9868C9.02669 13.867 9.08652 13.7186 9.08652 13.5415V7.29149C9.08652 7.11442 9.0266 6.96599 8.90675 6.8462C8.7869 6.7264 8.6384 6.66651 8.46125 6.66651C8.28408 6.66651 8.13567 6.7264 8.01602 6.8462C7.89637 6.96599 7.83654 7.11442 7.83654 7.29149V13.5415C7.83654 13.7186 7.89647 13.867 8.01631 13.9868C8.13615 14.1066 8.28465 14.1665 8.46181 14.1665ZM11.5387 14.1665C11.7159 14.1665 11.8643 14.1066 11.9839 13.9868C12.1036 13.867 12.1634 13.7186 12.1634 13.5415V7.29149C12.1634 7.11442 12.1035 6.96599 11.9836 6.8462C11.8638 6.7264 11.7153 6.66651 11.5381 6.66651C11.361 6.66651 11.2126 6.7264 11.0929 6.8462C10.9733 6.96599 10.9134 7.11442 10.9134 7.29149V13.5415C10.9134 13.7186 10.9734 13.867 11.0932 13.9868C11.2131 14.1066 11.3616 14.1665 11.5387 14.1665Z"
				fill={color}
			/>
		</svg>
	);
};
