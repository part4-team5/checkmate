import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WarningIcon from "@/public/icons/ic_warning";

interface ToastPopupProps {
	message: string;
	position?: "top" | "bottom"; // 'top' 또는 'bottom'으로 위치를 결정할 수 있음
}

export default function ToastPopup({ message, position = "bottom" }: ToastPopupProps) {
	const [show, setShow] = useState(true);

	// 2초 후에 자동으로 사라지도록 설정
	setTimeout(() => {
		setShow(false);
	}, 2000);

	const positionClass = position === "top" ? "top-20" : "bottom-20";

	return (
		<div className="flex justify-center">
			<AnimatePresence>
				{show && (
					<motion.div
						key="toast"
						initial={{ y: position === "top" ? -50 : 50, opacity: 0 }} // 위치에 따라 애니메이션 시작 지점 변경
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: position === "top" ? -50 : 50, opacity: 0 }} // 위치에 따라 애니메이션 종료 지점 변경
						transition={{
							type: "spring", //스프링이 튕기는 것 같은 모션
							stiffness: 300, // 높을 수록 더 단단하고 빠르게 움직임
							damping: 20, // 잔여 진동 조정
							duration: 0.5, // 사라질 때의 애니메이션 길이
						}}
						className={`z-60 fixed ${positionClass} transform rounded bg-[#333] px-4 py-2 text-white shadow-lg`}
					>
						<div className="flex items-center justify-center gap-[10px]">
							<WarningIcon width={15} height={15} />
							{message}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
