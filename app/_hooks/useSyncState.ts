import { useCallback, useEffect, useState } from "react";

const [CACHE, TARGET, CHANNEL] = [new Map<string, unknown>(), new EventTarget(), new BroadcastChannel("useCrossState")];

const enum Protocol {
	SYNC,
	UPDATE,
}

class Message<T> {
	constructor(
		public readonly type: Protocol,
		public readonly key: string,
		public readonly value: T,
	) {
		// TODO: none
	}
}
//
// overloads
//
export default function useSyncState<T>(key: string): [T | null, (value: T | null | ((_: T | null) => T | null)) => void];
export default function useSyncState<T>(key: string, fallback?: T | (() => T)): [T, (value: T | ((_: T) => T)) => void];
//
// implementation
//
export default function useSyncState<T>(key: string, fallback?: T | (() => T)) {
	const [data, setData] = useState<T>(() => {
		if (CACHE.has(key)) {
			return CACHE.get(key) as T;
		}
		return fallback instanceof Function ? fallback() : (fallback ?? (null as T));
	});

	const setter = useCallback(
		(_: T | ((_: T) => T)) => {
			const signal = _ instanceof Function ? _(data) : _;
			//
			// STEP 3. (waterfall) component -> page -> tabs
			//
			if (signal !== data) {
				const msg = new Message(Protocol.UPDATE, key, signal);
				// component
				setData(signal);
				// page
				TARGET.dispatchEvent(CACHE.set(key, signal) && new CustomEvent("msg", { detail: msg }));
				// tabs
				CHANNEL.postMessage(msg);
			}
		},
		[key, data],
	);

	const protocol = useCallback(
		(msg: Message<T>) => {
			//
			// STEP 2. match key & value
			//
			if (msg.key === key && msg.value !== data) {
				// eslint-disable-next-line default-case
				switch (msg.type) {
					case Protocol.SYNC: {
						//
						// STEP 3. send back data
						//
						CHANNEL.postMessage(new Message(Protocol.UPDATE, key, data));
						break;
					}
					case Protocol.UPDATE: {
						//
						// STEP 3. reflect msg
						//
						setData(msg.value);
						break;
					}
				}
			}
		},
		[key, data],
	);

	useEffect(() => {
		function handle(event: CustomEvent) {
			protocol(event.detail as Message<T>);
		}
		// @ts-ignore
		TARGET.addEventListener("msg", handle);
		// @ts-ignore
		return () => TARGET.removeEventListener("msg", handle);
	}, [protocol]);

	useEffect(() => {
		function handle(event: MessageEvent) {
			protocol(event.data as Message<T>);
		}
		CHANNEL.addEventListener("message", handle);
		return () => CHANNEL.removeEventListener("message", handle);
	}, [protocol]);

	/** @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API */
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		function handle(event: Event) {
			if (!document.hidden) {
				//
				// STEP 1. synchronize
				//
				CHANNEL.postMessage(new Message<T>(Protocol.SYNC, key, data));
			}
		}
		document.addEventListener("visibilitychange", handle);
		return () => document.removeEventListener("visibilitychange", handle);
	}, [key, data]);

	useEffect(() => {
		//
		// STEP 1. synchronize
		//
		CHANNEL.postMessage(new Message<T>(Protocol.SYNC, key, data));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [data, setter] as [T, typeof setter];
}
