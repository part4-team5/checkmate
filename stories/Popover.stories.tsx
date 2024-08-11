/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Popover, { PopoverProps } from "../app/_components/Popover";

export default {
	title: "Popover",
	component: Popover,
} as Meta;

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
	gapX: 0,
	gapY: 0,
	overlay: () => <div className="flex h-[40px] w-[150px] items-center justify-center bg-brand-secondary">Overlay</div>,
	align: "right",
};
