import Cookie from "@/app/_utils/Cookie";

const CACHE = new Map<string, string>();

export default abstract class Token {
	private constructor() {
		// final
	}

	public static get ACCESS() {
		return CACHE.get("accessToken") ?? Cookie.get("accessToken")!;
	}

	public static set ACCESS(value: string) {
		if (typeof window === "undefined") {
			CACHE.set("refreshToken", value);
		}
		Cookie.set("accessToken", value);
	}

	public static get REFRESH() {
		return CACHE.get("refreshToken") ?? Cookie.get("refreshToken")!;
	}

	public static set REFRESH(value: string) {
		if (typeof window === "undefined") {
			CACHE.set("refreshToken", value);
		}
		Cookie.set("refreshToken", value);
	}
}
