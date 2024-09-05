import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_utils/dbConnect";
import GroupModel from "@/app/_utils/_models/Group.model";

// 그룹 멤버 추가
export async function POST(req: NextRequest) {
	await dbConnect();

	const url = req.nextUrl;
	const groupId = url.pathname.split("/").pop();

	try {
		const body = await req.json();
		const { userId, userEmail } = body;

		const group = await GroupModel.findOne({ groupId }).lean().exec();
		if (!group) {
			return NextResponse.json({ error: "Group Not Found", message: "그룹을 찾을 수 없습니다." }, { status: 404 });
		}

		// 이미 멤버로 있는지 확인
		const isMemberExists = group.members.some((member) => member.userId === userId);
		if (isMemberExists) {
			return NextResponse.json({ error: "Member Exists", message: "해당 유저는 이미 그룹에 속해 있습니다." }, { status: 400 });
		}

		// 멤버 추가
		group.members.push({ userId, userEmail });
		const updatedGroup = await group.save();

		return NextResponse.json({ group: updatedGroup, message: "멤버가 성공적으로 추가되었습니다." }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: "멤버 추가에 실패했습니다." }, { status: 500 });
	}
}

// 그룹 삭제
export async function DELETE(req: NextRequest) {
	await dbConnect();

	const url = req.nextUrl;
	const groupId = url.pathname.split("/").pop();

	try {
		const group = await GroupModel.findOneAndDelete({ groupId });

		if (!group) {
			return NextResponse.json({ error: "Group Not Found", message: "그룹을 찾을 수 없습니다." }, { status: 404 });
		}

		return NextResponse.json({ message: "그룹이 성공적으로 삭제되었습니다." }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: "그룹 삭제에 실패했습니다." }, { status: 500 });
	}
}
