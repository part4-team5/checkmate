import { useLayoutEffect, useEffect, useState, useRef, cloneElement } from "react";

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

	const [popRect, setPopRect] = useState({ width: 0, height: 0 });
	const [overRect, setOverRect] = useState({ width: 0, height: 0 });

	const [toggle, setToggle] = useState(false);

	// eslint-disable-next-line consistent-return
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

	const style: React.CSSProperties = { position: "absolute", display: toggle ? "block" : "none", top: NaN, left: NaN };

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
			style.top += gapX;
			break;
		}
		case "center": {
			style.top -= overRect.height * 0.5;
			break;
		}
		case "bottom": {
			style.top -= overRect.height * 1.0 + gapX;
			break;
		}
	}
	// eslint-disable-next-line default-case
	switch (overlayOrigin.horizontal) {
		case "left": {
			style.left += gapY;

			break;
		}
		case "center": {
			style.left -= overRect.width * 0.5;
			break;
		}
		case "right": {
			style.left -= overRect.width * 1.0 + gapY;
			break;
		}
	}

	return (
		<div ref={pop} style={{ position: "relative" }}>
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
