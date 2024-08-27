import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";

function encodeBase64(uuid: string) {
	// UUID를 Buffer로 변환한 후 Base64로 인코딩
	return Buffer.from(uuid).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const { token, groupId, groupName, groupImage } = await req.json();

		if (!token) {
			return NextResponse.json({ error: "Token is required", message: "토큰이 필요합니다." }, { status: 400 });
		}

		const uuid = crypto.randomUUID();
		const key = encodeBase64(uuid);

		// 초대 생성 및 저장
		await InviteModel.create({
			email: "",
			groupId,
			groupName,
			groupImage,
			token,
			key,
		});

		// 단축 링크 생성
		const shortURL = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/join-team?key=${key}`;

		return NextResponse.json({ shortURL }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: `Failed to create short URL \n${error}`, message: "단축 URL 생성에 실패했습니다." }, { status: 500 });
	}
}

export function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: {
			Allow: "POST, OPTIONS",
		},
	});
}
