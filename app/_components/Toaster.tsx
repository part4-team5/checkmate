"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useToastStore from "@/app/_store/toastStore";
import Icon from "@/app/_icons";

function Toaster() {
	const { toasts, removeToast, clearToasts } = useToastStore();
	const pathname = usePathname();

	// 라우트 변경 시 toast 초기화
	useEffect(() => {
		clearToasts();
	}, [pathname, clearToasts]);

	const style = (type: string) => {
		switch (type) {
			case "info":
				return "bg-white text-black";
			case "success":
				return "bg-white text-black";
			case "error":
				return "bg-white text-black";
			case "warning":
				return "bg-white text-black";
			default:
				return "bg-white text-black";
		}
	};

	const animation = (type: string) => {
		switch (type) {
			case "error":
				return {
					initial: { opacity: 0, y: -20 },
					animate: {
						opacity: 1,
						y: 0,
						x: [0, -10, 10, -10, 10, -10, 10, 0],
						transition: { duration: 0.6, ease: "easeInOut" },
					},
					exit: { opacity: 0, y: -20 },
				};
			case "success":
			case "info":
			case "warning":
				return {
					initial: { opacity: 0, y: -20 },
					animate: { opacity: 1, y: 0 },
					exit: { opacity: 0, y: -20 },
				};
			default:
				return {
					initial: { opacity: 0, y: -20 },
					animate: { opacity: 1, y: 0 },
					exit: { opacity: 0, y: -20 },
				};
		}
	};

	const icon = (type: string) => {
		switch (type) {
			case "info":
				return <Icon.Info width={24} height={24} color="#3B82F6" />;
			case "success":
				return <Icon.CheckAnimation />;
			case "error":
				return (
					<div className="rounded-full bg-status-danger p-1">
						<Icon.Close width={14} height={14} color="#fff" />
					</div>
				);
			case "warning":
				return <p className="text-[18px]">⚠️</p>;
			case "loading":
				return (
					<div className="animate-spin">
						<Icon.Loading width={16} height={16} />
					</div>
				);
			default:
				return "";
		}
	};

	return (
		<div className="fixed right-1/2 top-10 z-50 flex translate-x-1/2 flex-col items-center justify-center space-y-2 transition-all">
			<AnimatePresence>
				{toasts.map((toast) => (
					<motion.div
						key={toast.id}
						initial={animation(toast.type).initial}
						animate={animation(toast.type).animate}
						exit={animation(toast.type).exit}
						transition={{ duration: 0.3 }}
						onClick={() => removeToast(toast.id)}
						className={`w-fit cursor-pointer justify-end rounded-lg p-4 text-lg font-medium shadow-lg ${style(toast.type)}`}
					>
						<div className="flex items-center justify-between gap-2">
							{icon(toast.type)}
							<div>{toast.message}</div>
						</div>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}

export default Toaster;