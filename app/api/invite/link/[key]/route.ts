import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_api/_models/Invite.model";

export const runtime = "edge";

export async function GET(req: NextRequest) {
	await dbConnect();

	try {
		const { pathname } = req.nextUrl;
		const key = pathname.split("/").pop();

		if (!key) {
			return NextResponse.json({ error: "Key is required", message: "초대키가 필요합니다." }, { status: 400 });
		}

		// key를 사용하여 초대 정보 조회
		const invite = await InviteModel.findOne({ key }).lean().exec();

		if (!invite) {
			return NextResponse.json({ error: "Invalid Key", message: "유효하지 않은 초대입니다." }, { status: 404 });
		}

		// 초대 정보를 클라이언트에 반환
		return NextResponse.json(invite, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: `Failed to retrieve invite \n${error}`, message: "초대 조회에 실패했습니다." }, { status: 500 });
	}
}

export function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: {
			Allow: "GET, OPTIONS",
		},
	});
}
