import mongoose, { Schema, Model, Document } from "mongoose";

interface IUser extends Document {
	id: number;
	email: string;
	groups: mongoose.Types.ObjectId[]; // ObjectId 배열로 사용
	invite: mongoose.Types.ObjectId[]; // ObjectId 배열로 사용
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
	groups: [
		{
			type: Schema.Types.ObjectId,
			ref: "Group",
		},
	],
	invite: [
		{
			type: Schema.Types.ObjectId,
			ref: "Invite",
		},
	],
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
