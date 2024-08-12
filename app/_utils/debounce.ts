const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>): ReturnType<T> => {
		let result: any;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			result = fn(...args);
		}, delay);
		return result;
	};
};

export default debounce;
