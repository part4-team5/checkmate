"use client";

import useModalStore from "@/app/_store/ModalStore";
import { useCallback } from "react";

// 모달을 열고 닫는 함수
const useOverlay = () => {
	const { addOverlay, removeOverlay, isArrEmpty, modalElements } = useModalStore();

	const open = useCallback(
		(render: ({ isOpen, close }: { isOpen: boolean; close: () => void }) => JSX.Element) => {
			const id = crypto.randomUUID(); // 랜덤 ID 생성
			// 같은 모달이 이미 열려 있는지 확인
			const isAlreadyOpen = modalElements.some((modal) => modal.id === id);
			if (isAlreadyOpen) return;

			// 모달 닫기 함수
			const close = () => {
				removeOverlay(id);
				if (isArrEmpty()) {
					// 모달이 모두 닫히면 body 스크롤 활성화
					document.body.style.overflow = "unset";
				}
			};

			const element = () => render({ isOpen: true, close });

			addOverlay({ id, element });
			// 모달이 열리면 body 스크롤 비활성화
			document.body.style.overflow = "hidden";
		},
		[addOverlay, removeOverlay, isArrEmpty, modalElements],
	);

	return { open };
};

export default useOverlay;
