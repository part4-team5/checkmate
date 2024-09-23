/* eslint-disable @typescript-eslint/lines-between-class-members */

"use client";

import ReactDOM from "react-dom/client";
import { useCallback, useState, useEffect } from "react";
import Icon from "@/app/_icons";
import Popover from "@/app/_components/Popover";

export default class Tour {
	private static dom: HTMLElement;
	private static root: ReactDOM.Root;

	public static play(steps: Guide[]) {
		if (!this.dom) {
			document.body.append((this.dom = document.createElement("div")));
		}
		hash(JSON.stringify(steps), "sha-256").then((sha256) => {
			if (!(sha256 in localStorage)) {
				// restore
				this.dom.style.display = "block";

				(this.root ??= ReactDOM.createRoot(this.dom)).render(
					<Impl
						steps={steps}
						exit={() => {
							this.root.render(null);
							this.dom.style.display = "none";
						}}
						close={() => {
							localStorage.setItem(sha256, ":3");
						}}
					/>,
				);
			}
		});
	}
}

function Impl({ steps, exit, close }: { steps: Guide[]; exit: () => void; close: () => void }) {
	const [stage, setStage] = useState(0);
	const [style, setStyle] = useState<React.CSSProperties>({});

	useEffect(() => {
		function handle() {
			exit();
		}
		window.addEventListener("popstate", handle);
		return () => window.removeEventListener("popstate", handle);
	}, [exit]);

	useEffect(() => {
		const target = document.querySelector(steps[stage].query);

		if (!target) throw new Error();

		target.scrollIntoView({ block: "center" });

		const observer = new ResizeObserver(() => {
			const a = target.getBoundingClientRect();
			const b = getComputedStyle(target);

			setStyle(() => {
				const impl: typeof style = {};

				impl.top = a.top;
				impl.left = a.left;
				impl.width = a.width;
				impl.height = a.height;
				impl.borderTopLeftRadius = b.borderTopLeftRadius;
				impl.borderTopRightRadius = b.borderTopRightRadius;
				impl.borderBottomLeftRadius = b.borderBottomLeftRadius;
				impl.borderBottomRightRadius = b.borderBottomRightRadius;

				return impl;
			});
		});
		observer.observe(document.body);
		return () => observer.disconnect();
	}, [steps, stage]);

	const prev = useCallback(() => {
		if (0 <= stage - 1) {
			setStage(stage - 1);
		}
	}, [stage]);

	const next = useCallback(() => {
		if (stage + 1 < steps.length) {
			setStage(stage + 1);
		}
	}, [stage, steps.length]);

	// 반환 타입을 명시적으로 Position으로 지정
	const getPositionConfig = (position: "top" | "left" | "right" | "bottom"): Position => {
		switch (position) {
			case "top":
				return {
					anchorOrigin: { vertical: "top", horizontal: "right" },
					overlayOrigin: { vertical: "bottom", horizontal: "right" },
				};
			case "left":
				return {
					anchorOrigin: { vertical: "top", horizontal: "left" },
					overlayOrigin: { vertical: "top", horizontal: "right" },
				};
			case "right":
				return {
					anchorOrigin: { vertical: "top", horizontal: "right" },
					overlayOrigin: { vertical: "top", horizontal: "left" },
				};
			case "bottom":
				return {
					anchorOrigin: { vertical: "bottom", horizontal: "left" },
					overlayOrigin: { vertical: "top", horizontal: "left" },
				};
			default:
				throw new Error("Invalid position");
		}
	};

	const gapX = steps[stage].position === "left" || steps[stage].position === "right" ? 0 : 10;
	const gapY = steps[stage].position === "top" || steps[stage].position === "bottom" ? 0 : 10;

	const args: Partial<Parameters<typeof Popover>[0]> = {
		gapX,
		gapY,
		...getPositionConfig(steps[stage].position),
		secondaryPosition: steps[stage].secondaryPosition ? getPositionConfig(steps[stage].secondaryPosition) : undefined,
	};

	return (
		<div className="fixed inset-0 z-[69] h-screen w-screen bg-black/75">
			<div className="fixed border border-white bg-white/25 transition-all" style={style}>
				<Popover
					init
					readonly
					gapX={args.gapY}
					gapY={args.gapX}
					anchorOrigin={args.anchorOrigin!}
					overlayOrigin={args.overlayOrigin!}
					secondaryPosition={args.secondaryPosition}
					// eslint-disable-next-line react/no-unstable-nested-components
					overlay={() => (
						<div className="relative flex flex-col gap-[10px] overflow-hidden whitespace-nowrap rounded-[12px] border border-border-primary bg-background-primary px-[30px] py-[16px] pt-[38px] text-text-primary shadow-history">
							<div className="absolute left-0 right-0 top-0 flex h-[24px] items-center bg-background-tertiary px-[8px]">
								<div className="grow" />
								<button
									type="button"
									aria-label="prev"
									className="flex aspect-square w-[16px] items-center rounded-full"
									onClick={() => {
										exit();
										close();
									}}
								>
									<Icon.Close width={16} height={16} color="var(--text-primary)" />
								</button>
							</div>
							{steps[stage].content}
							<div className="flex items-center justify-evenly">
								<button type="button" aria-label="prev" onClick={prev}>
									<Icon.ArrowLeft width={24} height={24} color="var(--text-primary)" />
								</button>
								{stage + 1}/{steps.length}
								<button type="button" aria-label="next" onClick={next}>
									<Icon.ArrowRight width={24} height={24} color="var(--text-primary)" />
								</button>
							</div>
						</div>
					)}
				>
					<div className="h-full w-full" />
				</Popover>
			</div>
		</div>
	);
}

interface Guide {
	query: string;
	content: string;
	position: "top" | "left" | "right" | "bottom";
	secondaryPosition?: "top" | "left" | "right" | "bottom";
}

interface Position {
	anchorOrigin: Origin;
	overlayOrigin: Origin;
}

interface Origin {
	vertical: "top" | "center" | "bottom";
	horizontal: "left" | "center" | "right";
}

/** @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest */
async function hash(value: string, algorithm: AlgorithmIdentifier) {
	// converts an ArrayBuffer to a hex string
	return Array.from(new Uint8Array(await crypto.subtle.digest(algorithm, new TextEncoder().encode(value))))
		.map((byte) => byte.toString(16).padStart(2, "0"))
		.join("");
}
