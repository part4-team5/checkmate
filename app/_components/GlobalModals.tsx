"use client";

import useModalStore from "@/app/_store/modalStore";
import { motion, AnimatePresence } from "framer-motion";
// 외부에서 모달을 랜더링하는 컴포넌트
export default function GlobalModals() {
	const { modalElements, removeModal, isArrEmpty } = useModalStore();

	const handleClose = (id: string) => {
		removeModal(id);

		if (isArrEmpty()) {
			document.body.style.overflow = "unset";
		}
	};

	return (
		<AnimatePresence>
			{modalElements.map(({ id, element }) => (
				<motion.div
					key={id}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 tablet:items-center tablet:justify-center"
					onClick={() => handleClose(id)}
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
						{element()}
					</motion.div>
				</motion.div>
			))}
		</AnimatePresence>
	);
}
