/* eslint-disable import/prefer-default-export */
import { NextRequest, NextResponse } from "next/server";
import GroupModel from "@/app/_api/_models/Group.model";
import dbConnect from "@/app/_utils/dbConnect";
import UserModel from "@/app/_api/_models/Users.model";

export const runtime = "edge";

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const body = await req.json();

		const createGroup = await GroupModel.create(body);

		const user = await UserModel.findOne({ email: body.members[0].userEmail }).lean().exec();
		if (!user) {
			return NextResponse.json({ error: "User Not Found", message: "유저를 찾을 수 없습니다." }, { status: 404 });
		}

		return NextResponse.json({ group: createGroup, message: "그룹이 성공적으로 생성되었습니다." }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error, message: "그룹 생성에 실패했습니다." }, { status: 500 });
	}
}
