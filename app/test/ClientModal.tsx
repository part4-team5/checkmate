"use client";

import Button from "@/app/_components/Button";
import Modal from "@/app/_components/modal/Modal";
import ModalBody from "@/app/_components/modal/ModalBody";
import ModalHeader from "@/app/_components/modal/ModalHeader";
import useModalStore from "@/app/_store/modal";

export default function ClientModal() {
	const { openModal, closeModal } = useModalStore();
	return (
		<>
			<Button onClick={() => openModal("테스트")}>모달 열기</Button>
			<Modal modalLabel="테스트" disPlayWarningIcon displayCloseButton>
				<ModalHeader title="회원 탈퇴를 진행하시겠어요?">부가적인 내용 작성</ModalHeader>
				<ModalBody>
					<div>
						<Button onClick={() => closeModal("테스트")}>원하는 구조로 사용하세요</Button>
					</div>
				</ModalBody>
			</Modal>
		</>
	);
}
