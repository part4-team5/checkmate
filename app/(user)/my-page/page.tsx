"use client";

import API from "@/app/_api/index";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import useOverlay from "@/app/_hooks/useOverlay";
import AccountDeletion from "@/app/_components/modal-contents/AccountDeletion";
import useAuthStore from "@/app/_store/useAuthStore";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import Button from "@/app/_components/Button";
import Form from "@/app/_components/Form";
import Image from "next/image";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function Page() {
	const router = useRouter();
	const overlay = useOverlay();
	const [isAccountDeletionOpen, setAccountDeletionOpen] = useState(false);
	const { user, setUser } = useAuthStore();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const data = await API["{teamId}/user"].GET({});
				setUser(data);
			} catch (error) {
				console.error("유저정보 불러오기 실패", error);
			}
		};

		if (!user) {
			fetchUserData();
		}
	}, [user, setUser]);

	// 이미지 업로드
	const imageUpload = useCallback(async (file: File): Promise<{ url: string | undefined }> => {
		if (typeof file === "string") return { url: undefined };

		const response = await API["{teamId}/images/upload"].POST({}, file);
		return response;
	}, []);

	// 프로필 수정
	const updateProfileMutation = useMutation({
		mutationFn: async (ctx: FormContext) => {
			const formData = new FormData();
			for (const [key, value] of Object.entries(ctx.values)) {
				formData.append(key, value as string);
			}

			const file = formData.get("profileImage") as File;
			const nickname = formData.get("nickname") as string;

			const { url } = await imageUpload(file);

			const payload: Parameters<(typeof API)["{teamId}/user"]["PATCH"]>[1] = { image: url ?? "", nickname };

			return API["{teamId}/user"].PATCH({}, payload);
		},
		onSuccess: () => {
			router.replace(window.location.pathname);
		},
		onError: (error) => {
			alert(`${error.message || "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	const handleUpdateProfile = useCallback(
		(ctx: FormContext) => {
			updateProfileMutation.mutate(ctx);
		},
		[updateProfileMutation],
	);

	// 회원 탈퇴
	const deleteAccountMutation = useMutation({
		mutationFn: async () => {
			// 실제 회원 탈퇴 API 호출
			await API["{teamId}/user"].DELETE({});
		},
		onSuccess: () => {
			alert("회원 탈퇴가 완료되었습니다.");
			router.push("/"); // 탈퇴 후 메인 페이지로 이동
		},
		onError: (error) => {
			alert(`${error.message || "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	const openAccountDeletionModal = () => setAccountDeletionOpen(true);
	const closeAccountDeletionModal = () => setAccountDeletionOpen(false);

	// 비밀번호 변경 처리
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
			alert(`${error.message || "알 수 없는 오류 발생"}`);
			console.error(error);
		},
	});

	const handleChangePassword = useCallback(
		(ctx: FormContext) => {
			changePasswordMutation.mutate(ctx);
		},
		[changePasswordMutation],
	);

	// 비밀번호 변경 모달
	const openChangePasswordModal = useCallback(() => {
		overlay.open(({ close }) => (
			<ModalWrapper close={close}>
				<div className="w-[280px] p-[20px_0] text-text-primary">
					<p className="mb-[16px] text-center font-medium">비밀번호 변경하기</p>
					<Form onSubmit={handleChangePassword}>
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
		));
	}, [overlay]);

	return (
		<main className="box-border w-full bg-background-primary p-[40px_0]">
			<section className="m-[0_16px] w-auto tablet:m-[0_auto] tablet:w-[790px]">
				<h2 className="mb-[24px] text-xl font-bold text-text-primary">계정 설정</h2>
				<Form onSubmit={handleUpdateProfile}>
					<div className="flex flex-col gap-[12px] text-text-primary">
						<div className="flex">
							<Form.ImageInput id="profileImage" tests={[{ type: "file_size", data: 1048576, error: "이미지 파일 크기는 1MB 이하여야 합니다" }]}>
								{(file) => (
									<div className="relative flex size-16 cursor-pointer items-center justify-center">
										<div
											className={`relative size-full overflow-hidden rounded-full border-border-primary/10 bg-background-secondary ${file ? "border-2" : ""}`}
										>
											<Image src={file ? (file as string) : "/icons/defaultAvatar.svg"} alt="Profile Image" fill />
										</div>

										<Image src="/icons/edit.svg" alt="Profile Preview" width={20} height={20} className="absolute bottom-0 right-0" />
									</div>
								)}
							</Form.ImageInput>
						</div>
						<Form.Error htmlFor="profileImage" />

						<label htmlFor="nickname" className="mt-[12px]">
							이름
						</label>
						<Form.Input
							id="nickname"
							type="text"
							placeholder="이름을 입력해주세요."
							init={user?.nickname || ""}
							tests={[
								{ type: "require", data: true, error: "이름을 입력해주세요." },
								{ type: "maxlength", data: 30, error: "30자 이하로 입력해주세요." },
							]}
						/>
						<Form.Error htmlFor="nickname" />

						<p className="mt-[12px]">이메일</p>
						<div className="flex h-[48px] w-full items-center rounded-[12px] border border-border-primary bg-background-tertiary px-[16px] text-lg font-normal text-text-disabled">
							{user?.email || ""}
						</div>

						<div className="mt-[24px] h-12">
							<Form.Submit>저장하기</Form.Submit>
						</div>
					</div>
				</Form>
				<div className="align-center mt-[24px] flex justify-between font-medium">
					<button type="button" onClick={openAccountDeletionModal} className="flex gap-[8px] text-status-danger">
						<Image src="/icons/ic_delete.svg" alt="탈퇴하기" width={24} height={24} />
						탈퇴하기
					</button>
					<button type="button" onClick={openChangePasswordModal} className="flex gap-[8px] text-text-emerald">
						<Image src="/images/reset_password.png" alt="비밀번호 변경" width={24} height={24} />
						비밀번호 변경
					</button>
				</div>
			</section>

			{/* 회원 탈퇴 팝업 */}
			{isAccountDeletionOpen && <AccountDeletion onClick={() => deleteAccountMutation.mutate()} close={closeAccountDeletionModal} />}
		</main>
	);
}
