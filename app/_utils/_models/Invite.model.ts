/* eslint-disable no-underscore-dangle */
import UserModel from "@/app/_utils/_models/Users.model";
import mongoose, { Schema, Model, Document } from "mongoose";

interface IInvite extends Document {
	email: string;
	groupId: number;
	groupName: string;
	groupImage: string;
	token: string;
	key: string;
	createdAt: Date;
}

const InviteSchema: Schema<IInvite> = new Schema(
	{
		email: {
			type: String,
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
		key: {
			type: String,
			unique: true,
			sparse: true,
		},
	},
	{
		timestamps: true,
	},
);

// TTL 인덱스 설정 (createdAt 기준으로 3일 후 문서 삭제)
InviteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 });

// 초대장이 저장된 후 유저의 invite 배열에 초대 정보 추가
InviteSchema.post("save", async (doc) => {
	try {
		await UserModel.findOneAndUpdate({ email: doc.email }, { $push: { invite: doc._id } });
	} catch (error) {
		console.error("Failed to add invite to user:", error);
	}
});

// 초대장이 삭제되기 전에 유저의 invite 배열에서 초대 정보 제거
InviteSchema.post("findOneAndDelete", async (doc) => {
	try {
		if (doc) {
			await UserModel.findOneAndUpdate({ email: doc.email }, { $pull: { invite: doc._id } });
		}
	} catch (error) {
		console.error("Failed to remove invite from user:", error);
	}
});

const InviteModel: Model<IInvite> = mongoose.models.Invite || mongoose.model<IInvite>("Invite", InviteSchema);

export default InviteModel;
