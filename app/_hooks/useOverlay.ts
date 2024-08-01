"use client";

import useModalStore from "@/app/_store/modalStore";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

// 모달을 열고 닫는 함수
const useOverlay = () => {
	const { addModal, removeModal, isArrEmpty, modalElements } = useModalStore();

	const open = useCallback(
		(render: ({ isOpen, close }: { isOpen: boolean; close: () => void }) => JSX.Element) => {
			const id = uuidv4(); // 랜덤 ID 생성
			// 같은 모달이 이미 열려 있는지 확인
			const isAlreadyOpen = modalElements.some((modal) => modal.id === id);
			if (isAlreadyOpen) return;

			// 모달 닫기 함수
			const close = () => {
				removeModal(id);
				if (isArrEmpty()) {
					document.body.style.overflow = "unset";
				}
			};

			const element = () => render({ isOpen: true, close });

			addModal({ id, element });
			document.body.style.overflow = "hidden";
		},
		[addModal, removeModal, isArrEmpty, modalElements],
	);

	return { open };
};

export default useOverlay;
