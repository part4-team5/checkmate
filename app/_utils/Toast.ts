import ToastStore, { ToastType } from "@/app/_store/ToastStore";

const toast = {
	success: (message: string, duration: number = 2000) => ToastStore.getState().addToast(message, "success", duration),
	error: (message: string, duration: number = 2000) => ToastStore.getState().addToast(message, "error", duration),
	warning: (message: string, duration: number = 2000) => ToastStore.getState().addToast(message, "warning", duration),
	info: (message: string, duration: number = 2000) => ToastStore.getState().addToast(message, "info", duration),
	loading: (message: string) => ToastStore.getState().addToast(message, "loading"),
	remove: (id: number) => ToastStore.getState().removeToast(id),
	updateToast: (id: number, message: string, type: ToastType, duration?: number) => ToastStore.getState().updateToast(id, message, type, duration),

	/**
	 * Promise를 받아와서 로딩, 성공, 에러 메시지를 토스트로 띄웁니다.
	 * @param promise - 토스트로 띄울 Promise
	 * @param msgs - 로딩, 성공, 에러 메시지
	 * @returns Promise
	 * @example
	 * toast.promise(
	 *  mutation.mutateAsync({}),
	 * {
	 * 	loading: "로딩 중...",
	 * 	success: "성공!",
	 * 	error: "에러 발생!",
	 * });
	 */
	promise: <T>(
		promise: Promise<T>,
		msgs: {
			loading: string;
			success: string | ((data: T) => string);
			error: string | ((error: any) => string);
		},
	) => {
		const id = toast.loading(msgs.loading);

		promise
			.then((result) => {
				toast.updateToast(id, typeof msgs.success === "function" ? msgs.success(result) : msgs.success, "success", 2000);
			})
			.catch((error) => {
				toast.updateToast(id, typeof msgs.error === "function" ? msgs.error(error) : msgs.error, "error", 2000);
			});

		return promise;
	},
};

export default toast;
