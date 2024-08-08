"use client";

import useModalStore from "@/app/_store/modalStore";
import { useEffect } from "react";
// 외부에서 모달을 랜더링하는 컴포넌트
export default function GlobalModals() {
	const { modalElements, isArrEmpty } = useModalStore();
	useEffect(() => {
		if (isArrEmpty()) {
			document.body.style.overflow = "unset";
		}
	}, [modalElements]);

	return (
		<>
			{modalElements.map(({ id, element }) => (
				<div key={id}>{element()}</div>
			))}
		</>
	);
}
