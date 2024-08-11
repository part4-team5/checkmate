/* eslint-disable consistent-return */

import { useLayoutEffect, useEffect, useState, useRef, cloneElement } from "react";
import { usePathname } from "next/navigation";

export interface PopoverProps extends React.PropsWithChildren {
	gapX?: number;
	gapY?: number;
	overlay: (close: () => void) => JSX.Element;
	onOpen?: () => void;
	onClose?: () => void;
	align: "left" | "center" | "right";
}

export default function Popover({ gapX = 0, gapY = 0, overlay, onOpen, onClose, align, children }: Readonly<PopoverProps>) {
	const pop = useRef<HTMLDivElement>(null);
	const over = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	const [popRect, setPopRect] = useState({ width: 0, height: 0 });
	const [overRect, setOverRect] = useState({ width: 0, height: 0 });

	const [toggle, setToggle] = useState(false);

	useEffect(() => {
		if (!toggle) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (pop.current && !pop.current.contains(event.target as Element)) {
				setToggle(false);
			}
		};

		document.addEventListener("click", handleClickOutside, true);

		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [toggle]);

	useEffect(() => {
		setToggle(false);
	}, [pathname]);

	useLayoutEffect(() => {
		if (toggle) {
			const popRectTemp = pop.current?.getBoundingClientRect();
			setPopRect({ width: popRectTemp?.width ?? 0, height: popRectTemp?.height ?? 0 });

			const overRectTemp = over.current?.getBoundingClientRect();
			setOverRect({ width: overRectTemp?.width ?? 0, height: overRectTemp?.height ?? 0 });
		}
	}, [toggle, children]);

	useEffect(() => {
		if (toggle) {
			onOpen?.();
		} else {
			onClose?.();
		}
	}, [toggle, onOpen, onClose]);

	const style: React.CSSProperties = {
		position: "absolute",
		display: toggle ? "block" : "none",
		top: popRect.height + gapY,
		left: NaN,
		zIndex: 1000,
	};

	/* eslint-disable-next-line default-case */
	switch (align) {
		case "left":
			style.left = gapX;
			break;
		case "center":
			style.left = (popRect.width - overRect.width) / 2 + gapX;
			break;
		case "right":
			style.left = popRect.width - overRect.width + gapX;
			break;
	}

	return (
		<div ref={pop} style={{ position: "relative", overflow: "visible" }}>
			<div aria-hidden="true" onClick={() => setToggle(!toggle)}>
				{children}
			</div>
			{cloneElement(
				overlay(() => setToggle(false)),
				{ ref: over, style },
			)}
		</div>
	);
}
