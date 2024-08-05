export default function Page() {
	return <div>WIP</div>;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
	return {
		title: `${params.id}팀`,
	};
}
