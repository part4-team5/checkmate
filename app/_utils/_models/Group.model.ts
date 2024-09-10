/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
import mongoose, { Schema, Model, Document } from "mongoose";
import UserModel from "@/app/_utils/_models/Users.model"; // 유저 모델을 불러옴

interface IGroup extends Document {
	groupId: number;
	name: string;
	image: string;
	members: { userId: number; userEmail: string }[];
	createdAt: Date;
}

const GroupSchema: Schema<IGroup> = new Schema(
	{
		groupId: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
		members: [
			{
				userId: {
					type: Number,
					required: true,
				},
				userEmail: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

// 그룹에 멤버 추가 후 해당 유저 모델에 그룹 정보 추가
GroupSchema.post("save", async (doc) => {
	try {
		// 각 멤버를 유저 모델에 추가
		for (const member of doc.members) {
			await UserModel.findOneAndUpdate(
				{ id: member.userId }, // 유저의 ID로 검색
				{ $addToSet: { groups: doc._id } }, // 그룹 정보를 추가
				{ new: true },
			);
		}
	} catch (error) {
		console.error("Failed to add group to user:", error);
	}
});

// 그룹이 삭제될 때 유저의 그룹 정보에서 해당 그룹 제거
GroupSchema.post("findOneAndDelete", async (doc) => {
	try {
		if (doc) {
			// 그룹의 모든 멤버를 대상으로 유저 정보에서 해당 그룹을 제거
			for (const member of doc.members) {
				await UserModel.findOneAndUpdate({ id: member.userId }, { $pull: { groups: doc._id } });
			}
		}
	} catch (error) {
		console.error("Failed to remove group from user when group is deleted:", error);
	}
});

const GroupModel: Model<IGroup> = mongoose.models.Group || mongoose.model<IGroup>("Group", GroupSchema);

export default GroupModel;
