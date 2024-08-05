"use client";

function serialize(value: unknown) {
	return JSON.stringify({ "#": value });
}

function deserialize(value: string) {
	return JSON.parse(value)["#"];
}

export default class Cookie {
	public static get(key: string) {
		const match = new RegExp(`${key}=[^;]+`).exec(document.cookie);
		return match ? deserialize(decodeURIComponent(match.toString().replace(/^[^=]+./, ""))) : null;
	}

	public static set(key: string, value: unknown) {
		// @ts-expect-error
		document.cookie = `${key}=${encodeURIComponent(serialize(value))}; path=/; max-age=${[undefined, NaN, null].includes(value) ? -1 : 60 * 60 * 24}`;
	}
}
