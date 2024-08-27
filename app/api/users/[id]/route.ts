import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/_utils/_models/Users.model";
import dbConnect from "@/app/_utils/dbConnect";

export async function PATCH(req: NextRequest) {
	await dbConnect();

	try {
		const body = await req.json();

		const url = req.nextUrl;
		const id = url.pathname.split("/").pop();

		if (!id) {
			return NextResponse.json({ error: "User ID", message: "올바르지 않은 ID입니다." }, { status: 400 });
		}

		const { groupId } = body;

		const user = await UserModel.findOne({ id });
		if (!user) {
			return NextResponse.json({ error: "User Not Found", message: "유저를 찾을 수 없습니다." }, { status: 404 });
		}

		// 유저의 groups 배열에 새로운 groupId가 있는지 확인
		const isGroupAlreadyAdded = user.groups.some((group) => group.groupId === groupId);
		if (isGroupAlreadyAdded) {
			return NextResponse.json({ error: "Group Already Added", message: "해당 그룹이 이미 추가되었습니다." }, { status: 400 });
		}

		// groups 배열에 새로운 groupId 추가
		user.groups.push({ groupId });
		const updatedUser = await user.save();

		return NextResponse.json({ updatedUser, message: "성공적으로 유저를 업데이트했습니다." }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: "유저 업데이트에 실패했습니다." }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	await dbConnect();

	const url = req.nextUrl;
	const id = url.pathname.split("/").pop();

	if (!id) {
		return NextResponse.json({ error: "Invalid ID", message: "올바르지 않은 ID입니다." }, { status: 400 });
	}

	try {
		const user = await UserModel.findOneAndDelete({ id });

		if (!user) {
			return NextResponse.json({ error: "User not found", message: "유저를 찾을 수 없습니다." }, { status: 404 });
		}

		return NextResponse.json({ user, message: "유저가 삭제되었습니다." }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: "유저 삭제에 실패했습니다." }, { status: 500 });
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