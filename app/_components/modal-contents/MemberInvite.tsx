import React, { useState } from "react";
import Button from "@/app/_components/Button";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import CloseIcon from "@/public/icons/ic_close";

type MemberInviteProps = {
	onClick: () => void;
	close: () => void;
};

export default function MemberInvite({ onClick, close }: MemberInviteProps): JSX.Element {
	const [buttonText, setButtonText] = useState("링크 복사하기");

	const handleButtonClick = () => {
		onClick();
		setButtonText("복사됨!");

		setTimeout(() => {
			setButtonText("링크 복사하기");
		}, 2000);
	};

	return (
		<ModalWrapper close={close}>
			<div className="tablet:min-w-[352px]">
				<div className="flex justify-end">
					<button onClick={close} type="button" aria-label="Close modal">
						<CloseIcon width={24} height={24} />
					</button>
				</div>
				<div className="mx-auto max-w-[352px] font-medium">
					<div className="px-9">
						<h1 className="mt-2 text-center text-lg">멤버 초대</h1>
						<p className="mt-2 text-center text-md">그룹에 참여할 수 있는 링크를 복사합니다.</p>
						<div className="mt-10 h-[47px]">
							<Button onClick={handleButtonClick}>{buttonText}</Button>
						</div>
					</div>
				</div>
			</div>
		</ModalWrapper>
	);
}
