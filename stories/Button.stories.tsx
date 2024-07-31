/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
/* eslint-disable import/no-extraneous-dependencies */
import React, { MouseEvent, PropsWithChildren } from "react";
import { Meta, StoryFn } from "@storybook/react";
import Button from "../app/_components/Button";

export default {
	title: "Example/Button",
	component: Button,
} as Meta;

interface ButtonProps extends PropsWithChildren {
	variant?: "primary" | "secondary" | "white" | "outline" | "danger";
	fontSize?: "lg" | "md";
	rounded?: "full" | "xl";
	href?: string;
	type?: "button" | "submit" | "reset";
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
}

const Template: StoryFn<ButtonProps> = (args) => (
	<div className="h-14 max-w-52">
		<Button {...args}>버튼</Button>
	</div>
);

export const Primary = Template.bind({});
Primary.args = {
	variant: "primary",
};

export const Secondary = Template.bind({});
Secondary.args = {
	variant: "secondary",
};

export const White = Template.bind({});
White.args = {
	variant: "white",
};

export const Outline = Template.bind({});
Outline.args = {
	variant: "outline",
};

export const Danger = Template.bind({});
Danger.args = {
	variant: "danger",
};

export const FontSizeMd = Template.bind({});
FontSizeMd.args = {
	variant: "primary",
	fontSize: "md",
};

export const RoundedFull = Template.bind({});
RoundedFull.args = {
	variant: "primary",
	rounded: "full",
};

export const AsLink = Template.bind({});
AsLink.args = {
	variant: "primary",
	href: "/example-link",
};

export const Disabled = Template.bind({});
Disabled.args = {
	variant: "primary",
	disabled: true,
};

export const WithClickHandler = Template.bind({});
WithClickHandler.args = {
	variant: "primary",
	onClick: () => console.log("Button clicked!"),
};
