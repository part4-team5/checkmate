import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export interface PopoverProps extends React.PropsWithChildren {
	overlay: (close: () => void) => JSX.Element;
	gapX?: number;
	gapY?: number;
	init?: boolean;
	onOpen?: () => void;
	onClose?: () => void;
	readonly?: boolean;
	anchorOrigin: Origin;
	overlayOrigin: Origin;
}

interface Origin {
	vertical: "top" | "center" | "bottom";
	horizontal: "left" | "center" | "right";
}

export default function Popover({
	overlay,
	gapX = 0,
	gapY = 0,
	init = false,
	onOpen,
	onClose,
	readonly,
	anchorOrigin,
	overlayOrigin,
	children,
}: Readonly<PopoverProps>) {
	const [toggle, setToggle] = useState(init);
	const pop = useRef<HTMLDivElement>(null);
	const over = useRef<HTMLDivElement>(null);
	const [style, setStyle] = useState<React.CSSProperties>({ display: "none" });

	const pathname = usePathname();

	useEffect(() => {
		const resize = new ResizeObserver(() => {
			const impl: typeof style = { position: "absolute", zIndex: 69 };

			if (!toggle) {
				impl.display = "none";
			} else {
				impl.display = "block";
			}

			const popRect = pop.current?.getBoundingClientRect();
			const overRect = over.current?.getBoundingClientRect();

			if (!popRect || !overRect) {
				return; // popRect나 overRect가 정의되지 않은 경우 종료
			}

			// eslint-disable-next-line default-case
			switch (anchorOrigin.vertical) {
				case "top":
					impl.top = 0;
					break;
				case "center":
					impl.top = popRect.height * 0.5;
					break;
				case "bottom":
					impl.top = popRect.height;
					break;
			}

			// eslint-disable-next-line default-case
			switch (anchorOrigin.horizontal) {
				case "left":
					impl.left = 0;
					break;
				case "center":
					impl.left = popRect.width * 0.5;
					break;
				case "right":
					impl.left = popRect.width;
					break;
			}

			// eslint-disable-next-line default-case
			switch (overlayOrigin.vertical) {
				case "top":
					impl.top! += gapY;
					break;
				case "center":
					impl.top! -= overRect.height * 0.5;
					break;
				case "bottom":
					impl.top! -= overRect.height + gapY;
					break;
			}

			// eslint-disable-next-line default-case
			switch (overlayOrigin.horizontal) {
				case "left":
					impl.left! += gapX;
					break;
				case "center":
					impl.left! -= overRect.width * 0.5;
					break;
				case "right":
					impl.left! -= overRect.width + gapX;
					break;
			}

			setStyle(impl);
		});

		if (pop.current) {
			resize.observe(pop.current);
		}

		return () => resize.disconnect();
	}, [toggle, children, gapY, gapX, anchorOrigin, overlayOrigin]);

	useEffect(() => {
		if (!readonly) {
			setToggle(false);
		}
	}, [readonly, pathname]);

	useEffect(() => {
		if (toggle) {
			onOpen?.();
		} else {
			onClose?.();
		}
	}, [toggle, onOpen, onClose]);

	const handleClickOutside = (event: MouseEvent) => {
		if (pop.current && !pop.current.contains(event.target as Element)) {
			setToggle(false);
		}
	};

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (!readonly && toggle) {
			document.addEventListener("click", handleClickOutside, true);
			return () => document.removeEventListener("click", handleClickOutside, true);
		}
	}, [readonly, toggle]);

	const onClick = useCallback(() => {
		if (!readonly) {
			setToggle((prev) => !prev);
		}
	}, [readonly]);

	return (
		<div ref={pop} style={{ position: "relative" }} className="h-full w-full">
			<div
				aria-hidden="true"
				onClick={onClick}
				onMouseUp={(event) => event.stopPropagation()}
				onMouseDown={(event) => event.stopPropagation()}
				className="h-full w-full"
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
						onAnimationComplete={() => {
							if (!toggle) setStyle((prevStyle) => ({ ...prevStyle, display: "none" }));
						}}
					>
						{overlay(() => setToggle(false))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
