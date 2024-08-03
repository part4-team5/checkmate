type TeamMetadataParams = {
	params: {
		"team-id": string;
	};
};

// 동적으로 팀 네임으로 변경 필요
export async function generateMetadata({ params }: TeamMetadataParams) {
	return {
		title: `${params["team-id"]} + "팀"`,
	};
}
export default function TeamPage() {
	return <div>팀 페이지 입니다.</div>;
}
