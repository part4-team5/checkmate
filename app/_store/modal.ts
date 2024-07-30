import { create } from "zustand";

type ModalState = {
	modals: { [key: string]: boolean };
	openModal: (id: string) => void;
	closeModal: (id: string) => void;
	isModalOpen: (id: string) => boolean;
};
/**
 * 모달 상태를 관리하는 zustand 코드입니다.
 * 기본적으로 모달마다 고유한 id를 가지며, 해당 id를 통해 모달을 열거나 닫을 수 있습니다.
 * 모달을 열거나 닫을 경우 modals 객체에 해당 모달의 id를 키로 하는 boolean 값을 설정합니다.
 * isModalOpen 함수를 통해 해당 모달이 열려있는지 확인할 수 있습니다.
 * @example
 * const { isModalOpen, openModal, closeModal } = useModalStore();
 * openModal("테스트");
 */
const useModalStore = create<ModalState>((set, get) => ({
	modals: {},
	openModal: (id: string) => set((state) => ({ modals: { ...state.modals, [id]: true } })),
	closeModal: (id: string) => set((state) => ({ modals: { ...state.modals, [id]: false } })),
	isModalOpen: (id: string) => get().modals[id],
}));

export default useModalStore;
