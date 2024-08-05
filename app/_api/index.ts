/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

import Cookie from "@/app/_utils/Cookie";

const BASE_URL = "https://fe-project-cowokers.vercel.app";

abstract class Token {
	private constructor() {
		// final
	}

	public static get ACCESS() {
		return Cookie.get("accessToken");
	}

	public static set ACCESS(value: string) {
		Cookie.set("accessToken", value);
	}

	public static get REFRESH() {
		return Cookie.get("refreshToken");
	}

	public static set REFRESH(value: string) {
		Cookie.set("refreshToken", value);
	}
}

const enum MIME {
	JSON = "application/json",
	FORM_DATA = "multipart/form-data",
}

function createURL(url: string, query: object) {
	const location = new URL(url);

	location.search = (() => {
		const impl = new URLSearchParams();

		// eslint-disable-next-line no-restricted-syntax
		for (const [key, value] of Object.entries(query)) {
			if (![undefined, null].includes(value)) {
				impl.set(key, value);
			}
		}
		return impl.toString();
	})();

	return location.toString();
}

/** @see https://fe-project-cowokers.vercel.app/docs/ */
export default abstract class API {
	private constructor() {
		// final
	}

	private static SEND<T>(type: MIME, method: string, url: string, { payload, retries = 0 }: { payload?: object; retries?: number }) {
		const [headers, body] = [
			(() => {
				const impl: HeadersInit = { "Content-Type": type, accept: MIME.JSON };

				if (Token.ACCESS) {
					impl.Authorization = `Bearer ${Token.ACCESS}`;
				}
				// eslint-disable-next-line default-case
				switch (type) {
					case MIME.FORM_DATA: {
						delete impl["Content-Type"];
						break;
					}
				}
				return impl;
			})(),
			(() => {
				const impl: BodyInit = JSON.stringify(payload);

				return impl;
			})(),
		];

		return new Promise<T>((resolve, reject) => {
			fetch(url, { method, headers, body }).then(async (response) => {
				if (!response.ok) {
					if (response.status === 401 && retries < 5 && Token.REFRESH) {
						const data = await API["{teamId}/auth/refresh-token"].POST({}, { refreshToken: Token.REFRESH });

						Token.ACCESS = data.accessToken;

						return resolve(await API.SEND(type, method, url, { payload, retries: retries + 1 }));
					}
					return reject(await response.json());
				}
				return resolve(await response.json());
			});
		});
	}

	private static GET<T>(type: MIME, url: string, query: object) {
		return this.SEND<T>(type, "GET", createURL(url, query), {});
	}

	private static PUT<T>(type: MIME, url: string, query: object, body: object) {
		return this.SEND<T>(type, "PUT", createURL(url, query), { payload: body });
	}

	private static POST<T>(type: MIME, url: string, query: object, body: object) {
		return this.SEND<T>(type, "POST", createURL(url, query), { payload: body });
	}

	private static PATCH<T>(type: MIME, url: string, query: object, body: object) {
		return this.SEND<T>(type, "PATCH", createURL(url, query), { payload: body });
	}

