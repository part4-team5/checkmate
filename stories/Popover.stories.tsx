/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Popover from "../app/_components/Popover";

export default {
	title: "Popover",
	component: Popover,
} as Meta;

interface PopoverProps extends React.PropsWithChildren {
	gap?: number;
	overlay: JSX.Element;
	onOpen?: () => void;
	onClose?: () => void;
	anchorOrigin: Origin;
	overlayOrigin: Origin;
}

interface Origin {
	vertical: "top" | "center" | "bottom";
	horizontal: "left" | "center" | "right";
}

const Template: StoryFn<PopoverProps> = (args) => (
	<div className="flex h-screen w-screen flex-col items-center justify-center gap-[50px]">
		<Popover {...args}>
			<button className="flex w-[100px] items-center justify-center border border-black bg-brand-primary" type="button">
				Pop
			</button>
		</Popover>
	</div>
);

export const Default = Template.bind({});
Default.args = {
	overlay: <div className="flex w-[200px] items-center justify-center border border-black bg-brand-primary">Over</div>,
	anchorOrigin: { vertical: "bottom", horizontal: "center" },
	overlayOrigin: { vertical: "top", horizontal: "center" },
	gap: 0,
};
