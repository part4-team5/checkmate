import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";
import UserModel from "@/app/_utils/_models/Users.model";

export async function DELETE(req: NextRequest) {
	await dbConnect();

	const { pathname } = req.nextUrl;
	const parts = pathname.split("/");

	const id = parts[parts.indexOf("invite") + 1]; // 경로에서 [id] 추출
	const groupId = parts[parts.indexOf("groupId") + 1]; // 경로에서 [groupId] 추출

	if (!id) {
		return NextResponse.json({ error: "User ID", message: "올바르지 않은 ID입니다." }, { status: 400 });
	}

	try {
		const user = await UserModel.findOne({ id }).lean().exec();

		if (!user) {
			return NextResponse.json({ error: "User not found", message: "유저를 찾을 수 없습니다." }, { status: 404 });
		}

		const invite = await InviteModel.findOneAndDelete({ email: user.email, groupId }).lean().exec();

		if (!invite) {
			return NextResponse.json({ error: "Invite not found", message: "초대를 찾을 수 없습니다." }, { status: 404 });
		}

		return NextResponse.json({ invite, message: "성공적으로 초대를 삭제했습니다." }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: "초대 삭제에 실패했습니다." }, { status: 500 });
	}
}

export function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: {
			Allow: "DELETE, OPTIONS",
		},
	});
}
