import Button from "@/app/_components/Button";

type AccountDeletionProps = {
	onClick: () => void;
	close: () => void;
};
export default function Logout({ onClick, close }: AccountDeletionProps): JSX.Element {
	return (
		<div className="mx-auto min-w-[352px] font-medium">
			<div className="mt-6 px-9">
				<h1 className="mt-2 text-center text-lg">로그아웃 하시겠어요?</h1>
				<div className="mt-6 flex h-[47px] gap-2">
					<Button variant="white" onClick={close}>
						닫기
					</Button>
					<Button variant="danger" onClick={onClick}>
						로그아웃
					</Button>
				</div>
			</div>
		</div>
	);
}
