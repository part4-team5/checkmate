import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";
import UserModel from "@/app/_utils/_models/Users.model";

export async function POST(req: NextRequest) {
	await dbConnect();

	try {
		const body = await req.json();
		const invite = await InviteModel.create(body);

		if (await !UserModel.findOne({ email: invite.email })) {
			return NextResponse.json({ error: "User Not Found" }, { status: 404 });
		}

		return NextResponse.json(invite, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to create invite", message: error }, { status: 400 });
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
