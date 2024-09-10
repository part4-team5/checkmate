import { create } from "zustand";

export type ToastType = "success" | "warning" | "error" | "info" | "loading";

interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

interface ToastStoreType {
	toasts: Toast[];
	addToast: (message: string, type: ToastType, duration?: number) => number;
	updateToast: (id: number, message: string, type: ToastType, duration?: number) => void;
	removeToast: (id: number) => void;
	clearToasts: () => void;
}

let toastId = 1;

const useToastStore = create<ToastStoreType>((set) => ({
	toasts: [],
	addToast: (message, type, duration?: number) => {
		// eslint-disable-next-line no-plusplus
		const id = ++toastId;
		set((state) => ({
			toasts: [...state.toasts, { id, message, type }],
		}));

		if (duration) {
			setTimeout(() => {
				set((state) => ({
					toasts: state.toasts.filter((toast) => toast.id !== id),
				}));
			}, duration);
		}

		return id;
	},
	updateToast: (id, message, type, duration) => {
		set((state) => ({
			toasts: state.toasts.map((toast) => (toast.id === id ? { ...toast, message, type } : toast)),
		}));

		if (duration) {
			setTimeout(() => {
				set((state) => ({
					toasts: state.toasts.filter((toast) => toast.id !== id),
				}));
			}, duration);
		}
	},
	removeToast: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((toast) => toast.id !== id),
		})),
	clearToasts: () =>
		set(() => ({
			toasts: [],
		})),
}));

export default useToastStore;
