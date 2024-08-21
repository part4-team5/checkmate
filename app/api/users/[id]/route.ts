import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/_utils/_models/Users.model";
import dbConnect from "@/app/_utils/dbConnect";

export async function DELETE(req: NextRequest) {
	await dbConnect();

	const url = req.nextUrl;
	const id = url.pathname.split("/").pop();

	if (!id) {
		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
	}

	try {
		const user = await UserModel.findOneAndDelete({ id });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "User deleted successfully", user }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to delete task", message: error }, { status: 500 });
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
