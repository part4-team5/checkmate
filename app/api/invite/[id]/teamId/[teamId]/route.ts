import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/_utils/dbConnect";
import InviteModel from "@/app/_utils/_models/Invite.model";

export async function DELETE(req: NextRequest) {
	await dbConnect();

	const url = req.nextUrl;
	const id = url.pathname.split("/").pop();
	const teamId = url.searchParams.get("teamId");

	if (!id) {
		return NextResponse.json({ error: "Invite ID is required" }, { status: 400 });
	}

	try {
		const invite = await InviteModel.findOneAndDelete({ id, teamId });

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
