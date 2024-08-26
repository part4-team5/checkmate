/* eslint-disable consistent-return */

import { useLayoutEffect, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export interface PopoverProps extends React.PropsWithChildren {
	gapX?: number;
	gapY?: number;
	overlay: (close: () => void) => JSX.Element;
	onOpen?: () => void;
	onClose?: () => void;
	anchorOrigin: Origin;
	overlayOrigin: Origin;
}

interface Origin {
	vertical: "top" | "center" | "bottom";
	horizontal: "left" | "center" | "right";
}

export default function Popover({ gapX = 0, gapY = 0, overlay, onOpen, onClose, anchorOrigin, overlayOrigin, children }: Readonly<PopoverProps>) {
	const pop = useRef<HTMLDivElement>(null);
	const over = useRef<HTMLDivElement>(null);

	const pathname = usePathname();

	const [popRect, setPopRect] = useState({ width: 0, height: 0 });
	const [overRect, setOverRect] = useState({ width: 0, height: 0 });

	const [toggle, setToggle] = useState(false);

	useEffect(() => {
		setToggle(false);
	}, [pathname]);

	useEffect(() => {
		if (toggle) {
			const handle = (event: MouseEvent) => {
				if (pop.current && !pop.current.contains(event.target as Element)) {
					setToggle(false);
				}
			};
			document.addEventListener("click", handle, true);
			return () => document.removeEventListener("click", handle, true);
		}
	}, [toggle]);

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

	const style: React.CSSProperties = { position: "absolute", top: 0, left: 0, zIndex: 1000 };

	// eslint-disable-next-line default-case
	switch (anchorOrigin.vertical) {
		case "top": {
			style.top = 0;
			break;
		}
		case "center": {
			style.top = popRect.height * 0.5;
			break;
		}
		case "bottom": {
			style.top = popRect.height * 1.0;
			break;
		}
	}
	// eslint-disable-next-line default-case
	switch (anchorOrigin.horizontal) {
		case "left": {
			style.left = 0;
			break;
		}
		case "center": {
			style.left = popRect.width * 0.5;
			break;
		}
		case "right": {
			style.left = popRect.width * 1.0;
			break;
		}
	}
	// eslint-disable-next-line default-case
	switch (overlayOrigin.vertical) {
		case "top": {
			style.top += gapY;
			break;
		}
		case "center": {
			style.top -= overRect.height * 0.5;
			break;
		}
		case "bottom": {
			style.top -= overRect.height * 1.0 + gapY;
			break;
		}
	}
	// eslint-disable-next-line default-case
	switch (overlayOrigin.horizontal) {
		case "left": {
			style.left += gapX;
			break;
		}
		case "center": {
			style.left -= overRect.width * 0.5;
			break;
		}
		case "right": {
			style.left -= overRect.width * 1.0 + gapX;
			break;
		}
	}

	return (
		<div ref={pop} style={{ position: "relative" }}>
			<div
				aria-hidden="true"
				onClick={() => setToggle(!toggle)}
				onMouseUp={(event) => event.stopPropagation()}
				onMouseDown={(event) => event.stopPropagation()}
			>
				{children}
			</div>
			<AnimatePresence>
				{toggle && (
					<motion.div
						ref={over}
						style={style}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.2 }}
					>
						{overlay(() => setToggle(false))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
