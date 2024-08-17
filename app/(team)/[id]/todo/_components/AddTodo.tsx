/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import Button from "@/app/_components/Button";
import Modal from "@/app/(team)/[id]/todo/_components/AddTodoModal";
import useOverlay from "@/app/_hooks/useOverlay";

export default function AddTodo() {
	const overlay = useOverlay();

	return (
		<Button rounded="full" onClick={() => overlay.open((props) => <Modal {...props} />)}>
			+할 일 추가
		</Button>
	);
}
