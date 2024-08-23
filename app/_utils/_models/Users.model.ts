// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose, { Schema, Model, Document } from "mongoose";
import InviteModel from "@/app/_utils/_models/Invite.model";

type InviteType = InstanceType<typeof InviteModel>;

interface IUser extends Document {
	id: number;
	email: string;
	invite: InviteType[];
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
		},
	],
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
