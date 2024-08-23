// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose, { Schema, Model, Document } from "mongoose";

interface IInvite extends Document {
	email: string;
	groupName: string;
	groupImage: string;
	groupId: number;
	token: string;
	createdAt: Date;
}

const InviteSchema: Schema<IInvite> = new Schema(
	{
		email: {
			type: String,
			required: true,
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

// TTL 인덱스 설정 (createdAt 기준으로 3일 후 문서 삭제)
InviteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 });

const InviteModel: Model<IInvite> = mongoose.models.Invite || mongoose.model<IInvite>("Invite", InviteSchema);

export default InviteModel;