	private static DELETE<T>(type: MIME, url: string, query: object) {
		return this.SEND<T>(type, "DELETE", createURL(url, query), {});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected GET(query: unknown): Promise<unknown> {
		throw new Error("Unimplemented");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected PUT(query: unknown, body: unknown): Promise<unknown> {
		throw new Error("Unimplemented");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected POST(query: unknown, body: unknown): Promise<unknown> {
		throw new Error("Unimplemented");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected PATCH(query: unknown, body: unknown): Promise<unknown> {
		throw new Error("Unimplemented");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected DELETE(query: unknown): Promise<unknown> {
		throw new Error("Unimplemented");
	}

	public static readonly ["{teamId}/user"] = new (class extends API {
		public override GET({ teamId = "6-5", ...query }: { teamId?: string }) {
			return API.GET<{
				groups: {
					role: Role;
					userImage: string;
					userEmail: string;
					userName: string;
					groupId: number;
					userId: number;
				}[];
				teamId?: string;
				image: string;
				nickname: string;
				updatedAt: string;
				createdAt: string;
				email: string;
				id: number;
			}>(MIME.JSON, `${BASE_URL}/${teamId}/user`, query);
		}

		public override PATCH({ teamId = "6-5", ...query }: { teamId?: string }, body: UpdateUserBody) {
			return API.PATCH<{ message: string }>(MIME.JSON, `${BASE_URL}/${teamId}/user`, query, body);
		}

		public override DELETE({ teamId = "6-5", ...query }: { teamId?: string }) {
			return API.DELETE<{}>(MIME.JSON, `${BASE_URL}/${teamId}/user`, query);
		}
	})();

	public static readonly ["{teamId}/user/groups"] = new (class extends API {
		public override GET({ teamId = "6-5", ...query }: { teamId?: string }) {
			return API.GET<{
				role: Role;
				userImage: string;
				userEmail: string;
				userName: string;
				groupId: number;
				userId: number;
			}>(MIME.JSON, `${BASE_URL}/${teamId}/user/groups`, query);
		}
	})();

	public static readonly ["{teamId}/user/history"] = new (class extends API {
		public override GET({ teamId = "6-5", ...query }: { teamId?: string }) {
			return API.GET<{
				tasksDone: {
					deletedAt: string;
					userId: number;
					recurringId: number;
					frequncy: Frequency;
					date: string;
					doneAt: string;
					description: string;
					name: string;
					updatedAt: string;
					id: number;
				}[];
			}>(MIME.JSON, `${BASE_URL}/${teamId}/user/history`, query);
		}
	})();

	public static readonly ["{teamId}/user/send-reset-password-email"] = new (class extends API {
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: SendResetPasswordEmailRequest) {
			return API.POST<{ message: string }>(MIME.JSON, `${BASE_URL}/${teamId}/user/send-reset-password-email`, query, body);
		}
	})();

	public static readonly ["{teamId}/user/reset-password"] = new (class extends API {
		public override PATCH({ teamId = "6-5", ...query }: { teamId?: string }, body: ResetPasswordBody) {
			return API.PATCH<{ message: string }>(MIME.JSON, `${BASE_URL}/${teamId}/user/send-reset-password-email`, query, body);
		}
	})();

	public static readonly ["{teamId}/user/password"] = new (class extends API {
		public override PATCH({ teamId = "6-5", ...query }: { teamId?: string }, body: UpdatePasswordBody) {
			return API.PATCH<{ message: string }>(MIME.JSON, `${BASE_URL}/${teamId}/user/password`, query, body);
		}
	})();

	public static readonly ["{teamId}/groups/{groupId}/task-lists/{id}"] = new (class extends API {
		public override GET({ teamId = "6-5", id, ...query }: { teamId?: string; id: string; date?: string }) {
			return API.GET<{
				groupId: number;
				displayIndex: number;
				updatedAt: string;
				createdAt: string;
				name: string;
				id: number;
				tasks: Task[];
			}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/{groupsId}/task-lists/${id}`, query);
		}

		public override PATCH({ teamId = "6-5", groupId, id, ...query }: { teamId?: string; groupId: number; id: string }, body: { name: string }) {
			return API.PATCH<{
				groupId: number;
				displayIndex: number;
				updatedAt: string;
				createdAt: string;
				name: string;
				id: number;
			}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${id}`, query, body);
		}

		public override DELETE({ teamId = "6-5", id, ...query }: { teamId?: string; id: string }) {
			return API.DELETE<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/{groupsId}/task-lists/${id}`, query);
		}
	})();

	public static readonly ["{teamId}/groups/{groupId}/task-lists"] = new (class extends API {
		public override POST({ teamId = "6-5", groupId, ...query }: { teamId?: string; groupId: number }, body: { name: string }) {
			return API.POST<{
				groupId: number;
				displayIndex: number;
				updatedAt: string;
				createdAt: string;
				name: string;
				id: number;
			}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists`, query, body);
		}
	})();

	public static readonly ["{teamId}/groups/{groupId}/task-lists/{id}/order"] = new (class extends API {
		public override POST({ teamId = "6-5", groupId, id, ...query }: { teamId?: string; groupId: number; id: number }, body: { displayIndex: string }) {
			return API.POST<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${id}/order`, query, body);
		}
	})();

	public static readonly ["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"] = new (class extends API {
		public override POST(
			{ teamId = "6-5", groupId, taskListId, ...query }: { teamId?: string; groupId: number; taskListId: number },
			body: TaskRecurringCreateDto,
		) {
			return API.POST<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${taskListId}/tasks`, query, body);
		}
	})();

	public static readonly ["{teamId}/auth/refresh-token"] = new (class extends API {
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: { refreshToken: string }) {
			return API.POST<{ accessToken: string }>(MIME.JSON, `${BASE_URL}/${teamId}/auth/refresh-token`, query, body);
		}
	})();
}

const enum Role {
	ADMIN = "ADMIN",
	MEMBER = "MEMBER",
}

const enum Frequency {
	ONCE = "ONCE",
	DAILY = "DAILY",
	WEEKLY = "WEEKLY",
	MONTHLY = "MONTHLY",
}

interface UpdateUserBody {
	nickname: string;
	image: string;
}

interface SendResetPasswordEmailRequest {
	email: string;
	redirectUrl: string;
}

interface ResetPasswordBody {
	passwordConfirmation: string;
	password: string;
	token: string;
}

interface UpdatePasswordBody {
	passwordConfirmation: string;
	password: string;
}

interface Task {
	deletedAt: string;
	recurringId: number;
	frequency: number;
	userId: number;
	date: string;
	doneAt: string;
	updatedAt: string;
	name: string;
	id: number;
}

type TaskRecurringCreateDto = MonthlyRecurringCreateBody | WeeklyRecurringCreateBody | DailyRecurringCreateBody | OnceRecurringCreateBody;

interface MonthlyRecurringCreateBody {
	name: string;
	description?: string;
	displayIndex?: number;
	frequencyType: Frequency.MONTHLY;
	monthDay: number;
}

interface WeeklyRecurringCreateBody {
	name: string;
	description?: string;
	displayIndex?: number;
	frequencyType: Frequency.WEEKLY;
	weekDays: number;
}

interface DailyRecurringCreateBody {
	name: string;
	description?: string;
	displayIndex?: number;
	frequencyType: Frequency.DAILY;
}

interface OnceRecurringCreateBody {
	name: string;
	description?: string;
	displayIndex?: number;
	frequencyType: Frequency.ONCE;
}
