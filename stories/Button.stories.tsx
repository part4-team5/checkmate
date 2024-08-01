/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
/* eslint-disable import/no-extraneous-dependencies */
import React, { MouseEvent, PropsWithChildren } from "react";
import { Meta, StoryFn } from "@storybook/react";
import Button from "../app/_components/Button";

export default {
	title: "Button",
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
	onClick: () => console.log("Button clicked!"),
};

export const Secondary = Template.bind({});
Secondary.args = {
	variant: "secondary",
	onClick: () => console.log("Button clicked!"),
};

export const White = Template.bind({});
White.args = {
	variant: "white",
	onClick: () => console.log("Button clicked!"),
};

export const Outline = Template.bind({});
Outline.args = {
	variant: "outline",
	onClick: () => console.log("Button clicked!"),
};

export const Danger = Template.bind({});
Danger.args = {
	variant: "danger",
	onClick: () => console.log("Button clicked!"),
};

export const FontSizeMd = Template.bind({});
FontSizeMd.args = {
	variant: "primary",
	fontSize: "md",
	onClick: () => console.log("Button clicked!"),
};

export const RoundedFull = Template.bind({});
RoundedFull.args = {
	variant: "primary",
	rounded: "full",
	onClick: () => console.log("Button clicked!"),
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
