import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";
import UserModel from "@/app/_utils/_models/Users.model";

export async function DELETE(req: NextRequest) {
	await dbConnect();

	const { pathname } = req.nextUrl;
	const parts = pathname.split("/");

	const id = parts[parts.indexOf("invite") + 1]; // 경로에서 [id] 추출
	const groupId = parts[parts.indexOf("groupId") + 1]; // 경로에서 [groupId] 추출

	console.log({ id, groupId });

	if (!id) {
		return NextResponse.json({ error: "Invite ID is required" }, { status: 400 });
	}

	try {
		const user = await UserModel.findOne({ id });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const invite = await InviteModel.findOneAndDelete({ email: user.email, groupId });

		if (!invite) {
			return NextResponse.json({ error: "Invite not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Invite deleted successfully", invite }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to delete invite", message: error }, { status: 500 });
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
