/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

import InviteModel from "@/app/_utils/_models/Invite.model";
import Token from "@/app/_utils/Token";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_URL = process.env.NEXT_PUBLIC_REDIRECT_URL;

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

				impl.Authorization = `Bearer ${Token.ACCESS}`;
				// console.log(impl);

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
				const impl: BodyInit = payload instanceof FormData ? payload : JSON.stringify(payload);

				return impl;
			})(),
		];

		return new Promise<T>((resolve, reject) => {
			fetch(url, { method, headers, body, cache: "no-store" }).then(async (response) => {
				if (!response.ok) {
					if (response.status === 401 && retries <= 1 && Token.REFRESH) {
						const data = await API["{teamId}/auth/refresh-token"].POST({}, { refreshToken: Token.REFRESH });
						Token.ACCESS = data.accessToken;
						return resolve(await API.SEND(type, method, url, { payload, retries: retries + 1 }));
					}
					return reject(await response.json());
				}
				if (response.status === 204) {
					return resolve(null as T);
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

	// * [ User API ]

	/**
	 * 내 정보 확인, 수정, 삭제 API
	 */
	public static readonly ["{teamId}/user"] = new (class extends API {
		/**
		 * 내 정보 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 사용자 정보
		 */
		public override GET({ teamId = "6-5", ...query }: { teamId?: string }) {
			return API.GET<{
				id: number;
				nickname: string;
				createdAt: string;
				updatedAt: string;
				image: string;
				teamId: string;
				email: string;
				memberships: [
					{
						userId: number;
						groupId: number;
						userName: string;
						userEmail: string;
						userImage: string;
						role: Role;
						group: {
							id: number;
							name: string;
							image: string;
							createdAt: string;
							updatedAt: string;
							teamId: number;
						};
					},
				];
			}>(MIME.JSON, `${BASE_URL}/${teamId}/user`, query);
		}

		/**
		 * 내 정보 수정
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 수정할 사용자 정보
		 * @returns {Promise<Object>} - 응답 메시지
		 */
		public override PATCH({ teamId = "6-5", ...query }: { teamId?: string }, body: UpdateUserBody) {
			return API.PATCH<{ message: string }>(MIME.JSON, `${BASE_URL}/${teamId}/user`, query, body);
		}

		/**
		 * 내 정보 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ teamId = "6-5", ...query }: { teamId?: string }) {
			return API.DELETE<{}>(MIME.JSON, `${BASE_URL}/${teamId}/user`, query);
		}
	})();

	/**
	 * 내가 속한 그룹 확인 API
	 */
	public static readonly ["{teamId}/user/groups"] = new (class extends API {
		/**
		 * 내가 속한 그룹 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 그룹 정보
		 */
		public override GET({ teamId = "6-5", ...query }: { teamId?: string }) {
			return API.GET<
				{
					updatedAt: string;
					createdAt: string;
					image: string;
					name: string;
					teamId: string;
					id: number;
				}[]
			>(MIME.JSON, `${BASE_URL}/${teamId}/user/groups`, query);
		}
	})();

	/**
	 * 내 투두 히스토리 확인 API
	 */
	public static readonly ["{teamId}/user/history"] = new (class extends API {
		/**
		 * 내 투두 히스토리 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 투두 히스토리
		 */
		public override GET({ teamId = "6-5", ...query }: { teamId?: string }) {
			return API.GET<{
				tasksDone: {
					deletedAt: string;
					userId: number;
					recurringId: number;
					frequency: Frequency;
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

	/**
	 * 비밀번호 찾기 이메일 전송 API
	 */
	public static readonly ["{teamId}/user/send-reset-password-email"] = new (class extends API {
		/**
		 * 비밀번호 찾기 이메일 전송
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 이메일 전송 요청 정보
		 * @returns {Promise<Object>} - 응답 메시지
		 */
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: SendResetPasswordEmailRequest) {
			return API.POST<{ message: string }>(MIME.JSON, `${BASE_URL}/${teamId}/user/send-reset-password-email`, query, body);
		}
	})();

	/**
	 * 이메일 인증 후 비밀번호 재설정 API
	 */
	public static readonly ["{teamId}/user/reset-password"] = new (class extends API {
		/**
		 * 이메일 인증 후 비밀번호 재설정
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 비밀번호 재설정 요청 정보
		 * @returns {Promise<Object>} - 응답 메시지
		 */
		public override PATCH({ teamId = "6-5", ...query }: { teamId?: string }, body: ResetPasswordBody) {
			return API.PATCH<{ message: string }>(MIME.JSON, `${BASE_URL}/${teamId}/user/reset-password`, query, body);
		}
	})();

	/**
	 * 로그인 상태에서 비밀번호 변경 API
	 */
	public static readonly ["{teamId}/user/password"] = new (class extends API {
		/**
		 * 로그인 상태에서 비밀번호 변경
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 비밀번호 변경 요청 정보
		 * @returns {Promise<Object>} - 응답 메시지
		 */
		public override PATCH({ teamId = "6-5", ...query }: { teamId?: string }, body: UpdatePasswordBody) {
			return API.PATCH<{ message: string }>(MIME.JSON, `${BASE_URL}/${teamId}/user/password`, query, body);
		}
	})();

	// * [ Task List API ]

	/**
	 * Task 목록을 확인, 수정, 삭제 API
	 */
	public static readonly ["{teamId}/groups/{groupId}/task-lists/{id}"] = new (class extends API {
		/**
		 * Task 목록 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - Task 목록 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - Task 목록 정보
		 */
		public override GET({ teamId = "6-5", id, ...query }: { teamId?: string; id: number; date?: string }) {
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

		/**
		 * Task 목록 수정
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {number} id - Task 목록 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 수정할 Task 목록 정보
		 * @returns {Promise<Object>} - Task 목록 정보
		 */
		public override PATCH({ teamId = "6-5", groupId, id, ...query }: { teamId?: string; groupId: number; id: number }, body: { name: string }) {
			return API.PATCH<{
				groupId: number;
				displayIndex: number;
				updatedAt: string;
				createdAt: string;
				name: string;
				id: number;
			}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${id}`, query, body);
		}

		/**
		 * Task 목록 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - Task 목록 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ teamId = "6-5", id, ...query }: { teamId?: string; id: number }) {
			return API.DELETE<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/{groupsId}/task-lists/${id}`, query);
		}
	})();

	/**
	 * Task 목록을 추가 API
	 */
	public static readonly ["{teamId}/groups/{groupId}/task-lists"] = new (class extends API {
		/**
		 * Task 목록 추가
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 Task 목록 정보
		 * @returns {Promise<Object>} - Task 목록 정보
		 */
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

	/**
	 * Task 목록의 순서를 변경하는 API (Drag & Drop)
	 */
	public static readonly ["{teamId}/groups/{groupId}/task-lists/{id}/order"] = new (class extends API {
		/**
		 * Task 목록의 순서 변경
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {number} id - Task 목록 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 순서 변경 정보
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override PATCH({ teamId = "6-5", groupId, id, ...query }: { teamId?: string; groupId: number; id: number }, body: { displayIndex: string }) {
			return API.PATCH<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${id}/order`, query, body);
		}
	})();

	// * [ Task API ]

	/**
	 * Task 추가 및 Task 목록에 속한 Task들 확인 API
	 */
	public static readonly ["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks"] = new (class extends API {
		/**
		 * Task 추가
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {number} taskListId - Task 목록 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 Task 정보
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override PATCH(
			{ teamId = "6-5", groupId, taskListId, ...query }: { teamId?: string; groupId: number; taskListId: number },
			body: RecurringCreateBody,
		) {
			return API.POST<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${taskListId}/tasks`, query, body);
		}

		/**
		 * Task 목록에 속한 Task들을 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {number} taskListId - Task 목록 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - Task 목록
		 */
		public override GET({ teamId = "6-5", groupId, taskListId, ...query }: { teamId?: string; groupId: number; taskListId: number; date: string }) {
			return API.GET<Task[]>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${taskListId}/tasks`, query);
		}
	})();

	/**
	 * Task 상세 정보 확인, 수정, 삭제 API
	 */
	public static readonly ["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}"] = new (class extends API {
		/**
		 * Task 상세 정보 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {number} taskListId - Task 목록 ID
		 * @param {number} taskId - Task ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - Task 상세 정보
		 */
		public override GET({ teamId = "6-5", taskId, ...query }: { teamId?: string; taskId: number }) {
			return API.GET<Todo>(MIME.JSON, `${BASE_URL}/${teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/${taskId}`, query);
		}

		/**
		 * Task 수정
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {number} taskListId - Task 목록 ID
		 * @param {number} taskId - Task ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 수정할 Task 정보
		 * @returns {Promise<Object>} - Task 기본 정보
		 */
		public override PATCH(
			{ teamId = "6-5", groupId, taskListId, taskId, ...query }: { teamId?: string; groupId?: number; taskListId?: number; taskId: number },
			body: { name?: string; description?: string; done?: boolean },
		) {
			return API.PATCH<TodoBase>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`, query, body);
		}

		/**
		 * Task 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {number} taskListId - Task 목록 ID
		 * @param {number} taskId - Task ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ teamId = "6-5", taskId, ...query }: { teamId?: string; taskId: number }) {
			return API.DELETE<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/${taskId}`, query);
		}
	})();

	/**
	 * 반복 할 일 삭제 API (task 객체의 recurringId 필드, 반복설정으로 생성된 할일이 아닌, 반복설정 자체를 삭제)
	 */
	public static readonly ["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{taskId}/recurring/{recurringId}"] = new (class extends API {
		/**
		 * 반복 할 일 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {number} taskListId - Task 목록 ID
		 * @param {number} taskId - Task ID
		 * @param {number} recurringId - 반복 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({
			teamId = "6-5",
			groupId,
			taskListId,
			taskId,
			recurringId,
			...query
		}: {
			teamId?: string;
			groupId?: number;
			taskListId?: number;
			taskId: number;
			recurringId: number;
		}) {
			return API.DELETE<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}/recurring/${recurringId}`, query);
		}
	})();

	/**
	 * Todo 순서 변경 API (Drag & Drop)
	 */
	public static readonly ["{teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/{id}/order"] = new (class extends API {
		/**
		 * Task order 변경
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 Task 정보
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override PATCH({ teamId = "6-5", id, ...query }: { teamId?: string; id: number }, body: { displayIndex: number }) {
			return API.PATCH<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/{groupId}/task-lists/{taskListId}/tasks/${id}/order`, query, body);
		}
	})();
	// * [ Recurring API ]

	/**
	 * 반복 설정 추가 API
	 */
	public static readonly ["{teamId}/groups/{groupId}/task-lists/{taskListId}/recurring"] = new (class extends API {
		/**
		 * 반복 설정 추가
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} groupId - 그룹 ID
		 * @param {number} taskListId - Task 목록 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 반복 설정 정보
		 * @returns {Promise<Object>} - 반복 설정 정보
		 */
		public override POST(
			{ teamId = "6-5", groupId, taskListId, ...query }: { teamId?: string; groupId: number; taskListId: number },
			body: RecurringCreateBody,
		) {
			return API.POST<Recurring>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${groupId}/task-lists/${taskListId}/recurring`, query, body);
		}
	})();

	// * [ Oauth API ]

	/**
	 * 간편 로그인 App 등록/수정 API
	 */
	public static readonly ["{teamId}/oauthApps"] = new (class extends API {
		/**
		 * 간편 로그인 App 등록/수정
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 등록/수정할 App 정보
		 * @returns {Promise<Object>} - App 정보
		 */
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: { appKey: string; provider: "KAKAO" | "GOOGLE" }) {
			return API.POST<{ updatedAt: string; createdAt: string; image?: string; name: string; teamId: string; id: number }>(
				MIME.JSON,
				`${BASE_URL}/${teamId}/oauthApps`,
				query,
				body,
			);
		}
	})();

	// * [ Image API ]

	/**
	 * 이미지 업로드 API (이미지 파일, 최대 용량 10MB)
	 */
	public static readonly ["{teamId}/images/upload"] = new (class extends API {
		/**
		 * 이미지 업로드
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {File} body - 업로드할 이미지 파일
		 * @returns {Promise<Object>} - 업로드된 이미지 URL
		 */
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: File) {
			const data = new FormData();

			data.append("image", body);

			return API.POST<{ url: string }>(MIME.FORM_DATA, `${BASE_URL}/${teamId}/images/upload`, query, data);
		}
	})();

	// * [ Group API ]

	/**
	 * 그룹 정보 확인, 수정, 삭제 API
	 */
	public static readonly ["{teamId}/groups/{id}"] = new (class extends API {
		/**
		 * 그룹 정보 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - 그룹 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 그룹 정보
		 */
		public override GET({ teamId = "6-5", id, ...query }: { teamId?: string; id: number }) {
			return API.GET<Team>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${id}`, query);
		}

		/**
		 * 그룹 정보 수정
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - 그룹 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 수정할 그룹 정보
		 * @returns {Promise<Object>} - 그룹 정보
		 */
		public override PATCH({ teamId = "6-5", id, ...query }: { teamId?: string; id: number }, body: { image?: string; name: string }) {
			return API.PATCH<{ updatedAt: string; createdAt: string; image?: string; name: string; teamId: string; id: number }>(
				MIME.JSON,
				`${BASE_URL}/${teamId}/groups/${id}`,
				query,
				body,
			);
		}

		/**
		 * 그룹 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - 그룹 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ teamId = "6-5", id, ...query }: { teamId?: string; id: number }) {
			return API.DELETE<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${id}`, query);
		}
	})();

	/**
	 * 그룹 생성 API
	 */
	public static readonly ["{teamId}/groups"] = new (class extends API {
		/**
		 * 그룹 생성
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 생성할 그룹 정보
		 * @returns {Promise<Object>} - 그룹 정보
		 */
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: { image?: string; name: string }) {
			return API.POST<{ updatedAt: string; createdAt: string; image?: string; name: string; id: number }>(
				MIME.JSON,
				`${BASE_URL}/${teamId}/groups`,
				query,
				body,
			);
		}
	})();

	/**
	 * 그룹의 멤버 확인, 삭제 API
	 */
	public static readonly ["{teamId}/groups/{id}/member/{memberUserId}"] = new (class extends API {
		/**
		 * 그룹 멤버 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - 그룹 ID
		 * @param {number} memberUserId - 멤버 사용자 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 멤버 정보
		 */
		public override GET({ teamId = "6-5", id, memberUserId, ...query }: { teamId?: string; id: number; memberUserId: number }) {
			return API.GET<Member>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${id}/member/${memberUserId}`, query);
		}

		/**
		 * 그룹 멤버 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - 그룹 ID
		 * @param {number} memberUserId - 멤버 사용자 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ teamId = "6-5", id, memberUserId, ...query }: { teamId?: string; id: number; memberUserId: number }) {
			return API.DELETE<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${id}/member/${memberUserId}`, query);
		}
	})();

	/**
	 * 그룹 초대 링크용 토큰 생성 API
	 */
	public static readonly ["{teamId}/groups/{id}/invitation"] = new (class extends API {
		/**
		 * 그룹 초대 링크용 토큰 생성
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - 그룹 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<string>} - 초대 토큰
		 */
		public override GET({ teamId = "6-5", id, ...query }: { teamId?: string; id: number }) {
			return API.GET<string>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${id}/invitation`, query);
		}
	})();

	/**
	 * 그룹 초대 수락 API
	 */
	public static readonly ["{teamId}/groups/accept-invitation"] = new (class extends API {
		/**
		 * 그룹 초대 수락
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 초대 수락 정보
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: { userEmail: string; token: string }) {
			return API.POST<{ groupId: number }>(MIME.JSON, `${BASE_URL}/${teamId}/groups/accept-invitation`, query, body);
		}
	})();

	/**
	 * 그룹 초대 없이 유저 추가 API
	 */
	public static readonly ["{teamId}/groups/{id}/member"] = new (class extends API {
		/**
		 * 그룹 초대 없이 유저 추가
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - 그룹 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 유저 정보
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override POST({ teamId = "6-5", id, ...query }: { teamId?: string; id: number }, body: { userEmail: string }) {
			return API.POST<{}>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${id}/member`, query, body);
		}
	})();

	/**
	 * 특정 일자, 특정 할일 리스트의 할일 리스트 확인 API
	 */
	public static readonly ["{teamId}/groups/{id}/tasks"] = new (class extends API {
		/**
		 * 특정 일자, 특정 할일 리스트의 할일 리스트 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} id - 그룹 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 할일 리스트
		 */
		public override GET({ teamId = "6-5", id, ...query }: { teamId?: string; id: number }) {
			return API.GET<Task[]>(MIME.JSON, `${BASE_URL}/${teamId}/groups/${id}/tasks`, query);
		}
	})();

	// * [ Comment API ]

	/**
	 * 댓글 확인, 추가 API
	 */
	public static readonly ["{teamId}/tasks/{taskId}/comments"] = new (class extends API {
		/**
		 * 댓글 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} taskId - 할일 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 댓글 리스트
		 */
		public override GET({ teamId = "6-5", taskId, ...query }: { teamId?: string; taskId: number }) {
			return API.GET<Comment[]>(MIME.JSON, `${BASE_URL}/${teamId}/tasks/${taskId}/comments`, query);
		}

		/**
		 * 댓글 추가
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} taskId - 할일 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 댓글 내용
		 * @returns {Promise<Object>} - 추가된 댓글
		 */
		public override POST({ teamId = "6-5", taskId, ...query }: { teamId?: string; taskId: number }, body: { content: string }) {
			return API.POST<Comment>(MIME.JSON, `${BASE_URL}/${teamId}/tasks/${taskId}/comments`, query, body);
		}
	})();

	/**
	 * 댓글 수정, 삭제 API
	 */
	public static readonly ["{teamId}/tasks/{taskId}/comments/{commentId}"] = new (class extends API {
		/**
		 * 댓글 수정
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} taskId - 할일 ID
		 * @param {number} commentId - 댓글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 수정할 댓글 내용
		 * @returns {Promise<Object>} - 수정된 댓글
		 */
		public override PATCH({ teamId = "6-5", commentId, ...query }: { teamId?: string; commentId: number }, body: { content: string }) {
			return API.PATCH<{}>(MIME.JSON, `${BASE_URL}/${teamId}/tasks/{taskId}/comments/${commentId}`, query, body);
		}

		/**
		 * 댓글 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} commentId - 댓글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ teamId = "6-5", commentId, ...query }: { teamId?: string; commentId: number }) {
			return API.DELETE<{}>(MIME.JSON, `${BASE_URL}/${teamId}/tasks/{taskId}/comments/${commentId}`, query);
		}
	})();

	// * [ Auth API ]

	/**
	 * 회원가입 API
	 */
	public static readonly ["{teamId}/auth/signUp"] = new (class extends API {
		/**
		 * 회원가입
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 회원가입 정보
		 * @returns {Promise<Object>} - 인증 정보
		 */
		public override POST(
			{ teamId = "6-5", ...query }: { teamId?: string },
			body: { email: string; nickname: string; password: string; passwordConfirmation: string },
		) {
			return API.POST<Auth>(MIME.JSON, `${BASE_URL}/${teamId}/auth/signUp`, query, body);
		}
	})();

	/**
	 * 로그인 API
	 */
	public static readonly ["{teamId}/auth/signIn"] = new (class extends API {
		/**
		 * 로그인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 로그인 정보
		 * @returns {Promise<Object>} - 인증 정보
		 */
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: { email: string; password: string }) {
			return API.POST<Auth>(MIME.JSON, `${BASE_URL}/${teamId}/auth/signIn`, query, body);
		}
	})();

	/**
	 * 액세스 토큰 재발급 API
	 */
	public static readonly ["{teamId}/auth/refresh-token"] = new (class extends API {
		/**
		 * 액세스 토큰 재발급
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 토큰 정보
		 * @returns {Promise<Object>} - 액세스 토큰
		 */
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: { refreshToken: string }) {
			return API.POST<{ accessToken: string }>(MIME.JSON, `${BASE_URL}/${teamId}/auth/refresh-token`, query, body);
		}
	})();

	/**
	 * 간편 로그인 API
	 */
	public static readonly ["{teamId}/auth/signIn/{provider}"] = new (class extends API {
		/**
		 * 간편 로그인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {string} provider - 로그인 제공자
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 간편 로그인 정보
		 * @returns {Promise<Object>} - 인증 정보
		 */
		public override POST(
			{ teamId = "6-5", provider, ...query }: { teamId?: string; provider: "KAKAO" | "GOOGLE" },
			body: { state?: string; redirectUri: string; token: string },
		) {
			return API.POST<Auth>(MIME.JSON, `${BASE_URL}/${teamId}/auth/signIn/${provider}`, query, body);
		}
	})();

	// * [ Article Comment ]

	/**
	 * 게시글 댓글 확인, 추가 API
	 */
	public static readonly ["{teamId}/articles/{articleId}/comments"] = new (class extends API {
		/**
		 * 게시글 댓글 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} articleId - 게시글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 댓글 리스트
		 */
		public override GET({ teamId = "6-5", articleId, ...query }: { teamId?: string; articleId: number }) {
			return API.GET<CursorBasedPaginationResponse<Comment>>(MIME.JSON, `${BASE_URL}/${teamId}/articles/${articleId}/comments`, query);
		}

		/**
		 * 게시글 댓글 추가
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} articleId - 게시글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 댓글 내용
		 * @returns {Promise<Object>} - 추가된 댓글
		 */
		public override POST({ teamId = "6-5", articleId, ...query }: { teamId?: string; articleId: number }, body: { content: string }) {
			return API.POST<ArticleListItem>(MIME.JSON, `${BASE_URL}/${teamId}/articles/${articleId}/comments`, query, body);
		}
	})();

	/**
	 * 게시글 댓글 수정, 삭제 API
	 */
	public static readonly ["{teamId}/comments/{commentId}"] = new (class extends API {
		/**
		 * 게시글 댓글 수정
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} commentId - 댓글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 수정할 댓글 내용
		 * @returns {Promise<Object>} - 수정된 댓글
		 */
		public override PATCH({ teamId = "6-5", commentId, ...query }: { teamId?: string; commentId: number }, body: { content: string }) {
			return API.PATCH<ArticleListItem>(MIME.JSON, `${BASE_URL}/${teamId}/comments/${commentId}`, query, body);
		}

		/**
		 * 게시글 댓글 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} commentId - 댓글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ teamId = "6-5", commentId, ...query }: { teamId?: string; commentId: number }) {
			return API.DELETE<{ id?: number; message?: string }>(MIME.JSON, `${BASE_URL}/${teamId}/comments/${commentId}`, query);
		}
	})();

	// * [ Article API ]

	/**
	 * 게시글 생성, 목록 확인
	 */
	public static readonly ["{teamId}/articles"] = new (class extends API {
		/**
		 * 게시글 생성
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 생성할 게시글 내용
		 * @returns {Promise<Object>} - 생성된 게시글
		 */
		public override POST({ teamId = "6-5", ...query }: { teamId?: string }, body: { image?: string; content: string; title: string }) {
			return API.POST<Article>(MIME.JSON, `${BASE_URL}/${teamId}/articles`, query, body);
		}

		/**
		 * 게시글 목록 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 게시글 리스트
		 */
		public override GET({ teamId = "6-5", ...query }: { teamId?: string; orderBy?: "like" | "recent"; pageSize?: number; keyword?: string; page?: number }) {
			return API.GET<OffsetBasedPaginationResponse<Article>>(MIME.JSON, `${BASE_URL}/${teamId}/articles`, query);
		}
	})();

	/**
	 * 게시글 상세 정보 확인, 수정, 삭제 API
	 */
	public static readonly ["{teamId}/articles/{articleId}"] = new (class extends API {
		/**
		 * 게시글 상세 정보 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} articleId - 게시글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 게시글 정보
		 */
		public override GET({ teamId = "6-5", articleId, ...query }: { teamId?: string; articleId: number }) {
			return API.GET<Article>(MIME.JSON, `${BASE_URL}/${teamId}/articles/${articleId}`, query);
		}

		/**
		 * 게시글 수정
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} articleId - 게시글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 수정할 게시글 내용
		 * @returns {Promise<Object>} - 게시글 정보
		 */
		public override PATCH(
			{ teamId = "6-5", articleId, ...query }: { teamId?: string; articleId: number },
			body: { image?: string; content: string; title: string },
		) {
			return API.PATCH<Article>(MIME.JSON, `${BASE_URL}/${teamId}/articles/${articleId}`, query, body);
		}

		/**
		 * 게시글 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} articleId - 게시글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ teamId = "6-5", articleId, ...query }: { teamId?: string; articleId: number }) {
			return API.DELETE<{ message?: string }>(MIME.JSON, `${BASE_URL}/${teamId}/articles/${articleId}`, query);
		}
	})();

	/**
	 * 게시글 좋아요 API
	 */
	public static readonly ["{teamId}/articles/{articleId}/like"] = new (class extends API {
		/**
		 * 게시글 좋아요 추가
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} articleId - 게시글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 게시글 정보
		 */
		public override POST({ teamId = "6-5", articleId, ...query }: { teamId?: string; articleId: number }) {
			return API.POST<Article>(MIME.JSON, `${BASE_URL}/${teamId}/articles/${articleId}/like`, query, {});
		}

		/**
		 * 게시글 좋아요 삭제
		 * @param {Object} param - 파라미터 객체
		 * @param {string} [param.teamId="6-5"] - 팀 ID
		 * @param {number} articleId - 게시글 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 게시글 정보
		 */
		public override DELETE({ teamId = "6-5", articleId, ...query }: { teamId?: string; articleId: number }) {
			return API.DELETE<Article>(MIME.JSON, `${BASE_URL}/${teamId}/articles/${articleId}/like`, query);
		}
	})();

	// * [ Custom API ]

	/**
	 * 몽고 DB 유저 정보 확인 API
	 */
	public static readonly ["api/users"] = new (class extends API {
		/**
		 * 몽고 DB 유저 정보 확인
		 * @param {Object} param - 파라미터 객체
		 * @param {number} id - 유저 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 유저 정보
		 */
		public override GET({ ...query }) {
			return API.GET<{ id: number; email: string; groups: { groupId: number }[]; invite: InviteType[] }>(MIME.JSON, `${SITE_URL}/api/users`, query);
		}

		/**
		 * 몽고 DB 유저 정보 추가
		 * @param {Object}
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 유저 정보
		 * @returns {Promise<Object>} - 추가된 유저 정보
		 */
		public override POST({ ...query }, body: { id: number; email: string }) {
			return API.POST<{ id: number; email: string; groups: { groupId: number }[]; invite: InviteType[] }>(MIME.JSON, `${SITE_URL}/api/users`, query, body);
		}
	})();

	/**
	 * 몽고 DB 유저 정보 수정, 삭제 API
	 */
	public static readonly ["api/users/{id}"] = new (class extends API {
		/**
		 * 몽고 DB 유저 정보 수정
		 * @param {Object}
		 * @param {number} id - 유저 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 수정할 유저 정보
		 * @returns {Promise<Object>} - 수정된 유저 정보
		 */
		public override PATCH({ id, ...query }: { id: number }, body: { groupId: number }) {
			return API.PATCH<{ id: number; email: string; groups: { groupId: number }[]; invite: InviteType[] }>(
				MIME.JSON,
				`${SITE_URL}/api/users/${id}`,
				query,
				body,
			);
		}

		/**
		 * 몽고 DB 유저 정보 삭제
		 * @param {Object}
		 * @param {number} id - 유저 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ id, ...query }: { id: number }) {
			return API.DELETE<{}>(MIME.JSON, `${SITE_URL}/api/users/${id}`, query);
		}
	})();

	/**
	 * 몽고 DB 유저 그룹 정보 삭제 API
	 */
	public static readonly ["api/users/{id}/groupId/{groupId}"] = new (class extends API {
		/**
		 * 몽고 DB 유저 그룹 정보 삭제
		 * @param {Object}
		 * @param {number} id - 유저 ID
		 * @param {number} groupId - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ id, groupId, ...query }: { id: number; groupId: number }) {
			return API.DELETE<{}>(MIME.JSON, `${SITE_URL}/api/users/${id}/groupId/${groupId}`, query);
		}
	})();

	/**
	 * 몽고 DB 초대 API
	 */
	public static readonly ["api/invite"] = new (class extends API {
		/**
		 * 몽고 DB 초대 정보 추가
		 * @param {Object}
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 초대 정보
		 * @returns {Promise<Object>} - 추가된 초대 정보
		 */
		public override POST({ ...query }, body: { email: string; groupId: number; groupName: string; groupImage?: string; token: string }) {
			return API.POST<InstanceType<typeof InviteModel>>(MIME.JSON, `${SITE_URL}/api/invite`, query, body);
		}
	})();

	/**
	 * 몽고 DB 초대 정보
	 */
	public static readonly ["api/invite/{id}"] = new (class extends API {
		/**
		 * 몽고 DB 초대 정보 확인
		 * @param {Object}
		 * @param {number} id - 유저 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 초대 정보
		 */
		public override GET({ id, ...query }: { id: number }) {
			return API.GET<InstanceType<typeof InviteModel>[]>(MIME.JSON, `${SITE_URL}/api/invite/${id}`, query);
		}
	})();

	/**
	 * 몽고 DB 초대 정보 삭제 API
	 */
	public static readonly ["api/invite/{id}/groupId/{groupId}"] = new (class extends API {
		/**
		 * 몽고 DB 초대 정보 삭제
		 * @param {Object}
		 * @param {number} id - 유저 ID
		 * @param {number} groupId - 팀 ID
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 응답 객체
		 */
		public override DELETE({ id, groupId, ...query }: { id: number; groupId: number }) {
			return API.DELETE<{}>(MIME.JSON, `${SITE_URL}/api/invite/${id}/groupId/${groupId}`, query);
		}
	})();

	/**
	 * 몽고 DB 초대 링크 생성 API
	 */
	public static readonly ["api/invite/link"] = new (class extends API {
		/**
		 * 몽고 DB 초대 링크 생성
		 * @param {Object}
		 * @param {Object} query - 쿼리 파라미터
		 * @param {Object} body - 추가할 초대 정보
		 * @returns {Promise<Object>} - 초대 정보
		 */
		public override POST({ ...query }, body: { groupId: number; groupName: string; groupImage?: string; token: string }) {
			return API.POST<{ shortURL: string }>(MIME.JSON, `${SITE_URL}/api/invite/link`, query, body);
		}
	})();

	/**
	 * 몽고 DB 초대 링크 정보 확인 API
	 */
	public static readonly ["api/invite/link/{key}"] = new (class extends API {
		/**
		 * 몽고 DB 초대 링크 정보 확인
		 * @param {Object}
		 * @param {string} key - 초대 링크 키
		 * @param {Object} query - 쿼리 파라미터
		 * @returns {Promise<Object>} - 초대 정보
		 */
		public override GET({ key, ...query }: { key: string }) {
			return API.GET<InstanceType<typeof InviteModel>>(MIME.JSON, `${SITE_URL}/api/invite/link/${key}`, query);
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
	nickname?: string;
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
	displayIndex: number;
	commentCount: number;
	deletedAt: string;
	recurringId: number;
	frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
	userId: number;
	updateAt: string;
	doneAt: string;
	date: string;
	description: string;
	name: string;
	id: number;
}

interface RecurringCreateBody {
	name: string;
	description?: string;
	startDate: string;
	displayIndex?: number;
	frequencyType: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
	monthDay?: number;
	weekDays?: number[];
}

interface Comment {
	id: number;
	content: string;
	createdAt: string;
	updatedAt: string;
	taskId: number;
	userId: number;
	user?: User;
	writer?: ArticleWriter;
}

interface Recurring {
	writerId: number;
	groupId: number;
	taskListId: number;
	monthDay?: number;
	weekDays?: number[];
	frequencyType: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
	startDate?: string;
	updatedAt: string;
	createdAt: string;
	description: string;
	name: string;
	id: number;
	displayIndex?: number;
	doneBy?: User;
}

interface Auth {
	accessToken: string;
	refreshToken: string;
	user: User;
}

interface User {
	image?: string | null;
	nickname: string;
	id: number;
	teamId?: string;
	updatedAt?: string;
	createdAt?: string;
	encryptedPassword?: string;
	email?: string;
}
interface Todo extends TodoBase {
	doneBy: { id: number; nickname: string; image?: string };
	writer: { id: number; nickname: string; image?: string };
	recurring: Recurring;
}
interface TodoBase {
	deletedAt: string;
	userId: number;
	recurringId: number;
	frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
	date: string;
	doneAt: string;
	description: string;
	name: string;
	updatedAt: string;
	id: number;
	writerId: number | null;
	displayIndex: number;
	commentCount: number;
}

interface Member {
	role: string;
	userImage?: string;
	userEmail: string;
	userName: string;
	groupId: number;
	userId: number;
}

interface TaskList {
	groupId: number;
	displayIndex: number;
	updatedAt: string;
	createdAt: string;
	name: string;
	id: number;
	tasks: Task[];
}

interface Team {
	updatedAt: string;
	createdAt: string;
	image?: string;
	name: string;
	teamId: string;
	id: number;
	members: Member[];
	taskLists: TaskList[];
}

interface ArticleWriter {
	image?: string;
	nickname: string;
	id: number;
}

interface ArticleListItem {
	writer: ArticleWriter;
	updatedAt: string;
	createdAt: string;
	content: string;
	id: number;
}

interface Article {
	updatedAt: string;
	createdAt: string;
	likeCount: number;
	writer: ArticleWriter;
	image?: string;
	title: string;
	id: number;
	commentCount?: number;
	isLiked?: boolean;
	content?: string;
}

interface OffsetBasedPaginationResponse<T> {
	list: T[];
	totalCount: number;
}

interface CursorBasedPaginationResponse<T> {
	list: T[];
	nextCursor?: number;
}

type InviteType = InstanceType<typeof InviteModel>;
