import JoinTeam from "@/app/(team)/join-team/[key]/_components/JoinTeam";

export const runtime = "edge";

export default function JoinTeamPage({ params }: { params: { key: string } }) {
	const { key } = params;

	return <JoinTeam inviteKey={key} />;
}
