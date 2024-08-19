/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import Button from "@/app/_components/Button";
import useOverlay from "@/app/_hooks/useOverlay";
import { motion } from "framer-motion";
import { useCallback } from "react";
import dynamic from "next/dynamic";

const TodoModal = dynamic(() => import("@/app/(team)/[id]/todo/_components/AddTodoModal"), { ssr: false });

export default function AddTodo({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
	const overlay = useOverlay();

	return (
		<motion.div drag="x" dragConstraints={containerRef} className="fixed bottom-12 right-7 h-[48px] w-[125px] desktop:right-[calc((100dvw-1200px)/2)]">
			<Button rounded="full" onClick={useCallback(() => overlay.open((props) => <TodoModal {...props} />), [overlay])}>
				+할 일 추가
			</Button>
		</motion.div>
	);
}
