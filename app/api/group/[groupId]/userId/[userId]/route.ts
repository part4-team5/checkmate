/* eslint-disable import/prefer-default-export */
import { NextRequest, NextResponse } from "next/server";
import GroupModel from "@/app/_api/_models/Group.model";
import dbConnect from "@/app/_utils/dbConnect";

// 그룹 멤버 제거
export async function DELETE(req: NextRequest) {
	await dbConnect();

	const { pathname } = req.nextUrl;
	const parts = pathname.split("/");

	const groupId = parts[parts.indexOf("group") + 1];
	const userId = parts[parts.indexOf("userId") + 1];

	try {
		const group = await GroupModel.findOne({ groupId }).lean().exec();
		if (!group) {
			return NextResponse.json({ error: "Group Not Found", message: "그룹을 찾을 수 없습니다." }, { status: 404 });
		}

		// 멤버 제거 (userId가 일치하는 멤버)
		group.members = group.members.filter((member) => member.userId.toString() !== userId);

		const updatedGroup = await group.save();

		return NextResponse.json({ group: updatedGroup, message: "멤버가 성공적으로 제거되었습니다." }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: "멤버 제거에 실패했습니다." }, { status: 500 });
	}
}
