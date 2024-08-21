import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/_utils/_models/Users.model";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";

export async function GET(req: NextRequest) {
	await dbConnect();

	const url = req.nextUrl;
	const id = url.pathname.split("/").pop();

	try {
		const user = await UserModel.findOne({ id });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const invite = await InviteModel.find({ userId: user.id });

		if (!invite) {
			return NextResponse.json({ error: "Invite not found" }, { status: 404 });
		}

		return NextResponse.json(invite, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const body = await req.json();
		const invite = await InviteModel.create(body);

		return NextResponse.json(invite, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to create invite", message: error }, { status: 400 });
	}
}

export function OPTIONS() {
	return new Response(null, {
		status: 200,
		headers: {
			Allow: "GET, POST, OPTIONS",
		},
	});
}
