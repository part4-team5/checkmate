import { create } from "zustand";
import { ReactNode } from "react";
import { mockTeams } from "./DropdownMockData";

export type DropdownItem = {
	label?: string;
	path?: string;
	actionType?: "navigate" | "logout" | "modal";
	name?: string;
	image?: string;
	component?: ReactNode;
};

export type DropdownType = "edit" | "user" | "team";

type DropdownState = {
	getItems: (type: DropdownType) => DropdownItem[];
};

const useDropdownStore = create<DropdownState>((/* set */) => ({
	getItems: (type: DropdownType) => {
		const Edit: DropdownItem[] = [
			{ label: "수정하기", actionType: "modal" },
			{ label: "삭제하기", actionType: "modal" },
		];

		const User: DropdownItem[] = [
			{ label: "마이 히스토리", path: "/my-history", actionType: "navigate" },
			{ label: "계정 설정", path: "/account-settings", actionType: "navigate" },
			{ label: "팀 참여", path: "/", actionType: "navigate" },
			{ label: "로그아웃", actionType: "logout" },
		];

		const Team: DropdownItem[] = mockTeams.map((team) => ({
			name: team.name,
			image: team.image,
			actionType: "navigate",
			path: `/team/${team.name}`,
		}));

		const dropdowns = {
			edit: Edit,
			user: User,
			team: Team,
		};

		return dropdowns[type] || [];
	},
}));

export { useDropdownStore };
