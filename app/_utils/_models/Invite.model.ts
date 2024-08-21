import mongoose, { Schema, Model, Document } from "mongoose";

interface IInvite extends Document {
	email: string;
	groupName: string;
	groupImage: string;
	groupId: number;
	token: string;
}

const InviteSchema: Schema<IInvite> = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		groupId: {
			type: Number,
			required: true,
		},
		groupName: {
			type: String,
			required: true,
		},
		groupImage: {
			type: String,
		},
		token: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const InviteModel: Model<IInvite> = mongoose.models.Invite || mongoose.model<IInvite>("Invite", InviteSchema);

export default InviteModel;
