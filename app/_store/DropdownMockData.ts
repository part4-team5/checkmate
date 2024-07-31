export type Team = {
	id: number;
	name: string;
	image: string;
};

export const mockTeams: Team[] = [
	{ id: 1, name: "경영관리 팀", image: "/images/img_team.png" },
	{ id: 2, name: "Team B", image: "/images/img_team.png" },
	{ id: 3, name: "Team C", image: "/images/img_team.png" },
];
