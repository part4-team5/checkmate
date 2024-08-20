import API from "@/app/_api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 로그인 상태일 때 리디렉션 맵
const authMap = new Map<RegExp, string>([[/^\/(login|signup)/, "/"]]);

// 비로그인 상태일 때 리디렉션 맵
const guestMap = new Map<RegExp, string>([
	[/^\/\d+$/, "/login"], // /[id] 형식의 경로
	[/^\/\d+\/todo$/, "/login"], // /[id]/todo 형식의 경로
	[/^\/(get-started|create-team|join-team)/, "/login"], // team 관련 경로
	[/^\/(my-page|my-history)/, "/login"], // user 관련 경로
	[/^\/create-post/, "/login"], // board 관련 경로
]);

export const middleware = async (request: NextRequest) => {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get("accessToken");
	const map = accessToken ? authMap : guestMap;

	// /[id] 경로에 대한 처리
	if ((/^\/\d+$/.test(pathname) || /^\/\d+\/todo$/.test(pathname)) && accessToken) {
		try {
			const user = await API["{teamId}/user"].GET({});

			// URL에서 [id] 추출
			const pathMatch = pathname.match(/^\/(\d+)/);
			const pathId = pathMatch ? pathMatch[1] : null;

			// memberships에 pathId에 해당하는 groupId가 있는지 확인
			const hasAccess = user.memberships.some((membership) => membership.groupId === Number(pathId));

			if (!hasAccess) {
				// [id]가 groupId와 일치하지 않으면 "/"로 리다이렉트
				return NextResponse.redirect(new URL("/", request.url));
			}
		} catch (error) {
			console.error("API 요청 실패:", error);
		}
	}

	for (const [regex, redirectUrl] of map.entries()) {
		if (regex.test(pathname)) {
			return NextResponse.redirect(new URL(redirectUrl, request.url));
		}
	}

	return NextResponse.next();
};

export const config = {
	// 다음과 같은 경로를 제외하고 모든 경로에 미들웨어를 적용합니다.
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)"],
};
