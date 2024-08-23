import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/_utils/_models/Users.model";
import dbConnect from "@/app/_utils/dbConnect";

export async function GET() {
	await dbConnect();

	try {
		// 유저와 관련된 invite 데이터를 populate로 가져오기
		const users = await UserModel.find().populate("invite");

		return NextResponse.json(users, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error, message: "유저 정보를 가져오는데 실패했습니다." }, { status: 500 });
	}
}
export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const body = await req.json();

		if (await UserModel.findOne({ email: body.email })) {
			return NextResponse.json({ error: "User Already Exists", message: "이미 존재하는 유저입니다." }, { status: 400 });
		}

		const createUser = await UserModel.create(body);

		return NextResponse.json(createUser, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error, message: "유저 생성에 실패했습니다." }, { status: 500 });
	}
}
