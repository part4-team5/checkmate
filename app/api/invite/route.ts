import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";
import UserModel from "@/app/_utils/_models/Users.model";

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const body = await req.json();

		// 유저를 이메일로 찾기
		const user = await UserModel.findOne({ email: body.email });
		if (!user) {
			return NextResponse.json({ error: "User Not Found", message: "유저를 찾을 수 없습니다." }, { status: 404 });
		}

		// 이미 해당 그룹에 대한 초대장이 있는지 확인
		const existingInvite = await InviteModel.findOne({ email: body.email, groupId: body.groupId });
		if (existingInvite) {
			return NextResponse.json({ error: "Invite Already Exists", message: "이미 초대장이 존재합니다." }, { status: 400 });
		}

		// 초대장 생성
		const invite = await InviteModel.create(body);

		// 유저의 invite 배열에 새로 생성된 초대장 ID 추가
		// eslint-disable-next-line no-underscore-dangle
		await UserModel.findByIdAndUpdate(user._id, { $push: { invite: invite._id } });

		return NextResponse.json(invite, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error, message: "초대에 실패했습니다." }, { status: 500 });
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
