import GlobalModals from "@/app/_components/GlobalModals";
import Header from "@/app/_components/header";
import "./globals.css";

export const metadata = {
	title: {
		template: "%s | coworkers",
		default: "coworkers",
		absolute: "",
	},
	description:
		"Coworkers는 팀 기반의 협업 플랫폼으로, 사용자가 팀을 생성하고 팀원들과 할 일 목록과 개별 할 일을 공유할 수 있도록 지원합니다. 팀원들은 서로의 할 일 진행 상황을 실시간으로 확인하고, 각자의 일정을 효율적으로 관리할 수 있습니다. 매일 팀원이 수행해야 할 할 일들을 명확하게 보여주어 팀의 생산성을 극대화하고 협업을 촉진합니다.",
};

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
	return (
		<html lang="ko">
			<body>
				<Header />
				{children}
				<GlobalModals />
			</body>
		</html>
	);
}
