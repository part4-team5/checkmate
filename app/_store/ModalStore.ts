"use client";

import { create } from "zustand";

type ModalElement = {
	id: string;
	element: () => JSX.Element;
};

type ModalState = {
	modalElements: ModalElement[];
	addOverlay: (modal: ModalElement) => void;
	removeOverlay: (id: string) => void;
	isArrEmpty: () => boolean;
};

// 전역으로 모달 관리
const ModalStore = create<ModalState>((set, get) => ({
	modalElements: [],
	addOverlay: (modal: ModalElement) =>
		set((state) => {
			// 같은 모달이 이미 열려 있는지 확인
			const exists = state.modalElements.some((existingModal) => existingModal.element.toString() === modal.element.toString());
			if (exists) {
				return state;
			}
			return { modalElements: [...state.modalElements, modal] };
		}),
	removeOverlay: (id: string) => set((state) => ({ modalElements: state.modalElements.filter((modal) => modal.id !== id) })),
	isArrEmpty: () => get().modalElements.length === 0,
}));

export default ModalStore;
