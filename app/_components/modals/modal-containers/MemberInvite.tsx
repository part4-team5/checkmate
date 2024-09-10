import { useMutation } from "@tanstack/react-query";

import API from "@/app/_api";

import Icon from "@/app/_icons";

import toast from "@/app/_utils/Toast";

import ModalWrapper from "@/app/_components/modals/ModalWrapper";
import Form from "@/app/_components/Form";
import Button from "@/app/_components/Button";

type MemberInviteProps = {
	close: () => void;
	onCopy: () => void;
	groupId: number;
};
type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function MemberInvite({ close, onCopy, groupId }: MemberInviteProps): JSX.Element {
	const inviteMemberMutation = useMutation<Awaited<ReturnType<(typeof API)["api/invite/{id}"]["POST"]>>, Error, FormContext>({
		mutationFn: async (ctx: FormContext) => {
			const [token, group] = await Promise.all([API["{teamId}/groups/{id}/invitation"].GET({ id: groupId }), API["{teamId}/groups/{id}"].GET({ id: groupId })]);

			const payload: Parameters<(typeof API)["api/invite"]["POST"]>[1] = {
				email: ctx.values.email as string,
				groupName: group?.name as string,
				groupId,
				groupImage: group?.image,
				token,
			};

			const response = await API["api/invite"].POST({}, payload);

			return response;
		},
		onSuccess: (data, ctx) => {
			toast.success(`${ctx.values.email}님에게 초대장을 보냈습니다.`);
			close();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleInviteMember = (ctx: FormContext) => {
		if (inviteMemberMutation.isPending) return;
		inviteMemberMutation.mutate(ctx);
	};

	return (
		<ModalWrapper close={close}>
			<div className="pt-2 tablet:min-w-[320px]">
				<button type="button" onClick={close} className="absolute right-2 top-2" aria-label="close">
					<Icon.Close height={28} width={28} />
				</button>
				<h2 className="flex items-center justify-center text-xl font-semibold">멤버 초대</h2>

				<Form onSubmit={handleInviteMember}>
					<div className="pt-5">
						<label htmlFor="email" className="pl-1 text-lg">
							이메일
						</label>
						<div className="pt-2" />
						<Form.Input isModal type="email" id="email" tests={[{ type: "require", data: true, error: "이메일은 필수입니다." }]} />
						<div className="pt-2" />
						<Form.Error htmlFor="email" />
					</div>
					<div className="pt-2" />
					<div className="flex h-12 gap-3">
						<Button
							onClick={() => {
								onCopy();
								close();
							}}
							type="button"
						>
							초대 링크 복사하기
						</Button>
						{inviteMemberMutation.isPending ? <Button disabled>전송 중...</Button> : <Form.Submit>초대하기</Form.Submit>}
					</div>
				</Form>
			</div>
		</ModalWrapper>
	);
}
