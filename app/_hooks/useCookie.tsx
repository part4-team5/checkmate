import { useCallback } from "react";

import Cookie from "@/app/_utils/Cookie";

import useCrossState from "@/app/_hooks/useCrossState";
//
// overloads
//
export default function useCookie<T>(key: string): [T | null, (value: T | null | ((_: T | null) => T | null)) => void];
export default function useCookie<T>(key: string, fallback?: T | (() => T)): [T, (value: T | ((_: T) => T)) => void];
//
// implementation
//
export default function useCookie<T>(key: string, fallback?: T | (() => T)) {
	// :3
	const [value, setValue] = useCrossState<T>(key, Cookie.get(key) ?? (fallback instanceof Function ? fallback() : fallback));

	const setter = useCallback(
		(_: T | ((_: T) => T)) => {
			const signal = _ instanceof Function ? _(value) : _;
			Cookie.set(key, signal);
			setValue(signal);
		},
		[key, value, setValue],
	);

	return [value, setter] as [T, typeof setter];
}
