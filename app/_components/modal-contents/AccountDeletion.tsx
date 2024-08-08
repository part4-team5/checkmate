import Button from "@/app/_components/Button";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import WarningIcon from "@/public/icons/ic_warning";

type AccountDeletionProps = {
	onClick: () => void;
	close: () => void;
};
export default function AccountDeletion({ onClick, close }: AccountDeletionProps): JSX.Element {
	return (
		<ModalWrapper close={close}>
			<div className="min-w-[352px] font-medium tablet:mx-auto">
				<div className="px-9">
					<div className="mb-4 mt-6 flex justify-center">
						<WarningIcon width={24} height={24} />
					</div>
					<h1 className="mt-2 text-center text-lg">회원 탈퇴를 진행하시겠어요?</h1>
					<p className="mt-2 text-center text-md text-text-secondary">
						그룹장으로 있는 그룹은 자동으로 삭제되고,
						<br /> 모든 그룹에서 나가집니다.
					</p>
					<div className="mt-6 flex h-[47px] gap-2">
						<Button variant="white" onClick={close}>
							닫기
						</Button>
						<Button variant="danger" onClick={onClick}>
							회원 탈퇴
						</Button>
					</div>
				</div>
			</div>
		</ModalWrapper>
	);
}
