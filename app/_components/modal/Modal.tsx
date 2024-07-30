"use client";

import useModalStore from "@/app/_store/modal";
import CloseIcon from "@/public/icons/ic_close";
import WarningIcon from "@/public/icons/ic_warning";
import { useEffect, useState } from "react";
import ReactDom from "react-dom";

type ModalProps = {
	disPlayWarningIcon?: boolean;
	displayCloseButton?: boolean;
	children: React.ReactNode;
	modalLabel: string;
};

/**
 *  모달을 사용하려면 Modal 컴포넌트를 사용합니다.
 *  모달을 열거나 닫을 때는 useModalStore의 openModal, closeModal 함수를 사용합니다.
 *  disPlayWarningIcon 모달 상단에 경고 아이콘을 표시할지 여부를 결정합니다.
 *  displayCloseButton 모달 상단에 닫기 버튼을 표시할지 여부를 결정합니다.
 *  모달을 구별하는 데 사용되는 modalLabel은 필수 prop입니다.
 *  모달을 사용하려는 컴포넌트는 반드시 'use client'를 선언해야 합니다. -> 서버컴포넌트를 유지하고 싶으면 컴포넌트로 랩핑해서 사랩하세요.
 * @example
 * export default function ClientModal() {
	const { openModal, closeModal } = useModalStore();
	return (
		<>
			<Button onClick={() => openModal("테스트")}>모달 열기</Button>
			<Modal modalLabel="테스트" disPlayWarningIcon displayCloseButton>
				<ModalHeader title="제목 작성">부가적인 내용 작성</ModalHeader>
				<ModalBody>
					<div>
						<Button onClick={() => closeModal("테스트")}>원하는 구조로 사용하세요</Button>
					</div>
				</ModalBody>
			</Modal>
		</>
	);
}

 */

export default function Modal({ disPlayWarningIcon, displayCloseButton, modalLabel, children }: ModalProps) {
	const [mounted, setMounted] = useState(false);
	const { isModalOpen, closeModal } = useModalStore();
	const isOpen = isModalOpen(modalLabel);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!mounted || !isOpen) return null;

	return ReactDom.createPortal(
		<div className="fixed inset-0 bottom-0 left-0 right-0 top-0 z-50 bg-black bg-opacity-70">
			<div className="fixed bottom-0 w-full rounded-t-xl bg-background-secondary px-4 pb-8 pt-4 text-text-primary tablet:bottom-auto tablet:left-1/2 tablet:top-1/2 tablet:w-auto tablet:-translate-x-1/2 tablet:-translate-y-1/2 tablet:rounded-xl">
				{disPlayWarningIcon && (
					<div className="mb-4 mt-6 flex justify-center">
						<WarningIcon width={24} height={24} />
					</div>
				)}
				{displayCloseButton && (
					<button aria-label="close" className="absolute right-[31px] top-[22px]" onClick={() => closeModal(modalLabel)} type="button">
						<CloseIcon width={12} height={12} />
					</button>
				)}
				{children}
			</div>
		</div>,
		document.getElementById("portal") as HTMLElement,
	);
}
