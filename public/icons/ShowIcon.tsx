interface IconProps {
	width: number;
	height: number;
	// eslint-disable-next-line react/require-default-props
	color?: string;
}

export default function ShowIcon({ width, height, color = "#64748B" }: IconProps) {
	return (
		<svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M15.7736 12.9729L14.6506 11.8499C14.8211 10.9601 14.5871 10.2012 13.9486 9.57296C13.3102 8.94476 12.5441 8.70374 11.6506 8.84989L10.5275 7.72684C10.7596 7.61914 10.9983 7.54157 11.2438 7.49414C11.4894 7.44671 11.7416 7.42299 12.0006 7.42299C13.1352 7.42299 14.0983 7.81882 14.89 8.61049C15.6816 9.40216 16.0775 10.3653 16.0775 11.4999C16.0775 11.7589 16.0553 12.0111 16.0111 12.2566C15.9669 12.5021 15.8877 12.7409 15.7736 12.9729ZM18.9544 16.0845L17.8506 15.0499C18.4839 14.5666 19.0506 14.0291 19.5506 13.4374C20.0506 12.8457 20.4672 12.1999 20.8006 11.4999C19.9672 9.81656 18.7631 8.47906 17.1881 7.48739C15.6131 6.49572 13.8839 5.99989 12.0006 5.99989C11.5172 5.99989 11.0464 6.03322 10.5881 6.09989C10.1297 6.16656 9.66723 6.26656 9.20056 6.39989L8.03521 5.23454C8.6711 4.98326 9.31949 4.798 9.98039 4.67877C10.6413 4.55953 11.3147 4.49991 12.0006 4.49991C14.1493 4.49991 16.123 5.05825 17.9217 6.17491C19.7204 7.29158 21.1037 8.80247 22.0717 10.7076C22.1384 10.8345 22.1867 10.9624 22.2169 11.0912C22.247 11.2201 22.2621 11.3563 22.2621 11.4999C22.2621 11.6435 22.2496 11.7797 22.2246 11.9085C22.1996 12.0374 22.1537 12.1653 22.0871 12.2922C21.7332 13.0448 21.289 13.7396 20.7544 14.3768C20.2198 15.014 19.6198 15.5832 18.9544 16.0845ZM12.0006 18.4999C9.89545 18.4999 7.96597 17.9374 6.21214 16.8124C4.45829 15.6874 3.06405 14.2056 2.02944 12.3672C1.9461 12.2403 1.88521 12.1025 1.84676 11.9537C1.8083 11.805 1.78906 11.6537 1.78906 11.4999C1.78906 11.346 1.80573 11.1973 1.83906 11.0537C1.8724 10.9102 1.93073 10.7698 2.01406 10.6326C2.38586 9.95311 2.80702 9.30599 3.27754 8.69124C3.74805 8.07649 4.28908 7.52553 4.90061 7.03837L2.64291 4.76526C2.50445 4.61655 2.43618 4.43995 2.43811 4.23546C2.44003 4.03098 2.51342 3.85631 2.65829 3.71144C2.80315 3.56657 2.9788 3.49414 3.18521 3.49414C3.39161 3.49414 3.56725 3.56657 3.71211 3.71144L20.289 20.2883C20.4275 20.4268 20.5009 20.5983 20.5092 20.8027C20.5175 21.0072 20.4441 21.187 20.289 21.3422C20.1441 21.487 19.9685 21.5595 19.7621 21.5595C19.5557 21.5595 19.3801 21.487 19.2352 21.3422L15.716 17.8537C15.1262 18.0819 14.5201 18.2467 13.8977 18.3479C13.2753 18.4492 12.6429 18.4999 12.0006 18.4999ZM5.95444 8.09216C5.36854 8.54473 4.84193 9.0566 4.37461 9.62777C3.9073 10.1989 3.51595 10.823 3.20056 11.4999C4.0339 13.1832 5.23806 14.5207 6.81306 15.5124C8.38806 16.5041 10.1172 16.9999 12.0006 16.9999C12.4301 16.9999 12.8528 16.971 13.2689 16.9133C13.6849 16.8557 14.098 16.7666 14.5083 16.646L13.2429 15.3499C13.0403 15.4383 12.8381 15.4982 12.6361 15.5297C12.4342 15.5611 12.2224 15.5768 12.0006 15.5768C10.866 15.5768 9.90283 15.181 9.11116 14.3893C8.3195 13.5976 7.92366 12.6345 7.92366 11.4999C7.92366 11.2781 7.94097 11.0662 7.97559 10.8643C8.0102 10.6624 8.06854 10.4601 8.15059 10.2576L5.95444 8.09216Z"
				fill={color}
			/>
		</svg>
	);
}
