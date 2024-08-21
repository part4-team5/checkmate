import InviteModel from "@/app/_utils/_models/Invite.model";
import mongoose, { Schema, Model, Document } from "mongoose";

type InviteType = InstanceType<typeof InviteModel>;

interface IUser extends Document {
	id: number;
	email: string;
	invite: InviteType[]; // 초대된 정보의 배열로 선언
}

const UserSchema: Schema<IUser> = new Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	invite: [
		{
			type: Schema.Types.ObjectId,
			ref: "Invite",
			required: false,
		},
	],
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
