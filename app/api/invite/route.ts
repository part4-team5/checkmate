import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";
import UserModel from "@/app/_utils/_models/Users.model";

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const body = await req.json();
		const { email, groupId } = body;

		// 이메일로 유저 찾기
		const user = await UserModel.aggregate([
			{ $match: { email } },
			{
				$lookup: {
					from: "groups",
					localField: "groups",
					foreignField: "_id",
					as: "groups",
				},
			},
			{
				$lookup: {
					from: "invites",
					localField: "invite",
					foreignField: "_id",
					as: "invite",
				},
			},
		]).then((result) => result[0]); // aggregate 결과는 배열이므로 첫 번째 요소만 사용
		if (!user) {
			return NextResponse.json({ error: "User Not Found", message: "유저를 찾을 수 없습니다." }, { status: 404 });
		}

		// 유저가 이미 해당 그룹의 멤버인지 확인
		const isMember = user.groups.some((group: { groupId: number }) => group.groupId === groupId);
		if (isMember) {
			return NextResponse.json({ error: "Already Member", message: "이미 해당 그룹에 속해있습니다." }, { status: 400 });
		}

		// 해당 그룹에 대한 초대장이 이미 존재하는지 확인
		const existingInvite = await InviteModel.exists({ email, groupId });
		if (existingInvite) {
			return NextResponse.json({ error: "Invite Already Exists", message: "이미 초대장이 존재합니다." }, { status: 400 });
		}

		// 초대장 생성
		const invite = await InviteModel.create(body);

		return NextResponse.json({ invite, message: "초대장이 성공적으로 생성되었습니다." }, { status: 201 });
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
