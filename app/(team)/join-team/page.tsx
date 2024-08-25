import JoinTeam from "@/app/(team)/join-team/_components/JoinTeam";
import { redirect } from "next/navigation";

export default function JoinTeamPage({ searchParams }: { searchParams: { key: string } }) {
	const { key } = searchParams;

	if (!key) {
		redirect("/");
	}

	return <JoinTeam inviteKey={key} />;
}
