import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import Form from "@/app/_components/Form";
import Button from "@/app/_components/Button";
import { useCallback } from "react";
import API from "@/app/_api";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

interface ChangePasswordModalProps {
	close: () => void;
}

export default function ChangePassword({ close }: ChangePasswordModalProps) {
	const router = useRouter();

	const changePasswordMutation = useMutation({
		mutationFn: async (ctx: FormContext) => {
			const { password, passwordConfirmation } = ctx.values as {
				password: string;
				passwordConfirmation: string;
			};
			return API["{teamId}/user/password"].PATCH({}, { password, passwordConfirmation });
		},
		onSuccess: () => {
			alert("비밀번호가 성공적으로 변경되었습니다.");
			router.push("/");
		},
		onError: (error) => {
			alert(`${error.message ?? "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	// const handleChangePassword = (ctx: FormContext) => {
	// 	changePasswordMutation.mutate(ctx);
	// };
	const handleChangePassword = useCallback(
		(ctx: FormContext) => {
			changePasswordMutation.mutate(ctx);
		},
		[changePasswordMutation],
	);

	return (
		<ModalWrapper close={close}>
			<div className="w-[280px] pt-[20px] text-text-primary">
				<p className="mb-[16px] text-center font-medium">비밀번호 변경하기</p>
				<Form
					onSubmit={(ctx: FormContext) => {
						handleChangePassword(ctx);
						close(); // 비밀번호 변경 성공 후 모달 닫기
					}}
				>
					<div className="flex flex-col gap-[8px]">
						<label htmlFor="password">새 비밀번호</label>
						<Form.Input
							id="password"
							type="password"
							placeholder="새 비밀번호를 입력해주세요."
							tests={[
								{ type: "require", data: true, error: "비밀번호를 입력해주세요." },
								{ type: "minlength", data: 8, error: "비밀번호는 최소 8자입니다." },
								{ type: "maxlength", data: 20, error: "비밀번호는 최대 20자입니다." },
								{ type: "match", data: /^[a-zA-Z0-9!@#%^&*]*$/, error: "비밀번호는 숫자, 영문, 특수문자만 가능합니다." },
							]}
						/>
						<Form.Error htmlFor="password" />

						<label htmlFor="passwordConfirmation">새 비밀번호 확인</label>
						<Form.Input
							id="passwordConfirmation"
							type="password"
							placeholder="새 비밀번호를 다시 입력해주세요."
							tests={[
								{ type: "sync", data: "password", error: "비밀번호가 일치하지 않습니다." },
								{ type: "require", data: true, error: "비밀번호 확인을 입력해주세요." },
							]}
						/>
						<Form.Error htmlFor="passwordConfirmation" />
					</div>
					<div className="mt-6 flex h-[47px] gap-2">
						<Button variant="secondary" onClick={close}>
							닫기
						</Button>
						<Button variant="primary" type="submit">
							변경하기
						</Button>
					</div>
				</Form>
			</div>
		</ModalWrapper>
	);
}
