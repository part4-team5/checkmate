"use client";

import { useEffect } from "react";

import useModalStore from "@/app/_store/ModalStore";

// 외부에서 모달을 랜더링하는 컴포넌트
export default function GlobalModals() {
	const { modalElements, isArrEmpty } = useModalStore();
	useEffect(() => {
		if (isArrEmpty()) {
			document.body.style.overflow = "unset";
		}
	}, [modalElements, isArrEmpty]);

	return (
		<>
			{modalElements.map(({ id, element }) => (
				<div key={id}>{element()}</div>
			))}
		</>
	);
}
