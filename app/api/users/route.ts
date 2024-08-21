import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/_utils/_models/Users.model";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";

export async function GET() {
	await dbConnect();

	try {
		const users = await UserModel.find();
		const Invites = await InviteModel.find();

		const usersWithInvites = users.map((user) => {
			const userInvites = Invites.filter((invite) => invite.userId === user.id);

			// 유저 객체에 `invite` 필드를 추가
			return {
				...user.toObject(),
				invite: userInvites,
			};
		});

		return NextResponse.json(usersWithInvites, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch users", message: error }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const body = await req.json();

		if (await UserModel.findOne({ email: body.email })) {
			return console.log("User already exists");
		}

		const createUser = await UserModel.create(body);

		return NextResponse.json(createUser, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to create user", message: error }, { status: 400 });
	}
}
