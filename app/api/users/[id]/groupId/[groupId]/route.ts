import UserModel from "@/app/_utils/_models/Users.model";
import dbConnect from "@/app/_utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
	await dbConnect();

	try {
		const { pathname } = req.nextUrl;
		const parts = pathname.split("/");

		const userId = parts[parts.indexOf("invite") + 1]; // 경로에서 [id] 추출
		const groupId = parts[parts.indexOf("groupId") + 1]; // 경로에서 [groupId] 추출

		// 유저를 ID로 찾기
		const user = await UserModel.findOne({ id: userId });

		if (!user) {
			return NextResponse.json({ error: "User Not Found", message: "유저를 찾을 수 없습니다." }, { status: 404 });
		}

		// groups 배열에서 해당 groupId 제거
		const updatedGroups = user.groups.filter((group) => group.groupId.toString() !== groupId);

		// 업데이트된 groups 배열을 유저에 설정하고 저장
		user.groups = updatedGroups;
		const updatedUser = await user.save();

		return NextResponse.json(updatedUser, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: "그룹 제거에 실패했습니다." }, { status: 500 });
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
