"use client";

import useModalStore from "@/app/_store/modalStore";
// 외부에서 모달을 랜더링하는 컴포넌트
export default function GlobalModals() {
	const { modalElements, isArrEmpty } = useModalStore();

	if (isArrEmpty()) {
		document.body.style.overflow = "unset";
	}

	return (
		<>
			{modalElements.map(({ id, element }) => (
				<div key={id}>{element()}</div>
			))}
		</>
	);
}
