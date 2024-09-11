/* eslint-disable import/prefer-default-export */
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/_api/_models/Users.model";
import dbConnect from "@/app/_utils/dbConnect";
import GroupModel from "@/app/_api/_models/Group.model";
import InviteModel from "@/app/_api/_models/Invite.model";

export async function DELETE(req: NextRequest) {
	await dbConnect();

	const url = req.nextUrl;
	const id = url.pathname.split("/").pop();

	if (!id) {
		return NextResponse.json({ error: "Invalid ID", message: "올바르지 않은 ID입니다." }, { status: 400 });
	}

	try {
		// 유저 찾기 및 삭제
		const user = await UserModel.findOneAndDelete({ id }).lean().exec();

		if (!user) {
			return NextResponse.json({ error: "User not found", message: "유저를 찾을 수 없습니다." }, { status: 404 });
		}

		// 그룹에서 유저 제거
		const groupUpdate = GroupModel.updateMany({ "members.userId": user.id }, { $pull: { members: { userId: user.id } } })
			.lean()
			.exec();

		// 유저 관련 초대 정보 삭제
		const inviteDelete = InviteModel.deleteMany({ userId: user.id }).lean().exec();

		// 병렬로 처리될 수 있는 작업들을 Promise.all로 병렬 실행
		await Promise.all([groupUpdate, inviteDelete]);

		return NextResponse.json({ user, message: "유저와 관련된 정보가 모두 삭제되었습니다." }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: "유저 삭제에 실패했습니다." }, { status: 500 });
	}
}
