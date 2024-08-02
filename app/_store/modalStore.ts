import { create } from "zustand";

type ModalElement = {
	id: string;
	element: () => JSX.Element;
};

type ModalState = {
	modalElements: ModalElement[];
	addModal: (modal: ModalElement) => void;
	removeModal: (id: string) => void;
	isArrEmpty: () => boolean;
};

// 전역으로 모달 관리
const useModalStore = create<ModalState>((set, get) => ({
	modalElements: [],
	addModal: (modal: ModalElement) => set((state) => ({ modalElements: [...state.modalElements, modal] })),
	removeModal: (id: string) => set((state) => ({ modalElements: state.modalElements.filter((modal) => modal.id !== id) })),
	isArrEmpty: () => get().modalElements.length === 0,
}));

export default useModalStore;
