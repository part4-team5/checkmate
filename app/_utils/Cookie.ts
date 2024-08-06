function serialize(value: unknown) {
	return JSON.stringify({ "#": value });
}

function deserialize(value: string) {
	return JSON.parse(value)["#"];
}

export default class Cookie {
	public static get(key: string) {
		switch (typeof window) {
			case "undefined": {
				//
				// server side
				//
				// eslint-disable-next-line global-require
				const { cookies } = require("next/headers");

				const store = cookies();

				return store.has(key) ? deserialize(store.get(key).value) : null;
			}
			default: {
				//
				// client side
				//
				const match = new RegExp(`${key}=[^;]+`).exec(document.cookie);
				return match ? deserialize(decodeURIComponent(match.toString().replace(/^[^=]+./, ""))) : null;
			}
		}
	}

	public static set(key: string, value: unknown) {
		// :3
		const data = encodeURIComponent(serialize(value));

		switch (typeof window) {
			case "undefined": {
				//
				// server side
				//
				// eslint-disable-next-line global-require
				const { cookies } = require("next/headers");

				const store = cookies();

				store.set(key, data, { path: "/", maxAge: 60 * 60 * 24 });
				break;
			}
			default: {
				//
				// client side
				//
				document.cookie = `${key}=${data}; path=/; max-age=${60 * 60 * 24}`;
				break;
			}
		}
	}
}