import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/_utils/_models/Users.model";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";

export async function GET(req: NextRequest) {
	await dbConnect();

	const url = req.nextUrl;
	const id = url.pathname.split("/").pop();

	try {
		const user = await UserModel.findOne({ id });

		if (!user) {
			return NextResponse.json({ error: "User not found", message: "유저를 찾을 수 없습니다." }, { status: 404 });
		}

		const invite = await InviteModel.find({ email: user.email });

		if (!invite) {
			return NextResponse.json({ error: "Invite not found", message: "초대장을 찾을 수 없습니다." }, { status: 404 });
		}

		return NextResponse.json(invite, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Server Error", message: "서버 에러" }, { status: 500 });
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