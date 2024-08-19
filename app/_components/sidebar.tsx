"use client";

import { motion, AnimatePresence } from "framer-motion";

type SideBarProps = {
	close: () => void;
	children: React.ReactNode;
};
export default function SideBarWrapper({ close, children }: SideBarProps) {
	const handleButtonClick = () => {
		if (close) {
			close();
		}
	};
	const isAboveMobile = window.innerWidth > 744;
	/* eslint-disable jsx-a11y/click-events-have-key-events */
	/* eslint-disable jsx-a11y/no-static-element-interactions */
	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50" onClick={handleButtonClick}>
				<motion.div
					className="fixed bottom-0 h-[calc(100vh-60px)] w-full overflow-y-auto bg-background-secondary pb-72 scrollbar:w-2 scrollbar:bg-background-primary scrollbar-thumb:bg-background-tertiary tablet:right-0 tablet:w-[55%] desktop:w-[45%]"
					onClick={(e) => e.stopPropagation()}
					initial={{ y: isAboveMobile ? "0%" : "100%", x: isAboveMobile ? "100%" : "0%" }}
					animate={{ y: "0%", x: "0%" }}
					exit={{ y: "100%" }}
					transition={{
						duration: isAboveMobile ? 0.4 : 0.2,
						ease: ["easeOut", "easeInOut", "easeIn"],
					}}
				>
					{children}
				</motion.div>
			</div>
		</AnimatePresence>
	);
}
