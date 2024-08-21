import Button from "@/app/_components/Button";
import ModalWrapper from "@/app/_components/modal-contents/Modal";

type AccountDeletionProps = {
	onClick: () => void;
	close: () => void;
	modalContent: string;
};

export default function DeleteModal({ onClick, close, modalContent }: AccountDeletionProps): JSX.Element {
	return (
		<ModalWrapper close={close}>
			<div className="mx-auto min-w-[352px] font-medium">
				<div className="mt-6 px-9">
					<h1 className="mt-2 text-center text-lg">{modalContent}</h1>
					<div className="mt-6 flex h-[47px] gap-2">
						<Button variant="white" onClick={close}>
							닫기
						</Button>
						<Button
							variant="danger"
							onClick={() => {
								onClick();
								close();
							}}
						>
							삭제
						</Button>
					</div>
				</div>
			</div>
		</ModalWrapper>
	);
}
