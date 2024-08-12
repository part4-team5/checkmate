"use client";

import API from "@/app/_api";
import Button from "@/app/_components/Button";
import Form from "@/app/_components/Form";
import ModalWrapper from "@/app/_components/modal-contents/Modal";
import useOverlay from "@/app/_hooks/useOverlay";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

function JoinTeamForm() {
	// TODO: 유저 정보에서 이메일 가져오기 (임시 이메일)
	const userEmail = "qq@qq.qq";

	const searchParams = useSearchParams();
	const [groupId] = useState(searchParams.get("groupID"));
	const [token, setToken] = useState<string | null>(searchParams.get("token"));

	const router = useRouter();
	const overlay = useOverlay();

	const hasExecutedRef = useRef(false);

	// Modal을 띄우는 함수
	const openModal = useCallback(
		(onClick: () => void, err?: string) => {
			overlay.open(({ close }) => (
				<ModalWrapper close={close}>
					<div className="flex flex-col items-center justify-center gap-5 px-5 pt-5">
						{err ? (
							<>
								<p className="text-2xl font-medium">팀 참여 실패</p>
								<p className="text-2lg font-medium">{err}</p>
							</>
						) : (
							<>
								<p className="text-2xl font-medium">팀 참여 완료</p>
								<p className="text-2lg font-medium">팀 참여가 완료되었습니다.</p>
							</>
						)}
						<div className="flex h-12 w-full gap-2">
							{/* 그룹 아이디가 있을 경우 팀으로 이동 버튼을 띄웁니다. */}
							{!err && groupId && (
								<Button
									onClick={() => {
										onClick();
										close();
									}}
								>
									팀으로 이동
								</Button>
							)}
							<Button variant="secondary" onClick={close}>
								확인
							</Button>
						</div>
					</div>
				</ModalWrapper>
			));
		},
		[groupId, overlay],
	);

	useEffect(() => {
		if (token) {
			// token을 숨기기 위해 주소를 변경합니다.
			window.history.replaceState(null, "", `/join-team?groupID=${groupId}`);
		}
	}, [groupId, token]);

	// Form을 통해 팀 참여 요청을 보내는 mutation
	const joinTeamFormMutation = useMutation<{}, Error, FormContext>({
		mutationFn: useCallback(async (ctx: FormContext) => {
			const formData = new FormData();
			for (const [key, value] of Object.entries(ctx.values)) {
				formData.append(key, value as string);
			}

			const teamUrl = formData.get("teamUrl") as string;
			return API["{teamId}/groups/accept-invitation"].POST({}, { userEmail, token: teamUrl });
		}, []),
		onSuccess: () => {
			openModal(() => {
				router.push(`/${groupId}`);
			});
		},
		onError: (error, ctx) => {
			openModal(() => {}, error.message);
			ctx.setError("teamUrl", "팀 링크가 올바르지 않습니다.");
		},
	});

	const handleJoinTeam = async (ctx: FormContext) => {
		if (joinTeamFormMutation.isPending) return;
		joinTeamFormMutation.mutate(ctx);
	};

	// 팀 참여 요청을 보내는 mutation
	const joinTeamMutation = useMutation<{}, Error, { token: string }>({
		mutationFn: useCallback(async () => API["{teamId}/groups/accept-invitation"].POST({}, { userEmail, token: token || "" }), [token]),
		onSuccess: () => {
			openModal(() => {
				router.push(`/${groupId}`);
			});
		},
		onError: (error) => {
			setToken(null);
			openModal(() => {}, error.message);
		},
	});

	// token이 있을 경우 바로 팀 참여 요청을 보냅니다.
	useEffect(() => {
		// 한 번만 실행되도록 합니다.
		if (token && !hasExecutedRef.current) {
			hasExecutedRef.current = true;
			joinTeamMutation.mutate({ token });
		}
	}, [token, joinTeamMutation]);

	if (token) {
		return <section className="flex size-full flex-col items-center justify-center text-3xl font-bold">팀참여 중...</section>;
	}

	return (
		<section className="flex size-full flex-col items-center justify-center">
			<div className="pb-20">
				<h1 className="text-[40px] font-medium leading-[48px] text-white">팀 참여하기</h1>
			</div>

			<div className="w-full">
				<Form onSubmit={handleJoinTeam}>
					<div className="mx-auto flex w-full max-w-[340px] flex-col tablet:max-w-[460px]">
						<label htmlFor="teamUrl" className="w-full pb-3 text-start text-lg text-text-primary">
							팀 링크
						</label>

						<Form.Input
							id="teamUrl"
							type="text"
							placeholder="팀 링크를 입력하세요"
							tests={[{ type: "require", data: true, error: "팀 링크는 필수로 입력해야 합니다" }]}
						/>

						<div className="pt-3" />

						<Form.Error htmlFor="teamUrl" />

						<div className="pt-6" />

						<div className="h-12">{joinTeamFormMutation.isPending ? <Button disabled>팀 참여 중</Button> : <Form.Submit>참여하기</Form.Submit>}</div>
					</div>
				</Form>
			</div>

			<div className="max-w-[340px] pt-6 tablet:max-w-[460px]">
				<p className="text-md font-normal text-text-primary tablet:text-lg">공유받은 팀 링크를 입력해 참여할 수 있어요.</p>
			</div>
		</section>
	);
}

export default function JoinTeamPage() {
	return (
		<Suspense>
			<JoinTeamForm />
		</Suspense>
	);
}
