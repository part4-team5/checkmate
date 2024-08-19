import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
	// 요청된 경로
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get("accessToken");

	// 로그인이 되어있는 상태에서 로그인 페이지나 회원가입 페이지로 이동하려고 할 때
	if (accessToken && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// 로그인되지 않은 상태에서 특정 경로로 이동하려고 할 때
	if (!accessToken) {
		// /[id] 형식의 경로로 이동하려고 할 때
		if (pathname.startsWith("/") && pathname.match(/^\/\d+$/)) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// * (team)
		// /get-started, /create - team, /join-team 경로로 이동하려고 할 때
		if (pathname.startsWith("/get-started") || pathname.startsWith("/create-team") || pathname.startsWith("/join-team")) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// * (user)
		// /my-page, /my-history 경로로 이동하려고 할 때
		if (pathname.startsWith("/my-page") || pathname.startsWith("/my-history")) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		//* (board)
		// /create-post 경로로 이동하려고 할 때
		if (pathname.startsWith("/create-post")) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	return NextResponse.next();
};

export const config = {
	// 다음과 같은 경로를 제외하고 모든 경로에 미들웨어를 적용합니다.
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)"],
};
