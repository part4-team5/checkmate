/* eslint-disable no-alert */
/* eslint-disable react/function-component-definition */
import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import MemberInvite from "@/app/_components/modal-contents/MemberInvite";
import AccountDeletion from "@/app/_components/modal-contents/AccountDeletion";
import Logout from "@/app/_components/modal-contents/Logout";
import useOverlay from "@/app/_hooks/useOverlay";
import Button from "@/app/_components/Button";
import useModalStore from "@/app/_store/modalStore";

export default {
	title: "ModalContents",
} as Meta;

// Example component to demonstrate modals
const ModalExample: React.FC = () => {
	const { modalElements } = useModalStore();

	const overlay = useOverlay();

	const openMemberInvite = () => {
		overlay.open(({ close }) => <MemberInvite onCopy={() => {}} groupId={1} close={close} />);
	};

	const openAccountDeletion = () => {
		overlay.open(({ close }) => <AccountDeletion onClick={() => alert("탈퇴하기")} close={close} />);
	};

	const openLogout = () => {
		overlay.open(({ close }) => <Logout onClick={() => alert("로그아웃하기")} close={close} />);
	};

	return (
		<div className="flex w-screen flex-col items-center justify-center gap-6">
			<div className="flex h-10 w-full max-w-screen-tablet gap-4">
				<Button onClick={openMemberInvite}>멤버 초대 모달 열기</Button>
				<Button onClick={openAccountDeletion}>계정 삭제 모달 열기</Button>
				<Button onClick={openLogout}>로그아웃 모달 열기</Button>
			</div>

			{modalElements.map((modal) => (
				<div key={modal.id}>{modal.element()}</div>
			))}
		</div>
	);
};

const Template: StoryFn = () => <ModalExample />;

export const Default = Template.bind({});
