"use client";

import { motion, AnimatePresence } from "framer-motion";

type ModalProps = {
	close: () => void;
	children: React.ReactNode;
};
export default function ModalWrapper({ close, children }: ModalProps) {
	const handleButtonClick = () => {
		if (close) {
			close();
		}
	};
	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 tablet:items-center tablet:justify-center"
				onClick={handleButtonClick}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<motion.div
					className="fixed bottom-0 w-full rounded-t-xl bg-background-secondary px-4 pb-8 pt-4 text-text-primary tablet:relative tablet:w-auto tablet:rounded-xl"
					onClick={(e) => e.stopPropagation()}
					initial={{ y: "100%" }}
					animate={{ y: "0%" }}
					exit={{ y: "100%" }}
				>
					{children}
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
