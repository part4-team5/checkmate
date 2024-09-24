/* eslint-disable default-case */
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
	secondaryPosition?: Position; // 2번 위치를 프롭으로 옵셔널하게 받음
}

interface Origin {
	vertical: "top" | "center" | "bottom";
	horizontal: "left" | "center" | "right";
}

interface Position {
	anchorOrigin: Origin;
	overlayOrigin: Origin;
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
	secondaryPosition,
	children,
}: Readonly<PopoverProps>) {
	const [toggle, setToggle] = useState(init);
	const pop = useRef<HTMLDivElement>(null);
	const over = useRef<HTMLDivElement>(null);
	const [style, setStyle] = useState<React.CSSProperties>({ position: "absolute", visibility: "hidden" });

	const pathname = usePathname();

	useEffect(() => {
		const resize = new ResizeObserver(() => {
			const impl: typeof style = { position: "absolute", zIndex: 69 };
			if (!toggle) impl.visibility = "hidden";

			const popRect = pop.current?.getBoundingClientRect()!;
			const overRect = over.current?.getBoundingClientRect()!;

			// 기본 위치 설정
			let top = 0;
			let left = 0;
			let adjustedAnchorOrigin = anchorOrigin;
			let adjustedOverlayOrigin = overlayOrigin;

			// 기본 anchorOrigin 처리
			switch (adjustedAnchorOrigin.vertical) {
				case "top":
					top = 0;
					break;
				case "center":
					top = popRect.height * 0.5;
					break;
				case "bottom":
					top = popRect.height;
					break;
			}
			switch (adjustedAnchorOrigin.horizontal) {
				case "left":
					left = 0;
					break;
				case "center":
					left = popRect.width * 0.5;
					break;
				case "right":
					left = popRect.width;
					break;
			}

			// 기본 overlayOrigin 처리
			switch (adjustedOverlayOrigin.vertical) {
				case "top":
					top += gapY;
					break;
				case "center":
					top -= overRect.height * 0.5;
					break;
				case "bottom":
					top -= overRect.height + gapY;
					break;
			}
			switch (adjustedOverlayOrigin.horizontal) {
				case "left":
					left += gapX;
					break;
				case "center":
					left -= overRect.width * 0.5;
					break;
				case "right":
					left -= overRect.width + gapX;
					break;
			}

			// 화면 밖으로 나가는지 체크
			const isOutOfBounds = top < 0 || left < 0 || top + overRect.height > window.innerHeight || left + overRect.width > window.innerWidth;

			// 위치가 화면 밖으로 나가고 secondaryPosition이 있는 경우에만 대체 위치로 이동
			if (isOutOfBounds && secondaryPosition) {
				adjustedAnchorOrigin = secondaryPosition.anchorOrigin;
				adjustedOverlayOrigin = secondaryPosition.overlayOrigin;

				// 대체 위치로 다시 설정
				switch (adjustedAnchorOrigin.vertical) {
					case "top":
						top = 0;
						break;
					case "center":
						top = popRect.height * 0.5;
						break;
					case "bottom":
						top = popRect.height;
						break;
				}
				switch (adjustedAnchorOrigin.horizontal) {
					case "left":
						left = 0;
						break;
					case "center":
						left = popRect.width * 0.5;
						break;
					case "right":
						left = popRect.width;
						break;
				}

				// 대체 overlayOrigin 처리
				switch (adjustedOverlayOrigin.vertical) {
					case "top":
						top += gapX;
						break;
					case "center":
						top -= overRect.height * 0.5;
						break;
					case "bottom":
						top -= overRect.height + gapX;
						break;
				}
				switch (adjustedOverlayOrigin.horizontal) {
					case "left":
						left += gapY;
						break;
					case "center":
						left -= overRect.width * 0.5;
						break;
					case "right":
						left -= overRect.width + gapY;
						break;
				}
			}

			impl.top = top;
			impl.left = left;

			setStyle(impl);
		});

		resize.observe(pop.current!);
		return () => resize.disconnect();
	}, [toggle, children, gapY, gapX, anchorOrigin, overlayOrigin, secondaryPosition]);

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

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		if (!readonly && toggle) {
			// eslint-disable-next-line no-inner-declarations
			function handle(event: MouseEvent) {
				if (pop.current && !pop.current.contains(event.target as Element)) {
					setToggle(false);
				}
			}
			document.addEventListener("click", handle, true);
			return () => document.removeEventListener("click", handle, true);
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
			</AnimatePresence>
		</div>
	);
}
