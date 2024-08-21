import mongoose, { Schema, Model, Document } from "mongoose";

interface IInvite extends Document {
	userId: number;
	teamId: Number;
	token: string;
}

const InviteSchema: Schema<IInvite> = new Schema(
	{
		userId: {
			type: Number,
			required: true,
			unique: true,
		},
		teamId: {
			type: Number,
			required: true,
			unique: true,
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
