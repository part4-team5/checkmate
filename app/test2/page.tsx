"use client";

import React from "react";
import Button from "@/app/_components/Button";
import useOverlay from "@/app/_hooks/useOverlay";
import FormModal from "@/app/test2/FooConfirmDialog";

interface AlertProps {
	title: string;
	onClick: () => void;
	buttonLabel: string;
}

function Alert({ title, onClick, buttonLabel }: AlertProps): JSX.Element {
	const overlay = useOverlay();
	const openModal2 = () => {
		overlay.open(({ close }) => <Alert title=" 두번째입니다." onClick={close} buttonLabel="동의" />);
	};
	return (
		<>
			<h2>{title}</h2>
			<Button onClick={openModal2}>두번쨰모달</Button>
			<Button onClick={onClick}>{buttonLabel}</Button>
		</>
	);
}

function Home(): JSX.Element {
	const overlay = useOverlay();

	const openAlert = () => {
		overlay.open(({ close }) => <Alert title="개인정보 수집에 동의하십니까?" onClick={close} buttonLabel="동의" />);
	};

	const openModal = () => {
		overlay.open(({ close }) => <Alert title="첫번째입니다." onClick={close} buttonLabel="동의" />);
	};

	const openModal2 = () => {
		overlay.open(({ close }) => <FormModal closeModal={close} />);
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center py-2">
			<h1>Home</h1>
			<Button onClick={openAlert}>카드 신청하기</Button>
			<Button onClick={openModal}>모달 열기</Button>
			<Button onClick={openModal2}>폼모달 열기</Button>
		</div>
	);
}

export default Home;
