import ModalWrapper from "@/app/_components/modal-contents/Modal";
import Form from "@/app/_components/Form";
import API from "@/app/_api";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/app/_store/useAuthStore";
import Icon from "@/app/_icons";

type MemberInviteProps = {
	close: () => void;
	groupId: number;
};
type FormContext = Parameters<Parameters<typeof Form>[0]["onSubmit"]>[0];

export default function MemberInvite({ close, groupId }: MemberInviteProps): JSX.Element {
	const { user } = useAuthStore.getState();

	const inviteMemberMutation = useMutation<Awaited<ReturnType<(typeof API)["api/invite/{id}"]["POST"]>>, Error, FormContext>({
		mutationFn: async (ctx: FormContext) => {
			const token = await API["{teamId}/groups/{id}/invitation"].GET({ id: groupId });
			const group = await API["{teamId}/groups/{id}"].GET({ id: groupId });

			const payload: Parameters<(typeof API)["api/invite"]["POST"]>[1] = {
				email: ctx.values.email as string,
				groupName: group?.name as string,
				groupId,
				groupImage: group?.image,
				token,
			};

			const response = await API["api/invite"].POST({ id: Number(user?.id) }, payload);

			return response;
		},
		onSuccess: () => {
			close();
		},
		onError: (error) => {
			console.log("onError called", error);
			console.log("Error message:", error.message);
		},
	});

	const handleInviteMember = (ctx: FormContext) => {
		if (inviteMemberMutation.isPending) return;
		inviteMemberMutation.mutate(ctx);
	};

	return (
		<ModalWrapper close={close}>
			<div className="py-2 tablet:min-w-[320px]">
				<button type="button" onClick={close} className="absolute right-2 top-2" aria-label="close">
					<Icon.Close height={28} width={28} />
				</button>
				<h2 className="flex items-center justify-center text-xl font-semibold">멤버 초대</h2>
				<Form onSubmit={handleInviteMember}>
					<div>
						<label htmlFor="email" className="pl-2 text-lg">
							이메일
						</label>
						<div className="pt-2" />
						<Form.Input type="email" id="email" tests={[{ type: "require", data: true, error: "이메일은 필수입니다." }]} />
						<div className="pt-2" />
						<Form.Error htmlFor="email" />
					</div>
					<div className="pt-4" />
					<div className="h-12">
						<Form.Submit>초대하기</Form.Submit>
					</div>
				</Form>
			</div>
		</ModalWrapper>
	);
}
